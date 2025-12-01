import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getEpics, getEpicById, createEpic, updateEpic, deleteEpics } from '@/services/epic.services';

const BASE_URL = import.meta.env.VITE_API_URL;

describe('epic.services', () => {
	const mockEpic = {
		id: 1,
		key: 'PROJ-1',
		title: 'Épico Principal',
		description: 'Descrição do épico',
		status: 'active',
		startDate: '2024-01-01',
		targetDate: '2024-12-31',
		priority: { id: 1, name: 'Alta', label: 'red' },
		workspaceId: 1,
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01',
		_count: { tasks: 5 },
	};

	const mockEpicWithTasks = {
		...mockEpic,
		tasks: [
			{
				id: 1,
				title: 'Tarefa 1',
				description: null,
				estimate: '8h',
				startDate: null,
				deadline: null,
				sprintId: null,
				stepId: 1,
				priorityId: 1,
				typeTaskId: 1,
				reporterId: 1,
				assigneeId: 1,
				userId: 1,
				status: 'open',
				createdAt: '2024-01-01',
				updatedAt: '2024-01-01',
			},
		],
	};

	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getEpics', () => {
		it('deve listar épicos sem filtros', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => [mockEpic],
			} as Response);

			const result = await getEpics();

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/epics/?`,
				{ credentials: 'include' }
			);
			expect(result).toEqual([mockEpic]);
		});

		it('deve listar épicos com workspaceId', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => [mockEpic],
			} as Response);

			await getEpics({ workspaceId: 1 });

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/epics/?workspaceId=1`,
				{ credentials: 'include' }
			);
		});

		it('deve listar épicos com status', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => [mockEpic],
			} as Response);

			await getEpics({ status: 'active' });

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/epics/?status=active`,
				{ credentials: 'include' }
			);
		});

		it('deve listar épicos com múltiplos filtros', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => [mockEpic],
			} as Response);

			await getEpics({ workspaceId: 1, status: 'active' });

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/epics/?workspaceId=1&status=active`,
				{ credentials: 'include' }
			);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getEpics()).rejects.toThrow('Erro ao listar épicos');
		});
	});

	describe('getEpicById', () => {
		it('deve buscar épico por id', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockEpicWithTasks,
			} as Response);

			const result = await getEpicById(1);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/epics/1`,
				{ credentials: 'include' }
			);
			expect(result).toEqual(mockEpicWithTasks);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getEpicById(1)).rejects.toThrow('Erro ao buscar épico');
		});
	});

	describe('createEpic', () => {
		it('deve criar épico', async () => {
			const newEpic = {
				title: 'Novo Épico',
				workspaceId: 1,
			};

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 2, ...newEpic }),
			} as Response);

			const result = await createEpic(newEpic);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/epics/`,
				expect.objectContaining({
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newEpic),
					credentials: 'include',
				})
			);
			expect(result).toEqual({ id: 2, ...newEpic });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(createEpic({})).rejects.toThrow('Erro ao criar épico');
		});
	});

	describe('updateEpic', () => {
		it('deve atualizar épico', async () => {
			const updates = { title: 'Título Atualizado' };

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ ...mockEpic, ...updates }),
			} as Response);

			const result = await updateEpic(1, updates);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/epics/1`,
				expect.objectContaining({
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updates),
					credentials: 'include',
				})
			);
			expect(result.title).toBe('Título Atualizado');
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(updateEpic(1, {})).rejects.toThrow('Erro ao atualizar épico');
		});
	});

	describe('deleteEpics', () => {
		it('deve excluir épicos', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ success: true }),
			} as Response);

			const result = await deleteEpics([1, 2]);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/epics/`,
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

			await expect(deleteEpics([1])).rejects.toThrow('Erro ao excluir épicos');
		});
	});
});