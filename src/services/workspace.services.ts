const BASE_URL = import.meta.env.VITE_API_URL;

export const getWorkspaces = async () => {
	const response = await fetch(`${BASE_URL}/workspaces/`);
	if (!response.ok) throw new Error('Erro ao buscar workspaces');
	return response.json();
};

export const getWorkspaceById = async (id: number) => {
	const response = await fetch(`${BASE_URL}/workspaces/${id}`);
	if (!response.ok) throw new Error('Erro ao buscar workspace por ID');
	return response.json();
};

export const createWorkspace = async (data: any) => {
	const response = await fetch(`${BASE_URL}/workspaces/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!response.ok) throw new Error('Erro ao criar workspace');
	return response.json();
};

export const updateWorkspace = async (id: number, data: any) => {
	const response = await fetch(`${BASE_URL}/workspaces/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!response.ok) throw new Error('Erro ao atualizar workspace');
	return response.json();
};

export const deleteWorkspaces = async (ids: number[]) => {
	const response = await fetch(`${BASE_URL}/workspaces/`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ids })
	});
	if (!response.ok) throw new Error('Erro ao excluir workspaces');
	return response.json();
};
