import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getSteps, getStepById, createStep, updateStep, deleteSteps } from '@/services/step.services';

const BASE_URL = import.meta.env.VITE_API_URL;

describe('step.services', () => {
	const mockSteps = [
		{ id: 1, name: 'Backlog' },
		{ id: 2, name: 'Em Andamento' },
		{ id: 3, name: 'Concluído' },
	];

	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getSteps', () => {
		it('deve listar etapas', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockSteps,
			} as Response);

			const result = await getSteps();

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/steps/`,
				{ credentials: 'include' }
			);
			expect(result).toEqual(mockSteps);
		});

		it('deve listar etapas com workspaceId', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockSteps,
			} as Response);

			await getSteps({ workspaceId: 1 });

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/steps/?workspaceId=1`,
				{ credentials: 'include' }
			);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getSteps()).rejects.toThrow('Erro ao buscar etapas');
		});
	});

	describe('getStepById', () => {
		it('deve buscar etapa por id', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockSteps[0],
			} as Response);

			const result = await getStepById(1);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/steps/1`,
				{ credentials: 'include' }
			);
			expect(result).toEqual(mockSteps[0]);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getStepById(1)).rejects.toThrow('Erro ao buscar etapa');
		});
	});

	describe('createStep', () => {
		it('deve criar etapa', async () => {
			const newStep = { name: 'Em Revisão' };

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 4, ...newStep }),
			} as Response);

			const result = await createStep(newStep);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/steps/`,
				expect.objectContaining({
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newStep),
					credentials: 'include',
				})
			);
			expect(result).toEqual({ id: 4, ...newStep });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(createStep({})).rejects.toThrow('Erro ao criar etapa');
		});
	});

	describe('updateStep', () => {
		it('deve atualizar etapa', async () => {
			const updates = { name: 'Backlog Atualizado' };

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 1, ...updates }),
			} as Response);

			const result = await updateStep(1, updates);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/steps/1`,
				expect.objectContaining({
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updates),
					credentials: 'include',
				})
			);
			expect(result.name).toBe('Backlog Atualizado');
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(updateStep(1, {})).rejects.toThrow('Erro ao atualizar etapa');
		});
	});

	describe('deleteSteps', () => {
		it('deve excluir etapas', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ success: true }),
			} as Response);

			const result = await deleteSteps([1, 2]);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/steps/`,
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

			await expect(deleteSteps([1])).rejects.toThrow('Erro ao excluir etapas');
		});
	});
});