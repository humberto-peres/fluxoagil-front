import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from 'antd';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import User from '@/pages/Auth/User';
import * as userServices from '@/services/user.services';

vi.mock('@/services/user.services', () => ({
  getUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUsers: vi.fn(),
}));

vi.mock('@/components/Layout/DefaultLayout', () => ({
  default: ({ children, title, textButton, onAddClick }: any) => (
    <div data-testid="layout">
      <h1>{title}</h1>
      <button onClick={onAddClick}>{textButton}</button>
      {children}
    </div>
  ),
}));

vi.mock('@/pages/Auth/User/FormUser', () => ({
  default: ({ form, onFinish }: any) => (
    <form data-testid="form-user" onSubmit={(e) => {
      e.preventDefault();
      onFinish({ name: 'Teste', username: 'teste', email: 'teste@test.com' });
    }}>
      <button type="submit">Submit</button>
    </form>
  ),
}));

const mockUsers = [
  {
    id: 1,
    name: 'João Silva',
    username: 'joao',
    email: 'joao@test.com',
    address: {
      street: 'Rua A',
      number: 123,
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01001-000',
    },
  },
  {
    id: 2,
    name: 'Maria Santos',
    username: 'maria',
    email: 'maria@test.com',
  },
];

const UserWrapper = () => (
  <MemoryRouter>
    <App>
      <User />
    </App>
  </MemoryRouter>
);

describe('User Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userServices.getUsers).mockResolvedValue(mockUsers);
  });

  it('renderiza a página de usuários', async () => {
    render(<UserWrapper />);
    
    expect(screen.getByText('Usuários')).toBeInTheDocument();
    expect(screen.getByText('Criar Usuário')).toBeInTheDocument();
  });

  it('carrega e exibe lista de usuários', async () => {
    render(<UserWrapper />);

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('joao@test.com')).toBeInTheDocument();
    });

    expect(userServices.getUsers).toHaveBeenCalledTimes(1);
  });

  it('abre modal ao clicar em Criar Usuário', async () => {
    const user = userEvent.setup();
    render(<UserWrapper />);

    const createButton = screen.getByRole('button', { name: 'Criar Usuário' });
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Criar Usuário', { selector: '.ant-modal-title' })).toBeInTheDocument();
    });
  });

  it('exibe botões de editar e excluir em cada linha', async () => {
    render(<UserWrapper />);

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByLabelText(/Editar/i);
    const deleteButtons = screen.getAllByLabelText(/Excluir/i);

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('abre modal de edição ao clicar em editar', async () => {
    const user = userEvent.setup();
    render(<UserWrapper />);

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    const editButton = screen.getAllByLabelText(/Editar/i)[0];
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Editar Usuário', { selector: '.ant-modal-title' })).toBeInTheDocument();
    });
  });

  it('exibe confirmação ao clicar em excluir', async () => {
    const user = userEvent.setup();
    render(<UserWrapper />);

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByLabelText(/Excluir/i)[0];
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('Excluir usuário?')).toBeInTheDocument();
      expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument();
    });
  });

  it('chama deleteUsers ao confirmar exclusão', async () => {
    const user = userEvent.setup();
    vi.mocked(userServices.deleteUsers).mockResolvedValue({ message: 'Sucesso' });
    
    render(<UserWrapper />);

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByLabelText(/Excluir/i)[0];
    await user.click(deleteButton);

    const confirmButton = await screen.findByRole('button', { name: 'Excluir' });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(userServices.deleteUsers).toHaveBeenCalledWith([1]);
    });
  });

  it('exibe mensagem de erro ao falhar carregar usuários', async () => {
    vi.mocked(userServices.getUsers).mockRejectedValue(new Error('Erro'));
    
    render(<UserWrapper />);

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar usuários')).toBeInTheDocument();
    });
  });
});