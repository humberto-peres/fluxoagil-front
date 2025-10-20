import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { App } from 'antd';
import Priority from '@/pages/Priority/index';
import * as priorityServices from '@/services/priority.services';

vi.mock('@/services/priority.services');

const Wrapper = ({ children }: any) => (
  <BrowserRouter>
    <App>{children}</App>
  </BrowserRouter>
);

describe('Priority', () => {
  const mockPriorities = [
    { id: 1, name: 'Alta', label: '#ff0000' },
    { id: 2, name: 'Média', label: '#ffaa00' },
    { id: 3, name: 'Baixa', label: '#00ff00' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(priorityServices.getPriorities).mockResolvedValue(mockPriorities);
    vi.mocked(priorityServices.createPriority).mockResolvedValue(mockPriorities[0]);
    vi.mocked(priorityServices.updatePriority).mockResolvedValue(mockPriorities[0]);
    vi.mocked(priorityServices.deletePriorities).mockResolvedValue(undefined);
  });

  it('deve renderizar título e botão criar', () => {
    render(<Priority />, { wrapper: Wrapper });

    expect(screen.getByRole('heading', { name: /prioridade/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar prioridade/i })).toBeInTheDocument();
  });

  it('deve carregar e exibir prioridades', async () => {
    render(<Priority />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(priorityServices.getPriorities).toHaveBeenCalled();
      expect(screen.getByText('Alta')).toBeInTheDocument();
      expect(screen.getByText('Média')).toBeInTheDocument();
      expect(screen.getByText('Baixa')).toBeInTheDocument();
    });
  });

  it('deve exibir cores em tags', async () => {
    render(<Priority />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('#ff0000')).toBeInTheDocument();
      expect(screen.getByText('#ffaa00')).toBeInTheDocument();
      expect(screen.getByText('#00ff00')).toBeInTheDocument();
    });
  });

  it('deve abrir modal ao clicar em criar', async () => {
    const user = userEvent.setup();
    render(<Priority />, { wrapper: Wrapper });

    const createButton = screen.getByRole('button', { name: /criar prioridade/i });
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });
  });

  it('deve ter botões de editar para cada prioridade', async () => {
    render(<Priority />, { wrapper: Wrapper });

    await waitFor(() => {
      const editButtons = screen.getAllByLabelText(/editar/i);
      expect(editButtons.length).toBe(3);
    });
  });

  it('deve ter botões de excluir para cada prioridade', async () => {
    render(<Priority />, { wrapper: Wrapper });

    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText(/excluir/i);
      expect(deleteButtons.length).toBe(3);
    });
  });

  it('deve abrir modal de edição ao clicar em editar', async () => {
    const user = userEvent.setup();
    render(<Priority />, { wrapper: Wrapper });

    await waitFor(() => screen.getByText('Alta'));

    const editButton = screen.getAllByLabelText(/editar/i)[0];
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Editar Prioridade')).toBeInTheDocument();
    });
  });

  it('deve exibir tabela com colunas corretas', async () => {
    render(<Priority />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Cor')).toBeInTheDocument();
      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Ações')).toBeInTheDocument();
    });
  });

  it('deve mostrar loading inicial', () => {
    render(<Priority />, { wrapper: Wrapper });

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('deve fechar modal ao cancelar', async () => {
    const user = userEvent.setup();
    render(<Priority />, { wrapper: Wrapper });

    const createButton = screen.getByRole('button', { name: /criar prioridade/i });
    await user.click(createButton);
    
    await waitFor(() => screen.getByText('Salvar'));

    await user.click(screen.getByText('Cancelar'));

    await waitFor(() => {
      expect(screen.queryByText('Salvar')).not.toBeInTheDocument();
    });
  });
});