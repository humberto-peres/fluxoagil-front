import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPriorities, createPriority, updatePriority, deletePriorities } from '@/services/priority.services';

const BASE_URL = import.meta.env.VITE_API_URL;

describe('priority.services', () => {
	const mockPriorities = [
		{ id: 1, name: 'Baixa', label: 'green' },
		{ id: 2, name: 'Média', label: 'yellow' },
		{ id: 3, name: 'Alta', label: 'red' },
	];

	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getPriorities', () => {
		it('deve listar prioridades', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockPriorities,
			} as Response);

			const result = await getPriorities();

			expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/priorities/`);
			expect(result).toEqual(mockPriorities);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(getPriorities()).rejects.toThrow('Erro ao buscar prioridades');
		});
	});

	describe('createPriority', () => {
		it('deve criar prioridade', async () => {
			const newPriority = { name: 'Crítica', label: 'red' };

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 4, ...newPriority }),
			} as Response);

			const result = await createPriority(newPriority);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/priorities/`,
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify(newPriority),
				})
			);
			expect(result).toEqual({ id: 4, ...newPriority });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(createPriority({})).rejects.toThrow('Erro ao criar prioridade');
		});
	});

	describe('updatePriority', () => {
		it('deve atualizar prioridade', async () => {
			const updates = { name: 'Baixa Atualizada' };

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 1, ...updates }),
			} as Response);

			const result = await updatePriority(1, updates);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/priorities/1`,
				expect.objectContaining({
					method: 'PUT',
					body: JSON.stringify(updates),
				})
			);
			expect(result.name).toBe('Baixa Atualizada');
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(updatePriority(1, {})).rejects.toThrow('Erro ao atualizar prioridade');
		});
	});

	describe('deletePriorities', () => {
		it('deve excluir prioridades', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ success: true }),
			} as Response);

			const result = await deletePriorities([1, 2]);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/priorities/`,
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

			await expect(deletePriorities([1])).rejects.toThrow('Erro ao excluir prioridades');
		});
	});
});