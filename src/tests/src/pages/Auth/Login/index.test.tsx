import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from 'antd';
import Login from '@/pages/Auth/Login';
import * as authContext from '@/context/AuthContext';

const mockNavigate = vi.fn();

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
        <Login />
      </App>
    </MemoryRouter>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });
  });

  it('deve renderizar logo e título', () => {
    renderLogin();

    expect(screen.getByText('Fluxo Ágil')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('deve renderizar formulário de login', () => {
    renderLogin();

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('deve navegar para home ao clicar no logo', async () => {
    const user = userEvent.setup();
    renderLogin();

    const logoContainer = screen.getByText('Fluxo Ágil').closest('div');
    await user.click(logoContainer!);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('deve exibir link para criar conta', () => {
    renderLogin();

    expect(screen.getByText('Criar conta')).toBeInTheDocument();
  });
});