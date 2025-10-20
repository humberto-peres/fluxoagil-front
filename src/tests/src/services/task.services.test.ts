import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAllTasks, getTasks, getTaskById, createTask, updateTask, deleteTasks, moveTask } from '@/services/task.services';

const BASE_URL = import.meta.env.VITE_API_URL;

describe('task.services', () => {
	const mockTask = {
		id: 1,
		title: 'Tarefa Teste',
		description: 'Descrição',
		estimate: '8h',
		startDate: '2024-01-01',
		deadline: '2024-01-15',
		sprintId: 1,
		stepId: 1,
		priorityId: 1,
		typeTaskId: 1,
		reporterId: 1,
		assigneeId: 1,
		userId: 1,
		status: 'open',
		workspaceId: 1,
		sequenceNumber: 1,
		idTask: 'PROJ-1',
	};

	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getAllTasks', () => {
		it('deve buscar todas as tarefas', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => [mockTask],
			} as Response);

			const result = await getAllTasks();

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/tasks/all`,
				expect.objectContaining({ credentials: 'include' })
			);
			expect(result).toEqual([mockTask]);
		});
	});

	describe('getTasks', () => {
		it('deve buscar tarefas por workspaceId', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => [mockTask],
			} as Response);

			await getTasks({ workspaceId: 1 });

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/tasks/?workspaceId=1`,
				expect.objectContaining({ credentials: 'include' })
			);
		});

		it('deve buscar tarefas com stepId', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => [mockTask],
			} as Response);

			await getTasks({ workspaceId: 1, stepId: 2 });

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/tasks/?workspaceId=1&stepId=2`,
				expect.objectContaining({ credentials: 'include' })
			);
		});

		it('deve buscar tarefas com sprintId null', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => [mockTask],
			} as Response);

			await getTasks({ workspaceId: 1, sprintId: null });

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/tasks/?workspaceId=1&sprintId=null`,
				expect.objectContaining({ credentials: 'include' })
			);
		});

		it('deve buscar tarefas com sprintId específico', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => [mockTask],
			} as Response);

			await getTasks({ workspaceId: 1, sprintId: 3 });

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/tasks/?workspaceId=1&sprintId=3`,
				expect.objectContaining({ credentials: 'include' })
			);
		});
	});

	describe('getTaskById', () => {
		it('deve buscar tarefa por id', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockTask,
			} as Response);

			const result = await getTaskById(1);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/tasks/1`,
				expect.objectContaining({ credentials: 'include' })
			);
			expect(result).toEqual(mockTask);
		});
	});

	describe('createTask', () => {
		it('deve criar tarefa', async () => {
			const newTask = {
				title: 'Nova Tarefa',
				workspaceId: 1,
			};

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 2, ...newTask }),
			} as Response);

			const result = await createTask(newTask);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/tasks/`,
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify(newTask),
					credentials: 'include',
				})
			);
			expect(result).toEqual({ id: 2, ...newTask });
		});
	});

	describe('updateTask', () => {
		it('deve atualizar tarefa', async () => {
			const updates = { title: 'Título Atualizado' };

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ ...mockTask, ...updates }),
			} as Response);

			const result = await updateTask(1, updates);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/tasks/1`,
				expect.objectContaining({
					method: 'PUT',
					body: JSON.stringify(updates),
					credentials: 'include',
				})
			);
			expect(result.title).toBe('Título Atualizado');
		});
	});

	describe('deleteTasks', () => {
		it('deve excluir tarefas', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ message: 'Tarefas excluídas com sucesso' }),
			} as Response);

			const result = await deleteTasks([1, 2]);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/tasks/`,
				expect.objectContaining({
					method: 'DELETE',
					body: JSON.stringify({ ids: [1, 2] }),
					credentials: 'include',
				})
			);
			expect(result).toEqual({ message: 'Tarefas excluídas com sucesso' });
		});
	});

	describe('moveTask', () => {
		it('deve mover tarefa para outra etapa', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ ...mockTask, stepId: 2 }),
			} as Response);

			const result = await moveTask(1, 2);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/tasks/1/move`,
				expect.objectContaining({
					method: 'PUT',
					body: JSON.stringify({ stepId: 2 }),
					credentials: 'include',
				})
			);
			expect(result.stepId).toBe(2);
		});
	});
});