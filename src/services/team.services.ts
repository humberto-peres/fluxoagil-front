const BASE_URL = import.meta.env.VITE_API_URL;

export const getTeams = async () => {
	const response = await fetch(`${BASE_URL}/teams/`);
	if (!response.ok) throw new Error('Erro ao buscar equipes');
	return response.json();
};

export const getTeamById = async (id: number) => {
	const response = await fetch(`${BASE_URL}/teams/${id}`);
	if (!response.ok) throw new Error('Erro ao buscar equipe');
	return response.json();
};

export const createTeam = async (data: { name: string }) => {
	const response = await fetch(`${BASE_URL}/teams/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!response.ok) throw new Error('Erro ao criar equipe');
	return response.json();
};

export const updateTeam = async (id: number, data: { name: string }) => {
	const response = await fetch(`${BASE_URL}/teams/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!response.ok) throw new Error('Erro ao atualizar equipe');
	return response.json();
};

export const deleteTeams = async (ids: number[]) => {
	const response = await fetch(`${BASE_URL}/teams/`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ids }),
	});
	if (!response.ok) throw new Error('Erro ao excluir equipes');
	return response.json();
};

// === TEAM MEMBERS ===

export const getTeamMembers = async (teamId: number) => {
	const response = await fetch(`${BASE_URL}/team-members/${teamId}`);
	if (!response.ok) throw new Error('Erro ao buscar membros da equipe');
	return response.json();
};

export const getAvailableUsers = async (teamId: number) => {
	const response = await fetch(`${BASE_URL}/team-members/available/${teamId}`);
	if (!response.ok) throw new Error('Erro ao buscar membros da equipe');
	return response.json();
};

export const addTeamMembers = async (teamId: number, userIds: number[]) => {
	const response = await fetch(`${BASE_URL}/team-members/${teamId}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userIds }),
	});
	if (!response.ok) throw new Error('Erro ao adicionar membros');
	return response.json();
};

export const removeTeamMember = async (teamId: number, userId: number) => {
	const response = await fetch(`${BASE_URL}/team-members/${teamId}/${userId}`, {
		method: 'DELETE',
	});
	if (!response.ok) throw new Error('Erro ao remover membro');
	return response.json();
};
