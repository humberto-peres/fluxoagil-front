import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchAll, searchAllFallback } from '@/services/search.services';

const BASE_URL = import.meta.env.VITE_API_URL;

describe('search.services', () => {
	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('searchAll', () => {
		it('deve buscar com termo', async () => {
			const mockResults = [
				{
					type: 'task',
					id: 1,
					title: 'Tarefa Teste',
					idTask: 'PROJ-1',
					route: '/backlog',
					meta: { sprintId: null },
				},
			];

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ results: mockResults }),
			} as Response);

			const result = await searchAll('teste');

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/search?q=teste&limit=10&types=tasks,epics`,
				expect.objectContaining({ credentials: 'include' })
			);
			expect(result).toEqual(mockResults);
		});

		it('deve usar limit customizado', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ results: [] }),
			} as Response);

			await searchAll('teste', 20);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/search?q=teste&limit=20&types=tasks,epics`,
				expect.any(Object)
			);
		});

		it('deve codificar termo de busca', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ results: [] }),
			} as Response);

			await searchAll('termo com espaço');

			expect(fetch).toHaveBeenCalledWith(
				expect.stringContaining('q=termo%20com%20espa%C3%A7o'),
				expect.any(Object)
			);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(searchAll('teste')).rejects.toThrow('Falha na busca');
		});
	});

	describe('searchAllFallback', () => {
		it('deve buscar tasks e epics separadamente', async () => {
			const mockTasks = [
				{ id: 1, title: 'Tarefa 1', idTask: 'PROJ-1', sprintId: null },
			];

			const mockEpics = [
				{ id: 1, title: 'Épico 1', key: 'EPIC-1' },
			];

			vi.mocked(fetch)
				.mockResolvedValueOnce({
					ok: true,
					json: async () => mockTasks,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					json: async () => mockEpics,
				} as Response);

			const result = await searchAllFallback('teste');

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/tasks/search?q=teste`,
				expect.objectContaining({ credentials: 'include' })
			);
			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/epics/search?q=teste`,
				expect.objectContaining({ credentials: 'include' })
			);
			expect(result).toHaveLength(2);
		});

		it('deve mapear tasks corretamente', async () => {
			const mockTasks = [
				{ id: 1, title: 'Tarefa 1', idTask: 'PROJ-1', sprintId: 5 },
			];

			vi.mocked(fetch)
				.mockResolvedValueOnce({
					ok: true,
					json: async () => mockTasks,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					json: async () => [],
				} as Response);

			const result = await searchAllFallback('teste');

			expect(result[0]).toEqual({
				type: 'task',
				id: 1,
				title: 'Tarefa 1',
				idTask: 'PROJ-1',
				subtitle: 'Sprint #5',
				route: '/backlog',
				meta: { sprintId: 5 },
			});
		});

		it('deve mapear task sem sprint como Backlog', async () => {
			const mockTasks = [
				{ id: 1, title: 'Tarefa 1', idTask: 'PROJ-1', sprintId: null },
			];

			vi.mocked(fetch)
				.mockResolvedValueOnce({
					ok: true,
					json: async () => mockTasks,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					json: async () => [],
				} as Response);

			const result = await searchAllFallback('teste');

			expect(result[0].subtitle).toBe('Backlog');
			expect(result[0].meta).toEqual({ sprintId: null });
		});

		it('deve mapear epics corretamente', async () => {
			const mockEpics = [
				{ id: 1, title: 'Épico 1', key: 'EPIC-1' },
			];

			vi.mocked(fetch)
				.mockResolvedValueOnce({
					ok: true,
					json: async () => [],
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					json: async () => mockEpics,
				} as Response);

			const result = await searchAllFallback('teste');

			expect(result[0]).toEqual({
				type: 'epic',
				id: 1,
				title: 'Épico 1',
				key: 'EPIC-1',
				subtitle: 'EPIC-1',
				route: '/epic',
			});
		});

		it('deve lidar com erro em tasks', async () => {
			vi.mocked(fetch)
				.mockResolvedValueOnce({
					ok: false,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					json: async () => [],
				} as Response);

			const result = await searchAllFallback('teste');

			expect(result).toEqual([]);
		});

		it('deve lidar com erro em epics', async () => {
			vi.mocked(fetch)
				.mockResolvedValueOnce({
					ok: true,
					json: async () => [],
				} as Response)
				.mockResolvedValueOnce({
					ok: false,
				} as Response);

			const result = await searchAllFallback('teste');

			expect(result).toEqual([]);
		});

		it('deve retornar array vazio quando ambos falham', async () => {
			vi.mocked(fetch)
				.mockResolvedValueOnce({
					ok: false,
				} as Response)
				.mockResolvedValueOnce({
					ok: false,
				} as Response);

			const result = await searchAllFallback('teste');

			expect(result).toEqual([]);
		});
	});
});