import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getSprints, createSprint, updateSprint, activateSprint, closeSprint } from '@/services/sprint.services';

const BASE_URL = import.meta.env.VITE_API_URL;

describe('sprint.services', () => {
	const mockSprint = {
		id: 1,
		name: 'Sprint 1',
		startDate: '2024-01-01',
		endDate: '2024-01-15',
		isActive: true,
		workspaceId: 1,
		activatedAt: '2024-01-01',
		closedAt: null,
	};

	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getSprints', () => {
		it('deve buscar sprints por workspaceId', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => [mockSprint],
			} as Response);

			const result = await getSprints({ workspaceId: 1 });

			expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/sprints/?workspaceId=1`);
			expect(result).toEqual([mockSprint]);
		});

		it('deve buscar sprints com state', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => [mockSprint],
			} as Response);

			await getSprints({ workspaceId: 1, state: 'active' });

			expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/sprints/?workspaceId=1&state=active`);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getSprints({ workspaceId: 1 })).rejects.toThrow('Erro ao buscar sprints');
		});
	});

	describe('createSprint', () => {
		it('deve criar sprint', async () => {
			const newSprint = {
				name: 'Sprint 2',
				workspaceId: 1,
			};

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 2, ...newSprint }),
			} as Response);

			const result = await createSprint(newSprint);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/sprints/`,
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify(newSprint),
				})
			);
			expect(result).toEqual({ id: 2, ...newSprint });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(createSprint({})).rejects.toThrow('Erro ao criar sprint');
		});
	});

	describe('updateSprint', () => {
		it('deve atualizar sprint', async () => {
			const updates = { name: 'Sprint Atualizada' };

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ ...mockSprint, ...updates }),
			} as Response);

			const result = await updateSprint(1, updates);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/sprints/1`,
				expect.objectContaining({
					method: 'PUT',
					body: JSON.stringify(updates),
				})
			);
			expect(result.name).toBe('Sprint Atualizada');
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(updateSprint(1, {})).rejects.toThrow('Erro ao atualizar sprint');
		});
	});

	describe('activateSprint', () => {
		it('deve ativar sprint', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ ...mockSprint, isActive: true }),
			} as Response);

			const result = await activateSprint(1);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/sprints/1/activate`,
				expect.objectContaining({
					method: 'POST',
				})
			);
			expect(result.isActive).toBe(true);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(activateSprint(1)).rejects.toThrow('Erro ao ativar sprint');
		});
	});

	describe('closeSprint', () => {
		it('deve encerrar sprint sem mover tarefas', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ success: true }),
			} as Response);

			const result = await closeSprint(1);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/sprints/1/close`,
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify({ move: undefined }),
				})
			);
			expect(result).toEqual({ success: true });
		});

		it('deve encerrar sprint movendo para backlog', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ success: true }),
			} as Response);

			await closeSprint(1, { to: 'backlog' });

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/sprints/1/close`,
				expect.objectContaining({
					body: JSON.stringify({ move: { to: 'backlog' } }),
				})
			);
		});

		it('deve encerrar sprint movendo para outra sprint', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ success: true }),
			} as Response);

			await closeSprint(1, { to: 'sprint', sprintId: 2 });

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/sprints/1/close`,
				expect.objectContaining({
					body: JSON.stringify({ move: { to: 'sprint', sprintId: 2 } }),
				})
			);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(closeSprint(1)).rejects.toThrow('Erro ao encerrar sprint');
		});
	});
});