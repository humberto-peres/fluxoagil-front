const BASE_URL = import.meta.env.VITE_API_URL;

export type EpicDTO = {
  id: number;
  key: string;
  title: string;
  description?: string | null;
  status: string;
  startDate?: string | null;
  targetDate?: string | null;
  priority?: { id: number; name: string; label: string } | null;
  workspaceId: number;
  _count?: { tasks: number };
};

export type EpicWithTasksDTO = EpicDTO & {
  tasks: Array<{
    id: number;
    title: string;
    description?: string | null;
    estimate?: string | null;
    startDate?: string | null;
    deadline?: string | null;
    sprintId?: number | null;
    stepId: number;
    priorityId: number;
    typeTaskId: number;
    reporterId: number | null;
    assigneeId?: number | null;
    userId: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

export const getEpics = async (params?: { workspaceId?: number; status?: string }) => {
  const qs = new URLSearchParams();
  if (params?.workspaceId) qs.set('workspaceId', String(params.workspaceId));
  if (params?.status) qs.set('status', params.status);
  const res = await fetch(`${BASE_URL}/epics/?${qs.toString()}`);
  if (!res.ok) throw new Error('Erro ao listar épicos');
  return res.json() as Promise<EpicDTO[]>;
};

export const getEpicById = async (id: number) => {
  const res = await fetch(`${BASE_URL}/epics/${id}`);
  if (!res.ok) throw new Error('Erro ao buscar épico');
  return res.json() as Promise<EpicWithTasksDTO>;
};

export const createEpic = async (data: any) => {
  const res = await fetch(`${BASE_URL}/epics/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar épico');
  return res.json() as Promise<EpicDTO>;
};

export const updateEpic = async (id: number, data: any) => {
  const res = await fetch(`${BASE_URL}/epics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao atualizar épico');
  return res.json() as Promise<EpicDTO>;
};

export const deleteEpics = async (ids: number[]) => {
  const res = await fetch(`${BASE_URL}/epics/`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error('Erro ao excluir épicos');
  return res.json();
};
