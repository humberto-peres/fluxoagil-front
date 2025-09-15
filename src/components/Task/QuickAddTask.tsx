import React, { useEffect, useMemo, useState } from 'react';
import { Input, App } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');

import { getWorkspaces } from '@/services/workspace.services';
import { getTaskTypes } from '@/services/taskType.services';
import { getPriorities } from '@/services/priority.services';
import { getUsers } from '@/services/user.services';
import { getSprints } from '@/services/sprint.services';

type Option = { id: number; name: string; code?: string };

type Props = {
  onCreate: (payload: any) => Promise<void>;
  selectedWorkspaceId?: number | null;
};

const normalize = (s: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

function parsePlusDays(token: string) {
  const m = token.match(/^\+(\d+)d$/i);
  if (!m) return null;
  return dayjs().add(Number(m[1]), 'day');
}

function parsePrazo(v: string) {
  const n = normalize(v);
  if (n === 'hoje') return dayjs();
  if (n === 'amanha' || n === 'amanhã') return dayjs().add(1, 'day');
  const plus = parsePlusDays(v);
  if (plus) return plus;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
    const [d, m, y] = v.split('/');
    return dayjs(`${y}-${m}-${d}T00:00:00`);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    return dayjs(`${v}T00:00:00`);
  }
  return null;
}

