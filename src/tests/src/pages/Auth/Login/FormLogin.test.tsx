import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from 'antd';
import FormLogin from '@/pages/Auth/Login';
import * as authContext from '@/context/AuthContext';

const mockNavigate = vi.fn();
const mockSignIn = vi.fn();

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderLogin = () => {
  return render(
    <MemoryRouter>
      <App>
        <FormLogin />
      </App>
    </MemoryRouter>
  );
};

describe('FormLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar campos de login', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      signIn: mockSignIn,
      signOut: vi.fn(),
    });

    renderLogin();

    expect(screen.getByPlaceholderText('Digite seu usuário')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('deve fazer login com credenciais válidas', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue(undefined);

    vi.mocked(authContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      signIn: mockSignIn,
      signOut: vi.fn(),
    });

    renderLogin();

    await user.type(screen.getByPlaceholderText('Digite seu usuário'), 'testuser');
    await user.type(screen.getByPlaceholderText('Digite sua senha'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });

  it('deve redirecionar para dashboard quando já autenticado', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: { id: 1, name: 'Test User', role: 'user' } as any,
      loading: false,
      signIn: mockSignIn,
      signOut: vi.fn(),
    });

    renderLogin();

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup();

    vi.mocked(authContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      signIn: mockSignIn,
      signOut: vi.fn(),
    });

    renderLogin();

    expect(screen.getByPlaceholderText('Digite seu usuário')).toHaveValue('');
    expect(screen.getByPlaceholderText('Digite sua senha')).toHaveValue('');

    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByText('Por favor, insira seu usuário')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(screen.getByText('Por favor, insira sua senha')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('deve exibir link para criar conta', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      signIn: mockSignIn,
      signOut: vi.fn(),
    });

    renderLogin();

    expect(screen.getByText('Não tem uma conta?')).toBeInTheDocument();
    expect(screen.getByText('Criar conta')).toBeInTheDocument();
  });
});