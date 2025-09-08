const BASE_URL = import.meta.env.VITE_API_URL;

export const getUsers = async () => {
	const response = await fetch(`${BASE_URL}/users/`);
	if (!response.ok) throw new Error('Erro ao buscar usuários');
	return response.json();
};

export const createUser = async (data: any) => {
	const response = await fetch(`${BASE_URL}/users`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!response.ok) throw new Error('Erro ao criar usuário');
	return response.json();
};

export const deleteUsers = async (ids: number[]) => {
	console.log("ids", ids)
	const response = await fetch(`${BASE_URL}/users/`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ids })
	});

	if (!response.ok) throw new Error('Erro ao excluir usuários');
	return response.json();
};

