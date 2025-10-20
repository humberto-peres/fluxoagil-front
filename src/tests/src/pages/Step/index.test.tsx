import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from 'antd';
import Step from '@/pages/Step';
import * as stepServices from '@/services/step.services';

vi.mock('@/services/step.services');
vi.mock('@/components/Layout/DefaultLayout', () => ({
  default: ({ children, title, addButton, textButton, onAddClick }: any) => (
    <div>
      <h1>{title}</h1>
      {addButton && (
        <button onClick={onAddClick}>{textButton}</button>
      )}
      {children}
    </div>
  ),
}));

const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <App>{children}</App>
);

const mockSteps = [
  { id: 1, name: 'Backlog' },
  { id: 2, name: 'Em Andamento' },
  { id: 3, name: 'Concluído' },
];

describe('Step', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(stepServices.getSteps).mockResolvedValue(mockSteps);
    vi.mocked(stepServices.getStepById).mockResolvedValue(mockSteps[0]);
    vi.mocked(stepServices.createStep).mockResolvedValue({ id: 4, name: 'Nova' });
    vi.mocked(stepServices.updateStep).mockResolvedValue(undefined);
    vi.mocked(stepServices.deleteSteps).mockResolvedValue(undefined);
  });

  describe('Renderização', () => {
    it('deve renderizar título', async () => {
      render(
        <AppWrapper>
          <Step />
        </AppWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Etapas')).toBeInTheDocument();
      });
    });

    it('deve carregar etapas', async () => {
      render(
        <AppWrapper>
          <Step />
        </AppWrapper>
      );

      await waitFor(() => {
        expect(stepServices.getSteps).toHaveBeenCalled();
      });

      expect(screen.getByText('Backlog')).toBeInTheDocument();
      expect(screen.getByText('Em Andamento')).toBeInTheDocument();
    });
  });

  describe('Modal', () => {
    it('deve abrir modal ao criar', async () => {
      const user = userEvent.setup();
      render(
        <AppWrapper>
          <Step />
        </AppWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Criar Etapa')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Criar Etapa'));

      await waitFor(() => {
        expect(screen.getByText('Salvar')).toBeInTheDocument();
      });
    });

    it('deve fechar modal ao cancelar', async () => {
      const user = userEvent.setup();
      render(
        <AppWrapper>
          <Step />
        </AppWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Criar Etapa')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Criar Etapa'));

      await waitFor(() => {
        expect(screen.getByText('Cancelar')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Cancelar'));

      await waitFor(() => {
        expect(screen.queryByText('Salvar')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edição', () => {
    it('deve abrir modal de edição', async () => {
      const user = userEvent.setup();
      render(
        <AppWrapper>
          <Step />
        </AppWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Backlog')).toBeInTheDocument();
      });

      const editButton = screen.getByLabelText('Editar Backlog');
      await user.click(editButton);

      await waitFor(() => {
        expect(stepServices.getStepById).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Exclusão', () => {
    it('deve exibir confirmação', async () => {
      const user = userEvent.setup();
      render(
        <AppWrapper>
          <Step />
        </AppWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Backlog')).toBeInTheDocument();
      });

      const deleteButton = screen.getByLabelText('Excluir Backlog');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Excluir etapa?')).toBeInTheDocument();
        expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument();
      });
    });
  });
});

describe('Erros', () => {
  it('deve lidar com erro ao carregar', async () => {
    vi.mocked(stepServices.getSteps).mockRejectedValue(new Error('Erro'));

    render(
      <AppWrapper>
        <Step />
      </AppWrapper>
    );

    await waitFor(() => {
      expect(stepServices.getSteps).toHaveBeenCalled();
    });
  });
});