import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from 'antd';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Configuration from '@/pages/Configuration';
import * as userServices from '@/services/user.services';

const mockUser = {
  id: 1,
  name: 'João Silva',
  username: 'joao',
  email: 'joao@test.com',
  address: {
    zipCode: '01001-000',
    state: 'SP',
    city: 'São Paulo',
    street: 'Rua Teste',
    neighborhood: 'Centro',
    number: 123,
  },
};

vi.mock('@/services/user.services');

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'João Silva' },
  }),
}));

vi.mock('@/components/Layout/DefaultLayout', () => ({
  default: ({ children, title }: any) => (
    <div data-testid="layout">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

vi.mock('@/pages/Auth/User/FormUser', () => ({
  default: ({ form, onFinish }: any) => {
    (global as any).__testOnFinish = onFinish;
    return (
      <div data-testid="form-user">
        <input data-testid="name-input" defaultValue="João Silva" />
        <input data-testid="email-input" defaultValue="joao@test.com" />
      </div>
    );
  },
}));

global.fetch = vi.fn();

const ConfigurationWrapper = () => (
  <MemoryRouter>
    <App>
      <Configuration />
    </App>
  </MemoryRouter>
);

describe('Configuration Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global as any).__testOnFinish = null;
    vi.mocked(userServices.getUserById).mockResolvedValue(mockUser as any);
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => 'Success',
    });
  });

  it('renderiza a página com título', () => {
    render(<ConfigurationWrapper />);

    expect(screen.getByText('Configurações de usuário')).toBeInTheDocument();
  });

  it('carrega dados do usuário ao montar', async () => {
    render(<ConfigurationWrapper />);

    await waitFor(() => {
      expect(userServices.getUserById).toHaveBeenCalledWith(1);
    });
  });

  it('exibe botão de salvar', async () => {
    render(<ConfigurationWrapper />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /salvar alterações/i })).toBeInTheDocument();
    });
  });

  it('atualiza dados do usuário com sucesso', async () => {
    const user = userEvent.setup();
    render(<ConfigurationWrapper />);

    await waitFor(() => {
      expect(screen.getByTestId('form-user')).toBeInTheDocument();
    });

    const saveButton = screen.getByRole('button', { name: /salvar alterações/i });
    
    const mockValues = {
      name: 'João Silva',
      username: 'joao',
      email: 'joao@test.com',
      cep: '01001-000',
      state: 'SP',
      city: 'São Paulo',
      street: 'Rua Teste',
      neighborhood: 'Centro',
      number: 123,
    };

    await user.click(saveButton);

    if ((global as any).__testOnFinish) {
      await (global as any).__testOnFinish(mockValues);
    }

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  it('exibe mensagem de sucesso após salvar', async () => {
    const user = userEvent.setup();
    render(<ConfigurationWrapper />);

    await waitFor(() => {
      expect(screen.getByTestId('form-user')).toBeInTheDocument();
    });

    const mockValues = {
      name: 'João Silva',
      username: 'joao',
      email: 'joao@test.com',
      cep: '01001-000',
      state: 'SP',
      city: 'São Paulo',
      street: 'Rua Teste',
      neighborhood: 'Centro',
      number: 123,
    };

    const saveButton = screen.getByRole('button', { name: /salvar alterações/i });
    await user.click(saveButton);

    if ((global as any).__testOnFinish) {
      await (global as any).__testOnFinish(mockValues);
    }

    await waitFor(() => {
      expect(screen.getByText(/dados atualizados com sucesso/i)).toBeInTheDocument();
    });
  });
});