const QuickAddTask: React.FC<Props> = ({ onCreate, selectedWorkspaceId }) => {
  const { message } = App.useApp();
  const [value, setValue] = useState('');
  const [workspaces, setWorkspaces] = useState<Option[]>([]);
  const [types, setTypes] = useState<Option[]>([]);
  const [priorities, setPriorities] = useState<Option[]>([]);
  const [users, setUsers] = useState<Option[]>([]);
  const [sprints, setSprints] = useState<Option[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [wsRes, tRes, pRes, uRes] = await Promise.all([
          getWorkspaces(), getTaskTypes(), getPriorities(), getUsers()
        ]);
        setWorkspaces((wsRes || []).map((w: any) => ({ id: w.id, name: w.name, code: w.code })));
        setTypes((tRes || []).map((t: any) => ({ id: t.id, name: t.name })));
        setPriorities((pRes || []).map((p: any) => ({ id: p.id, name: p.name })));
        setUsers((uRes || []).map((u: any) => ({ id: u.id, name: u.name })));
      } catch {
        message.error('Não foi possível carregar listas para criação rápida');
      }
    })();
  }, []);

  const workspaceFromPromptOrSelected = useMemo(() => {
    const m = value.match(/(?:^|\s)(?:ws|workspace|w):\s*([A-Za-z]{1,5})/i);
    if (m) {
      const code = m[1].toUpperCase();
      const found = workspaces.find(w => (w.code || '').toUpperCase() === code);
      if (found) return found.id;
    }
    return selectedWorkspaceId ?? null;
  }, [value, workspaces, selectedWorkspaceId]);

  useEffect(() => {
    (async () => {
      if (!workspaceFromPromptOrSelected) {
        setSprints([]);
        return;
      }
      try {
        const spRes = await getSprints({ workspaceId: workspaceFromPromptOrSelected });
        setSprints((spRes || []).map((s: any) => ({ id: s.id, name: s.name })));
      } catch {
        setSprints([]);
      }
    })();
  }, [workspaceFromPromptOrSelected]);

  function findWorkspaceIdByCode(code?: string) {
    if (!code) return null;
    const found = workspaces.find(w => (w.code || '').toUpperCase() === code.toUpperCase());
    return found?.id ?? null;
  }

  function findByNameOrId(list: Option[], token?: string) {
    if (!token) return null;
    const idMatch = token.match(/^#?(\d+)$/);
    if (idMatch) {
      const id = Number(idMatch[1]);
      return list.find(i => i.id === id)?.id ?? null;
    }
    const nameToken = token.replace(/^@/, '');
    const n = normalize(nameToken);
    const byName = list.find(i => normalize(i.name) === n);
    return byName?.id ?? null;
  }

  function mapPriority(token?: string) {
    if (!token) return null;
    const n = normalize(token);
    const mapping: Record<string, string> = {
      'alta': 'alta',
      'media': 'média',
      'média': 'média',
      'baixa': 'baixa',
    };
    const canonical = mapping[n];
    if (canonical) {
      const p = priorities.find(p => normalize(p.name) === normalize(canonical));
      if (p) return p.id;
    }
    return findByNameOrId(priorities, token);
  }

  function mapType(token?: string) {
    if (!token) return null;
    const tByName = types.find(t => normalize(t.name) === normalize(token));
    if (tByName) return tByName.id;
    return findByNameOrId(types, token);
  }

  function mapSprint(token?: string) {
    if (!token) return null;
    const byId = findByNameOrId(sprints, token);
    if (byId) return byId;
    const byName = sprints.find(s => normalize(s.name) === normalize(token));
    return byName?.id ?? null;
  }

  function parse(text: string) {
    const obj: any = {};

    const wsMatch = text.match(/(?:^|\s)(?:ws|workspace|w):\s*([A-Za-z]{1,5})/i);
    if (wsMatch) obj.workspaceId = findWorkspaceIdByCode(wsMatch[1]);

    const prioMatch = text.match(/(?:^|\s)(?:prio|prioridade|p):\s*([^\s]+)/i);
    if (prioMatch) obj.priorityId = mapPriority(prioMatch[1]);

    const tipoMatch = text.match(/(?:^|\s)(?:tipo|type|t):\s*([^\s]+)/i);
    if (tipoMatch) obj.typeTaskId = mapType(tipoMatch[1]);

    const respMatch = text.match(/(?:^|\s)(?:resp|responsavel|responsável):\s*([^\s]+)/i);
    if (respMatch) obj.assigneeId = findByNameOrId(users, respMatch[1]);

    const repMatch = text.match(/(?:^|\s)(?:rep|report|relator):\s*([^\s]+)/i);
    if (repMatch) obj.reporterId = findByNameOrId(users, repMatch[1]);

    const sprintMatch = text.match(/(?:^|\s)(?:sprint|sp):\s*([^\s]+)/i);
    if (sprintMatch) obj.sprintId = mapSprint(sprintMatch[1]);

    const prazoMatch = text.match(/(?:^|\s)(?:prazo|deadline|due):\s*([^\s]+)/i);
    if (prazoMatch) {
      const d = parsePrazo(prazoMatch[1]);
      if (d?.isValid()) obj.deadline = d.toISOString();
    }

    const estMatch = text.match(/(?:^|\s)(?:est|estimativa|estimate):\s*([^\s]+)/i);
    if (estMatch) obj.estimate = estMatch[1];

    const cleaned = text
      .replace(wsMatch?.[0] || '', '')
      .replace(prioMatch?.[0] || '', '')
      .replace(tipoMatch?.[0] || '', '')
      .replace(respMatch?.[0] || '', '')
      .replace(repMatch?.[0] || '', '')
      .replace(sprintMatch?.[0] || '', '')
      .replace(prazoMatch?.[0] || '', '')
      .replace(estMatch?.[0] || '', '')
      .trim();

    obj.title = cleaned || 'Nova atividade';

    return obj;
  }

  const handleSubmit = async () => {
    const parsed = parse(value);

    const workspaceId =
      parsed.workspaceId ??
      (selectedWorkspaceId ? Number(selectedWorkspaceId) : null);

    if (!workspaceId) {
      message.warning('Informe o workspace (ex.: ws:WOR) ou selecione um no Board.');
      return;
    }

    if (!parsed.priorityId || !parsed.typeTaskId || !parsed.reporterId) {
      message.warning('Dica: use prio:alta|média|baixa, tipo:tarefa|bug e rep:@nome para enriquecer a criação.');
    }

    try {
      await onCreate({
        title: parsed.title,
        description: null,
        estimate: parsed.estimate ?? null,
        startDate: null,
        deadline: parsed.deadline ?? null,
        sprintId: parsed.sprintId ?? null,
        typeTaskId: parsed.typeTaskId ?? undefined,
        priorityId: parsed.priorityId ?? undefined,
        reporterId: parsed.reporterId ?? undefined,
        assigneeId: parsed.assigneeId ?? null,
        userId: parsed.reporterId ?? parsed.assigneeId,
        workspaceId,
      });
      setValue('');
      message.success('Atividade criada!');
    } catch (e: any) {
      message.error(e?.message || 'Erro ao criar atividade');
    }
  };

  return (
    <Input.Search
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onSearch={handleSubmit}
      placeholder="Digite: Título prio:alta tipo:tarefa resp:@ana prazo:05/09/2025 ws:WOR est:2.5"
      enterButton="Criar"
      allowClear
    />
  );
};

export default QuickAddTask;
