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
	
	const responseData = await res.json();
	
	if (!res.ok) {
		throw new Error(responseData.message || 'Erro ao criar usuário');
	}
	
	return responseData;
};

export const updateUser = async (id: number, data: any) => {
	const res = await fetch(`${BASE_URL}/users/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(data),
	});
	
	const responseData = await res.json();
	
	if (!res.ok) {
		throw new Error(responseData.message || 'Erro ao atualizar usuário');
	}
	
	return responseData;
};

export const deleteUsers = async (ids: number[]) => {
	const res = await fetch(`${BASE_URL}/users/`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ ids }),
	});
	
	const data = await res.json();
	
	if (!res.ok) {
		throw new Error(data.message || 'Erro ao excluir usuários');
	}
	
	return data;
};