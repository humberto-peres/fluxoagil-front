import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	getTeams,
	getTeamById,
	createTeam,
	updateTeam,
	deleteTeams,
	getTeamMembers,
	getAvailableUsers,
	addTeamMembers,
	removeTeamMember,
} from '@/services/team.services';

const BASE_URL = import.meta.env.VITE_API_URL;

describe('team.services', () => {
	const mockTeams = [
		{ id: 1, name: 'Backend' },
		{ id: 2, name: 'Frontend' },
	];

	const mockMembers = [
		{ user: { id: 1, name: 'João Silva' } },
		{ user: { id: 2, name: 'Maria Santos' } },
	];

	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getTeams', () => {
		it('deve listar equipes', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockTeams,
			} as Response);

			const result = await getTeams();

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/teams/`,
				{ credentials: 'include' }
			);
			expect(result).toEqual(mockTeams);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getTeams()).rejects.toThrow('Erro ao buscar equipes');
		});
	});

	describe('getTeamById', () => {
		it('deve buscar equipe por id', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockTeams[0],
			} as Response);

			const result = await getTeamById(1);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/teams/1`,
				{ credentials: 'include' }
			);
			expect(result).toEqual(mockTeams[0]);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getTeamById(1)).rejects.toThrow('Erro ao buscar equipe');
		});
	});

	describe('createTeam', () => {
		it('deve criar equipe', async () => {
			const newTeam = { name: 'Mobile' };

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 3, ...newTeam }),
			} as Response);

			const result = await createTeam(newTeam);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/teams/`,
				expect.objectContaining({
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newTeam),
					credentials: 'include',
				})
			);
			expect(result).toEqual({ id: 3, ...newTeam });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(createTeam({ name: 'Test' })).rejects.toThrow('Erro ao criar equipe');
		});
	});

	describe('updateTeam', () => {
		it('deve atualizar equipe', async () => {
			const updates = { name: 'Backend Atualizado' };

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 1, ...updates }),
			} as Response);

			const result = await updateTeam(1, updates);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/teams/1`,
				expect.objectContaining({
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updates),
					credentials: 'include',
				})
			);
			expect(result.name).toBe('Backend Atualizado');
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(updateTeam(1, { name: 'Test' })).rejects.toThrow('Erro ao atualizar equipe');
		});
	});

	describe('deleteTeams', () => {
		it('deve excluir equipes', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ success: true }),
			} as Response);

			const result = await deleteTeams([1, 2]);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/teams/`,
				expect.objectContaining({
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ ids: [1, 2] }),
					credentials: 'include',
				})
			);
			expect(result).toEqual({ success: true });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(deleteTeams([1])).rejects.toThrow('Erro ao excluir equipes');
		});
	});

	describe('getTeamMembers', () => {
		it('deve buscar membros da equipe', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockMembers,
			} as Response);

			const result = await getTeamMembers(1);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/team-members/1`,
				{ credentials: 'include' }
			);
			expect(result).toEqual(mockMembers);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getTeamMembers(1)).rejects.toThrow('Erro ao buscar membros da equipe');
		});
	});

	describe('getAvailableUsers', () => {
		it('deve buscar usuários disponíveis', async () => {
			const availableUsers = [
				{ id: 3, name: 'Pedro Oliveira' },
			];

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => availableUsers,
			} as Response);

			const result = await getAvailableUsers(1);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/team-members/available/1`,
				{ credentials: 'include' }
			);
			expect(result).toEqual(availableUsers);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getAvailableUsers(1)).rejects.toThrow('Erro ao buscar membros da equipe');
		});
	});

	describe('addTeamMembers', () => {
		it('deve adicionar membros à equipe', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ success: true }),
			} as Response);

			const result = await addTeamMembers(1, [3, 4]);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/team-members/1`,
				expect.objectContaining({
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userIds: [3, 4] }),
					credentials: 'include',
				})
			);
			expect(result).toEqual({ success: true });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(addTeamMembers(1, [3])).rejects.toThrow('Erro ao adicionar membros');
		});
	});

	describe('removeTeamMember', () => {
		it('deve remover membro da equipe', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ success: true }),
			} as Response);

			const result = await removeTeamMember(1, 2);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/team-members/1/2`,
				expect.objectContaining({
					method: 'DELETE',
					credentials: 'include',
				})
			);
			expect(result).toEqual({ success: true });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(removeTeamMember(1, 2)).rejects.toThrow('Erro ao remover membro');
		});
	});
});