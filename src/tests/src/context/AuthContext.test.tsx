import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import * as authServices from '@/services/auth.services';

vi.mock('@/services/auth.services', () => ({
  login: vi.fn(),
  me: vi.fn(),
  logout: vi.fn(),
}));

const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user' as const,
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar usuário na inicialização', async () => {
    vi.mocked(authServices.me).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('deve fazer login com sucesso', async () => {
    vi.mocked(authServices.me).mockResolvedValue(null as any);
    vi.mocked(authServices.login).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.signIn({
        username: 'testuser',
        password: 'password123',
      });
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('deve fazer logout com sucesso', async () => {
    vi.mocked(authServices.me).mockResolvedValue(mockUser);
    vi.mocked(authServices.logout).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBe(null);
  });

  it('deve lançar erro quando login falha', async () => {
    vi.mocked(authServices.me).mockResolvedValue(null as any);
    vi.mocked(authServices.login).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.signIn({
          username: 'wrong',
          password: 'wrong',
        });
      })
    ).rejects.toThrow('Invalid credentials');

    expect(result.current.user).toBe(null);
  });
});