import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	getWorkspaces,
	getWorkspaceById,
	getMyWorkspaces,
	canAccessWorkspace,
	createWorkspace,
	updateWorkspace,
	deleteWorkspaces,
} from '@/services/workspace.services';

const BASE_URL = import.meta.env.VITE_API_URL;

describe('workspace.services', () => {
	const mockWorkspaces = [
		{ id: 1, name: 'Projeto Alpha', key: 'ALPHA', methodology: 'Scrum' },
		{ id: 2, name: 'Projeto Beta', key: 'BETA', methodology: 'Kanban' },
	];

	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getWorkspaces', () => {
		it('deve listar workspaces', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockWorkspaces,
			} as Response);

			const result = await getWorkspaces();

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/workspaces/`,
				expect.objectContaining({ credentials: 'include' })
			);
			expect(result).toEqual(mockWorkspaces);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getWorkspaces()).rejects.toThrow('Erro ao buscar workspaces');
		});
	});

	describe('getWorkspaceById', () => {
		it('deve buscar workspace por id', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockWorkspaces[0],
			} as Response);

			const result = await getWorkspaceById(1);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/workspaces/1`,
				expect.objectContaining({ credentials: 'include' })
			);
			expect(result).toEqual(mockWorkspaces[0]);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getWorkspaceById(1)).rejects.toThrow('Erro ao buscar workspace por ID');
		});
	});

	describe('getMyWorkspaces', () => {
		it('deve buscar workspaces do usuário', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockWorkspaces,
			} as Response);

			const result = await getMyWorkspaces();

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/workspaces/allowed`,
				expect.objectContaining({ credentials: 'include' })
			);
			expect(result).toEqual(mockWorkspaces);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getMyWorkspaces()).rejects.toThrow('Erro ao buscar workspaces do usuário');
		});
	});

	describe('canAccessWorkspace', () => {
		it('deve verificar acesso permitido', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ allowed: true }),
			} as Response);

			const result = await canAccessWorkspace(1);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/workspaces/1/can-access`,
				expect.objectContaining({ credentials: 'include' })
			);
			expect(result).toEqual({ allowed: true });
		});

		it('deve verificar acesso negado', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ allowed: false }),
			} as Response);

			const result = await canAccessWorkspace(1);

			expect(result).toEqual({ allowed: false });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(canAccessWorkspace(1)).rejects.toThrow('Erro ao checar acesso ao workspace');
		});
	});

	describe('createWorkspace', () => {
		it('deve criar workspace', async () => {
			const newWorkspace = {
				name: 'Projeto Gamma',
				key: 'GAMMA',
				methodology: 'Scrum',
			};

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 3, ...newWorkspace }),
			} as Response);

			const result = await createWorkspace(newWorkspace);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/workspaces/`,
				expect.objectContaining({
					method: 'POST',
					credentials: 'include',
					body: JSON.stringify(newWorkspace),
				})
			);
			expect(result).toEqual({ id: 3, ...newWorkspace });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(createWorkspace({})).rejects.toThrow('Erro ao criar workspace');
		});
	});

	describe('updateWorkspace', () => {
		it('deve atualizar workspace', async () => {
			const updates = { name: 'Projeto Alpha Atualizado' };

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ ...mockWorkspaces[0], ...updates }),
			} as Response);

			const result = await updateWorkspace(1, updates);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/workspaces/1`,
				expect.objectContaining({
					method: 'PUT',
					credentials: 'include',
					body: JSON.stringify(updates),
				})
			);
			expect(result.name).toBe('Projeto Alpha Atualizado');
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(updateWorkspace(1, {})).rejects.toThrow('Erro ao atualizar workspace');
		});
	});

	describe('deleteWorkspaces', () => {
		it('deve excluir workspaces', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ success: true }),
			} as Response);

			const result = await deleteWorkspaces([1, 2]);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/workspaces/`,
				expect.objectContaining({
					method: 'DELETE',
					credentials: 'include',
					body: JSON.stringify({ ids: [1, 2] }),
				})
			);
			expect(result).toEqual({ success: true });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(deleteWorkspaces([1])).rejects.toThrow('Erro ao excluir workspaces');
		});
	});
});