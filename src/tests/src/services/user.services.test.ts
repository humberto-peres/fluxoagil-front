import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getUsers, getUserById, createUser, deleteUsers } from '@/services/user.services';

const BASE_URL = import.meta.env.VITE_API_URL;

describe('user.services', () => {
	const mockUsers = [
		{ id: 1, name: 'João Silva', email: 'joao@test.com', username: 'joao' },
		{ id: 2, name: 'Maria Santos', email: 'maria@test.com', username: 'maria' },
	];

	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getUsers', () => {
		it('deve listar usuários', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockUsers,
			} as Response);

			const result = await getUsers();

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/users/`,
				expect.objectContaining({ credentials: 'include' })
			);
			expect(result).toEqual(mockUsers);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
				json: async () => ({}),
			} as Response);

			await expect(getUsers()).rejects.toThrow('Erro ao buscar usuários');
		});
	});

	describe('getUserById', () => {
		it('deve buscar usuário por id', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockUsers[0],
			} as Response);

			const result = await getUserById(1);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/users/1`,
				expect.objectContaining({ credentials: 'include' })
			);
			expect(result).toEqual(mockUsers[0]);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
				json: async () => ({}),
			} as Response);

			await expect(getUserById(1)).rejects.toThrow('Falha ao carregar usuário');
		});
	});

	describe('createUser', () => {
		it('deve criar usuário', async () => {
			const newUser = {
				name: 'Pedro Oliveira',
				email: 'pedro@test.com',
				username: 'pedro',
				password: 'senha123',
			};

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 3, ...newUser }),
			} as Response);

			const result = await createUser(newUser);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/users`,
				expect.objectContaining({
					method: 'POST',
					credentials: 'include',
					body: JSON.stringify(newUser),
				})
			);
			expect(result).toEqual({ id: 3, ...newUser });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
				json: async () => ({}),
			} as Response);

			await expect(createUser({})).rejects.toThrow('Erro ao criar usuário');
		});
	});

	describe('deleteUsers', () => {
		it('deve excluir usuários', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ success: true }),
			} as Response);

			const result = await deleteUsers([1, 2]);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/users/`,
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
				json: async () => ({}),
			} as Response);

			await expect(deleteUsers([1])).rejects.toThrow('Erro ao excluir usuários');
		});
	});
});