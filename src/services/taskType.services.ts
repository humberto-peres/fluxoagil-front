const BASE_URL = import.meta.env.VITE_API_URL;

export const getTaskTypes = async () => {
	const res = await fetch(`${BASE_URL}/task-types/`, {
		credentials: 'include'
	});
	if (!res.ok) throw new Error('Erro ao buscar tipos de atividade');
	return res.json();
};

export const getTaskTypeById = async (id: number) => {
	const res = await fetch(`${BASE_URL}/task-types/${id}`, {
		credentials: 'include'
	});
	if (!res.ok) throw new Error('Erro ao buscar tipo de atividade');
	return res.json();
};

export const createTaskType = async (data: any) => {
	const res = await fetch(`${BASE_URL}/task-types/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
		credentials: 'include'
	});
	if (!res.ok) throw new Error('Erro ao criar tipo de atividade');
	return res.json();
};

export const updateTaskType = async (id: number, data: any) => {
	const res = await fetch(`${BASE_URL}/task-types/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
		credentials: 'include'
	});
	if (!res.ok) throw new Error('Erro ao atualizar tipo de atividade');
	return res.json();
};

export const deleteTaskTypes = async (ids: number[]) => {
	const res = await fetch(`${BASE_URL}/task-types/`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ids }),
		credentials: 'include'
	});
	if (!res.ok) throw new Error('Erro ao excluir tipos de atividade');
	return res.json();
};
