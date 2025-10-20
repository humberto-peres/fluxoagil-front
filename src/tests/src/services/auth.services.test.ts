import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { login, me, logout, registerUser } from '@/services/auth.services';

const BASE_URL = import.meta.env.VITE_API_URL;

describe('auth.services', () => {
	const mockUser = {
		id: 1,
		name: 'João Silva',
		username: 'joao',
		email: 'joao@test.com',
		role: 'user' as const,
	};

	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('login', () => {
		it('deve fazer login com sucesso', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockUser,
			} as Response);

			const result = await login('joao', 'senha123');

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/auth/login`,
				expect.objectContaining({
					method: 'POST',
					credentials: 'include',
					body: JSON.stringify({ username: 'joao', password: 'senha123' }),
				})
			);
			expect(result).toEqual(mockUser);
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
				json: async () => ({ message: 'Credenciais inválidas' }),
			} as Response);

			await expect(login('joao', 'errado')).rejects.toThrow('Credenciais inválidas');
		});

		it('deve lançar erro genérico quando sem mensagem', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
				json: async () => ({}),
			} as Response);

			await expect(login('joao', 'errado')).rejects.toThrow('Falha no login');
		});
	});

	describe('me', () => {
		it('deve retornar usuário autenticado', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => mockUser,
			} as Response);

			const result = await me();

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/auth/me`,
				expect.objectContaining({
					credentials: 'include',
				})
			);
			expect(result).toEqual(mockUser);
		});

		it('deve lançar erro quando não autenticado', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(me()).rejects.toThrow('Não autenticado');
		});
	});

	describe('logout', () => {
		it('deve fazer logout com sucesso', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ success: true }),
			} as Response);

			const result = await logout();

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/auth/logout`,
				expect.objectContaining({
					method: 'POST',
					credentials: 'include',
				})
			);
			expect(result).toEqual({ success: true });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
			} as Response);

			await expect(logout()).rejects.toThrow('Falha ao sair');
		});
	});

	describe('registerUser', () => {
		it('deve registrar usuário com sucesso', async () => {
			const userData = {
				name: 'Novo Usuário',
				username: 'novo',
				email: 'novo@test.com',
				password: 'senha123',
			};

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 2, ...userData }),
			} as Response);

			const result = await registerUser(userData);

			expect(fetch).toHaveBeenCalledWith(
				`${BASE_URL}/users`,
				expect.objectContaining({
					method: 'POST',
					credentials: 'omit',
					body: JSON.stringify(userData),
				})
			);
			expect(result).toEqual({ id: 2, ...userData });
		});

		it('deve lançar erro em caso de falha', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
				text: async () => 'Usuário já existe',
			} as Response);

			await expect(registerUser({})).rejects.toThrow('Usuário já existe');
		});

		it('deve lançar erro genérico quando sem mensagem', async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
				text: async () => {
					throw new Error();
				},
			} as Response);

			await expect(registerUser({})).rejects.toThrow('Erro ao registrar');
		});
	});
});