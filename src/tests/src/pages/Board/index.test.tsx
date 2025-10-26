import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from 'antd';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Board from '@/pages/Board';
import * as workspaceServices from '@/services/workspace.services';
import * as sprintServices from '@/services/sprint.services';

const mockWorkspaces = [
  {
    id: 1,
    name: 'Projeto A',
    methodology: 'Scrum',
    key: 'PA',
    steps: [
      { stepId: 1, name: 'A Fazer' },
      { stepId: 2, name: 'Em Progresso' },
      { stepId: 3, name: 'Concluído' },
    ],
  },
  {
    id: 2,
    name: 'Projeto B',
    methodology: 'Kanban',
    key: 'PB',
    steps: [
      { stepId: 4, name: 'Backlog' },
      { stepId: 5, name: 'Doing' },
    ],
  },
];

const mockSprints = [
  { id: 1, name: 'Sprint 1', state: 'active', workspaceId: 1 },
];

vi.mock('@/services/workspace.services');
vi.mock('@/services/sprint.services');
vi.mock('@/services/task.services');

vi.mock('@/hooks/useBoardTasks', () => ({
  useBoardTasks: () => ({
    tasks: [],
    loadByWorkspace: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    onDragEnd: vi.fn(),
  }),
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

vi.mock('@/pages/Board/Column', () => ({
  Column: ({ column, tasks }: any) => (
    <div data-testid={`column-${column.id}`}>
      <h3>{column.title}</h3>
      <p>{tasks.length} tarefas</p>
    </div>
  ),
}));

vi.mock('@/components/Task/BoardFilterDrawer', () => ({
  default: ({ open, onApply, onClear }: any) =>
    open ? (
      <div data-testid="filter-drawer">
        <button onClick={() => onApply({ workspaceId: 1 })}>Aplicar</button>
        <button onClick={onClear}>Limpar</button>
      </div>
    ) : null,
}));

vi.mock('@/components/Task/FormTask', () => ({
  default: () => <div data-testid="form-task">Form Task</div>,
}));

vi.mock('@/pages/Board/TaskCard', () => ({
  TaskCard: ({ task }: any) => <div data-testid={`task-${task.id}`}>{task.title}</div>,
}));

const BoardWrapper = () => (
  <MemoryRouter>
    <App>
      <Board />
    </App>
  </MemoryRouter>
);

describe('Board Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(workspaceServices.getWorkspaces).mockResolvedValue(mockWorkspaces as any);
    vi.mocked(sprintServices.getSprints).mockResolvedValue(mockSprints as any);
  });

  it('renderiza a página com título', () => {
    render(<BoardWrapper />);

    expect(screen.getByText('Board')).toBeInTheDocument();
    expect(screen.getByText('Criar Atividade')).toBeInTheDocument();
  });

  it('exibe mensagem quando nenhum workspace está selecionado', async () => {
    render(<BoardWrapper />);

    await waitFor(() => {
      expect(screen.getByText(/selecione um workspace/i)).toBeInTheDocument();
    });
  });

  it('carrega workspaces ao montar', async () => {
    render(<BoardWrapper />);

    await waitFor(() => {
      expect(workspaceServices.getWorkspaces).toHaveBeenCalled();
    });
  });

  it('abre modal ao clicar em Criar Atividade', async () => {
    const user = userEvent.setup();
    render(<BoardWrapper />);

    const createButton = screen.getByText('Criar Atividade');
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('abre drawer de filtros ao clicar no FloatButton', async () => {
    const user = userEvent.setup();
    render(<BoardWrapper />);

    const filterButton = screen.getByRole('button', { name: /filter/i });
    await user.click(filterButton);

    await waitFor(() => {
      expect(screen.getByTestId('filter-drawer')).toBeInTheDocument();
    });
  });

  it('renderiza colunas após selecionar workspace', async () => {
    const user = userEvent.setup();
    render(<BoardWrapper />);

    const filterButton = screen.getByRole('button', { name: /filter/i });
    await user.click(filterButton);

    await waitFor(() => {
      expect(screen.getByTestId('filter-drawer')).toBeInTheDocument();
    });

    const applyButton = screen.getByText('Aplicar');
    await user.click(applyButton);

    await waitFor(() => {
      expect(screen.getByTestId('column-1')).toBeInTheDocument();
      expect(screen.getByText('A Fazer')).toBeInTheDocument();
      expect(screen.getByText('Em Progresso')).toBeInTheDocument();
      expect(screen.getByText('Concluído')).toBeInTheDocument();
    });
  });
});