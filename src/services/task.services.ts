const BASE_URL = import.meta.env.VITE_API_URL;

export type TaskDTO = {
	id: number;
	title: string;
	description?: string | null;
	estimate?: string | null;
	startDate?: string | null;
	deadline?: string | null;
	deadlineInfo?: { label: string; type: 'success' | 'warning' | 'error' } | null;

	sprintId?: number | null;
	stepId: number;
	epicId?: number;

	priorityId: number;
	typeTaskId: number;

	reporterId: number | null;
	assigneeId?: number | null;
	userId: number;

	status: string;
	workspaceId?: number;
	sequenceNumber?: number;

	priority?: { id: number; name: string; label: string };
	typeTask?: { id: number; name: string };
	reporter?: { id: number; name: string } | null;
	assignee?: { id: number; name: string } | null;
	step?: { id: number; name: string };
	workspace?: { id: number; key: string };
	epic?: { id: number; key: string; title: string } | null;
	sprint?: {id: number, name: string }

	idTask: string;
};

export const getAllTasks = async () => {
	const res = await fetch(`${BASE_URL}/tasks/all`,{
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Erro ao buscar tarefas');
	return res.json() as Promise<TaskDTO[]>;
};

export const getTasks = async (params: { workspaceId: number; stepId?: number; sprintId?: number | null }) => {
	const qs = new URLSearchParams();
	qs.set('workspaceId', String(params.workspaceId));
	if (params.stepId) qs.set('stepId', String(params.stepId));
	if (params.sprintId !== undefined) {
		if (params.sprintId === null) qs.set('sprintId', 'null');
		else qs.set('sprintId', String(params.sprintId));
	}
	const res = await fetch(`${BASE_URL}/tasks/?${qs.toString()}`,{
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Erro ao buscar tarefas');
	return res.json() as Promise<TaskDTO[]>;
};

export const getTaskById = async (id: number) => {
	const res = await fetch(`${BASE_URL}/tasks/${id}`,{
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Erro ao buscar tarefa');
	return res.json() as Promise<TaskDTO>;
};

export const createTask = async (data: any) => {
	const res = await fetch(`${BASE_URL}/tasks/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Erro ao criar tarefa');
	return res.json() as Promise<TaskDTO>;
};

export const updateTask = async (id: number, data: any) => {
	const res = await fetch(`${BASE_URL}/tasks/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Erro ao atualizar tarefa');
	return res.json() as Promise<TaskDTO>;
};

export const deleteTasks = async (ids: number[]) => {
	const res = await fetch(`${BASE_URL}/tasks/`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ids }),
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Erro ao excluir tarefas');
	return res.json();
};

export const moveTask = async (id: number, stepId: number) => {
	const res = await fetch(`${BASE_URL}/tasks/${id}/move`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ stepId }),
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Erro ao mover tarefa');
	return res.json() as Promise<TaskDTO>;
};
