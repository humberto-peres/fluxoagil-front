import React, { useEffect, useState } from 'react';
import { App, Input } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');

import { useAuth } from '@/context/AuthContext';
import { getTaskTypes } from '@/services/taskType.services';
import { getPriorities } from '@/services/priority.services';
import { getSprints } from '@/services/sprint.services';

type Props = {
	onCreate: (payload: any) => Promise<void>;
	selectedWorkspaceId?: number | null;
};

const QuickAddTask: React.FC<Props> = ({ onCreate, selectedWorkspaceId }) => {
	const { message } = App.useApp();
	const { user: me } = useAuth();

	const [title, setTitle] = useState('');
	const [defaultTypeId, setDefaultTypeId] = useState<number | undefined>(undefined);
	const [defaultPriorityId, setDefaultPriorityId] = useState<number | undefined>(undefined);
	const [defaultSprintId, setDefaultSprintId] = useState<number | undefined>(undefined);

	useEffect(() => {
		(async () => {
			try {
				const [types, priorities] = await Promise.all([getTaskTypes(), getPriorities()]);

				const firstType = types?.[0];
				setDefaultTypeId(firstType?.id);

				const medium = priorities?.find((p: any) =>
					p.name?.toLowerCase?.().includes('méd') || p.name?.toLowerCase?.().includes('med')
				);
				setDefaultPriorityId((medium ?? priorities?.[0])?.id);
			} catch {
				/* noop */
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			if (!selectedWorkspaceId) {
				setDefaultSprintId(undefined);
				return;
			}
			try {
				const actives = await getSprints({ workspaceId: selectedWorkspaceId, active: true });
				setDefaultSprintId(actives?.[0]?.id);
			} catch {
				setDefaultSprintId(undefined);
			}
		})();
	}, [selectedWorkspaceId]);

	const handleCreate = async () => {
		if (!selectedWorkspaceId) {
			message.warning('Selecione um Workspace para criar rapidamente.');
			return;
		}
		if (!defaultTypeId || !defaultPriorityId || !me?.id) {
			message.error('Não foi possível preparar os padrões de criação. Tente pelo formulário completo.');
			return;
		}

		try {
			await onCreate({
				title: title.trim(),
				description: null,
				estimate: null,
				startDate: null,
				deadline: null,
				sprintId: defaultSprintId ?? null,
				typeTaskId: defaultTypeId,
				priorityId: defaultPriorityId,
				reporterId: me.id,
				assigneeId: null,
				userId: me.id,
				workspaceId: selectedWorkspaceId,
				epicId: null,
			});
			setTitle('');
			message.success('Atividade criada!');
		} catch (e: any) {
			message.error(e?.message || 'Erro ao criar atividade');
		}
	};

	return (
		<Input.Search
			value={title}
			size='large'
			onChange={(e) => setTitle(e.target.value)}
			onSearch={handleCreate}
			placeholder="Criar rapidamente: digite o título e pressione Enter"
			enterButton="Criar"
			allowClear
			disabled={!selectedWorkspaceId}
		/>
	);
};

export default QuickAddTask;
