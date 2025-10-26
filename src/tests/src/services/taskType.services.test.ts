import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTaskTypes, getTaskTypeById, createTaskType, updateTaskType, deleteTaskTypes } from '@/services/taskType.services';

const BASE_URL = import.meta.env.VITE_API_URL;

describe('taskType.services', () => {
	const mockTaskTypes = [
		{ id: 1, name: 'Bug' },
		{ id: 2, name: 'Feature' },
		{ id: 3, name: 'Improvement' },
	];

	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getTaskTypes', () => {
		it('deve listar tipos de atividade', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockTaskTypes,
			} as Response);

			const result = await getTaskTypes();

			expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/task-types/`);
			expect(result).toEqual(mockTaskTypes);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getTaskTypes()).rejects.toThrow('Erro ao buscar tipos de atividade');
		});
	});

	describe('getTaskTypeById', () => {
		it('deve buscar tipo de atividade por id', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockTaskTypes[0],
			} as Response);

			const result = await getTaskTypeById(1);

			expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/task-types/1`);
			expect(result).toEqual(mockTaskTypes[0]);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getTaskTypeById(1)).rejects.toThrow('Erro ao buscar tipo de atividade');
		});
	});

	describe('createTaskType', () => {
		it('deve criar tipo de atividade', async () => {
			const newType = { name: 'Task' };

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 4, ...newType }),
			} as Response);

			const result = await createTaskType(newType);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/task-types/`,
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify(newType),
				})
			);
			expect(result).toEqual({ id: 4, ...newType });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(createTaskType({})).rejects.toThrow('Erro ao criar tipo de atividade');
		});
	});

	describe('updateTaskType', () => {
		it('deve atualizar tipo de atividade', async () => {
			const updates = { name: 'Bug Crítico' };

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 1, ...updates }),
			} as Response);

			const result = await updateTaskType(1, updates);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/task-types/1`,
				expect.objectContaining({
					method: 'PUT',
					body: JSON.stringify(updates),
				})
			);
			expect(result.name).toBe('Bug Crítico');
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(updateTaskType(1, {})).rejects.toThrow('Erro ao atualizar tipo de atividade');
		});
	});

	describe('deleteTaskTypes', () => {
		it('deve excluir tipos de atividade', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ success: true }),
			} as Response);

			const result = await deleteTaskTypes([1, 2]);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/task-types/`,
				expect.objectContaining({
					method: 'DELETE',
					body: JSON.stringify({ ids: [1, 2] }),
				})
			);
			expect(result).toEqual({ success: true });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(deleteTaskTypes([1])).rejects.toThrow('Erro ao excluir tipos de atividade');
		});
	});
});