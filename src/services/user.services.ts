const BASE_URL = import.meta.env.VITE_API_URL;

export const getUsers = async () => {
	const res = await fetch(`${BASE_URL}/users/`, {
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Erro ao buscar usuários');
	return res.json();
};

export const getUserById = async (id: number) => {
	const res = await fetch(`${BASE_URL}/users/${id}`, {
		credentials: "include",
	});
	if (!res.ok) throw new Error("Falha ao carregar usuário");
	return res.json();
};

export const createUser = async (data: any) => {
	const res = await fetch(`${BASE_URL}/users`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error('Erro ao criar usuário');
	return res.json();
};

export const deleteUsers = async (ids: number[]) => {
	const res = await fetch(`${BASE_URL}/users/`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ ids }),
	});
	if (!res.ok) throw new Error('Erro ao excluir usuários');
	return res.json();
};
