import { render, screen } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';
import { describe, it, expect, vi } from 'vitest';
import Column from '@/pages/Board/Column';
import type { Task } from '@/pages/Board/TaskCard';

vi.mock('@/pages/Board/TaskCard', () => ({
  default: ({ task, onEdit }: any) => (
    <div data-testid={`task-${task.id}`} onClick={() => onEdit?.(task.id)}>
      {task.title}
    </div>
  ),
}));

const mockColumn = {
  id: 'todo',
  title: 'A Fazer',
};

const mockTasks: Task[] = [
  { id: '1', title: 'Tarefa 1', status: 'todo' } as Task,
  { id: '2', title: 'Tarefa 2', status: 'todo' } as Task,
];

const ColumnWrapper = ({ children }: { children: React.ReactNode }) => (
  <DndContext>{children}</DndContext>
);

describe('Column Component', () => {
  it('renderiza o título da coluna', () => {
    render(
      <ColumnWrapper>
        <Column column={mockColumn} tasks={[]} />
      </ColumnWrapper>
    );

    expect(screen.getByText('A Fazer')).toBeInTheDocument();
  });

  it('exibe a contagem de tarefas no singular', () => {
    render(
      <ColumnWrapper>
        <Column column={mockColumn} tasks={[mockTasks[0]]} />
      </ColumnWrapper>
    );

    expect(screen.getByText('1 Atividade na etapa')).toBeInTheDocument();
  });

  it('exibe a contagem de tarefas no plural', () => {
    render(
      <ColumnWrapper>
        <Column column={mockColumn} tasks={mockTasks} />
      </ColumnWrapper>
    );

    expect(screen.getByText('2 Atividades na etapa')).toBeInTheDocument();
  });

  it('renderiza todas as tarefas', () => {
    render(
      <ColumnWrapper>
        <Column column={mockColumn} tasks={mockTasks} />
      </ColumnWrapper>
    );

    expect(screen.getByTestId('task-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-2')).toBeInTheDocument();
    expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
    expect(screen.getByText('Tarefa 2')).toBeInTheDocument();
  });

  it('renderiza coluna vazia', () => {
    render(
      <ColumnWrapper>
        <Column column={mockColumn} tasks={[]} />
      </ColumnWrapper>
    );

    expect(screen.getByText('0 Atividade na etapa')).toBeInTheDocument();
    expect(screen.queryByTestId(/task-/)).not.toBeInTheDocument();
  });

  it('chama onEditTask ao editar uma tarefa', () => {
    const mockOnEdit = vi.fn();

    render(
      <ColumnWrapper>
        <Column column={mockColumn} tasks={mockTasks} onEditTask={mockOnEdit} />
      </ColumnWrapper>
    );

    const task1 = screen.getByTestId('task-1');
    task1.click();

    expect(mockOnEdit).toHaveBeenCalledWith('1');
  });
});