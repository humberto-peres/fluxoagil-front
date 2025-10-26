import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from 'antd';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Backlog from '@/pages/Backlog';
import * as workspaceServices from '@/services/workspace.services';
import * as sprintServices from '@/services/sprint.services';
import * as taskServices from '@/services/task.services';

const mockWorkspaces = [
  { id: 1, name: 'Projeto A', methodology: 'Scrum' },
  { id: 2, name: 'Projeto B', methodology: 'Kanban' },
];

const mockSprints = [
  { id: 1, name: 'Sprint 1', state: 'active', workspaceId: 1 },
  { id: 2, name: 'Sprint 2', state: 'planning', workspaceId: 1 },
];

const mockTasks = [
  { id: 1, title: 'Tarefa 1', sprintId: 1, workspaceId: 1 },
  { id: 2, title: 'Tarefa 2', sprintId: null, workspaceId: 1 },
];

vi.mock('@/services/workspace.services');
vi.mock('@/services/sprint.services');
vi.mock('@/services/task.services');

vi.mock('@/components/Layout/DefaultLayout', () => ({
  default: ({ children, title, textButton, onAddClick }: any) => (
    <div data-testid="layout">
      <h1>{title}</h1>
      <button onClick={onAddClick}>{textButton}</button>
      {children}
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

vi.mock('@/components/Sprint/SprintList', () => ({
  default: ({ sprints, backlogContent }: any) => (
    <div data-testid="sprint-list">
      {sprints.map((s: any) => <div key={s.id}>{s.name}</div>)}
      {backlogContent}
    </div>
  ),
}));

vi.mock('@/components/Sprint/FormSprint', () => ({
  default: () => <div data-testid="form-sprint">Form Sprint</div>,
}));

vi.mock('@/components/Task/TaskList', () => ({
  default: ({ tasks }: any) => (
    <div data-testid="task-list">
      {tasks.map((t: any) => <div key={t.id}>{t.title}</div>)}
    </div>
  ),
}));

vi.mock('@/components/Task/FormTask', () => ({
  default: () => <div data-testid="form-task">Form Task</div>,
}));

vi.mock('@/components/Sprint/CloseSprintModal', () => ({
  default: () => <div data-testid="close-sprint-modal">Close Modal</div>,
}));

const BacklogWrapper = () => (
  <MemoryRouter>
    <App>
      <Backlog />
    </App>
  </MemoryRouter>
);

describe('Backlog Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(workspaceServices.getWorkspaces).mockResolvedValue(mockWorkspaces);
    vi.mocked(sprintServices.getSprints).mockResolvedValue(mockSprints);
    vi.mocked(taskServices.getTasks).mockResolvedValue(mockTasks);
  });

  it('renderiza a página com título', async () => {
    render(<BacklogWrapper />);

    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('Criar Sprint')).toBeInTheDocument();
  });

  it('exibe mensagem quando nenhum workspace está selecionado', async () => {
    render(<BacklogWrapper />);

    await waitFor(() => {
      expect(screen.getByText(/selecione um workspace/i)).toBeInTheDocument();
    });
  });

  it('carrega workspaces ao montar', async () => {
    render(<BacklogWrapper />);

    await waitFor(() => {
      expect(workspaceServices.getWorkspaces).toHaveBeenCalled();
    });
  });

  it('abre modal ao clicar em Criar Sprint', async () => {
    const user = userEvent.setup();
    render(<BacklogWrapper />);

    const createButton = screen.getByText('Criar Sprint');
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('abre drawer de filtros ao clicar no FloatButton', async () => {
    const user = userEvent.setup();
    render(<BacklogWrapper />);

    const filterButton = screen.getByRole('button', { name: /filter/i });
    await user.click(filterButton);

    await waitFor(() => {
      expect(screen.getByTestId('filter-drawer')).toBeInTheDocument();
    });
  });

  it('carrega sprints e tasks após aplicar filtro', async () => {
    const user = userEvent.setup();
    render(<BacklogWrapper />);

    const filterButton = screen.getByRole('button', { name: /filter/i });
    await user.click(filterButton);

    await waitFor(() => {
      expect(screen.getByTestId('filter-drawer')).toBeInTheDocument();
    });

    const applyButton = screen.getByText('Aplicar');
    await user.click(applyButton);

    await waitFor(() => {
      expect(sprintServices.getSprints).toHaveBeenCalledWith(
        expect.objectContaining({ workspaceId: 1 })
      );
      expect(taskServices.getTasks).toHaveBeenCalledWith(
        expect.objectContaining({ workspaceId: 1 })
      );
    });
  });
});