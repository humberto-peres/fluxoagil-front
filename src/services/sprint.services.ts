const BASE_URL = import.meta.env.VITE_API_URL;

export type SprintDTO = {
	id: number;
	name: string;
	startDate: string | null;
	endDate: string | null;
	isActive: boolean;
	workspaceId: number;
};

export const getSprints = async (params: { workspaceId: number; active?: boolean }) => {
	const qs = new URLSearchParams();
	qs.set('workspaceId', String(params.workspaceId));
	if (params.active != null) qs.set('active', String(params.active));
	const res = await fetch(`${BASE_URL}/sprints/?${qs.toString()}`);
	if (!res.ok) throw new Error('Erro ao buscar sprints');
	return res.json() as Promise<SprintDTO[]>;
};

export const createSprint = async (data: any) => {
	const res = await fetch(`${BASE_URL}/sprints/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error('Erro ao criar sprint');
	return res.json();
};

export const updateSprint = async (id: number, data: any) => {
	const res = await fetch(`${BASE_URL}/sprints/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error('Erro ao atualizar sprint');
	return res.json();
};

export const activateSprint = async (id: number) => {
	const res = await fetch(`${BASE_URL}/sprints/${id}/activate`, { method: 'POST' });
	if (!res.ok) throw new Error('Erro ao ativar sprint');
	return res.json();
};

export const closeSprint = async (id: number) => {
	const res = await fetch(`${BASE_URL}/sprints/${id}/close`, { method: 'POST' });
	if (!res.ok) throw new Error('Erro ao encerrar sprint');
	return res.json();
};
