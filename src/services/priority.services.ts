const BASE_URL = import.meta.env.VITE_API_URL;

export const getPriorities = async () => {
	const response = await fetch(`${BASE_URL}/priorities/`);
	if (!response.ok) throw new Error('Erro ao buscar prioridades');
	return response.json();
};

export const createPriority = async (data: any) => {
	console.log("data create", data)
	const response = await fetch(`${BASE_URL}/priorities/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!response.ok) throw new Error('Erro ao criar prioridade');
	return response.json();
};

export const updatePriority = async (id: number, data: any) => {
	const response = await fetch(`${BASE_URL}/priorities/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!response.ok) throw new Error('Erro ao atualizar prioridade');
	return response.json();
};

export const deletePriorities = async (ids: number[]) => {
	const response = await fetch(`${BASE_URL}/priorities/`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ids }),
	});
	if (!response.ok) throw new Error('Erro ao excluir prioridades');
	return response.json();
};
