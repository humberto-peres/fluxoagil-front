import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DndContext } from '@dnd-kit/core';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '@/pages/Board/TaskCard';
import type { Task } from '@/pages/Board/TaskCard';

const mockTask: Task = {
  id: '1',
  idTask: 'TASK-123',
  title: 'Implementar funcionalidade X',
  description: 'Descrição da tarefa',
  status: 'todo',
  typeTask: { name: 'Feature' },
  priority: { name: 'Alta', label: 'red' },
  deadline: '15/12/2024',
  deadlineInfo: { type: 'warning', label: 'Vence em 3 dias' },
  estimate: '5h',
};

const TaskCardWrapper = ({ children }: { children: React.ReactNode }) => (
  <DndContext>{children}</DndContext>
);

describe('TaskCard Component', () => {
  it('renderiza todas as informações da tarefa', () => {
    render(
      <TaskCardWrapper>
        <TaskCard task={mockTask} />
      </TaskCardWrapper>
    );

    expect(screen.getByText('TASK-123')).toBeInTheDocument();
    expect(screen.getByText('Implementar funcionalidade X')).toBeInTheDocument();
    expect(screen.getByText('Alta')).toBeInTheDocument();
    expect(screen.getByText('Feature')).toBeInTheDocument();
    expect(screen.getByText('15/12/2024')).toBeInTheDocument();
    expect(screen.getByText('Vence em 3 dias')).toBeInTheDocument();
    expect(screen.getByText('5h')).toBeInTheDocument();
  });

  it('exibe as tags com as cores corretas', () => {
    render(
      <TaskCardWrapper>
        <TaskCard task={mockTask} />
      </TaskCardWrapper>
    );

    const taskIdTag = screen.getByText('TASK-123').closest('.ant-tag');
    const priorityTag = screen.getByText('Alta').closest('.ant-tag');
    const typeTag = screen.getByText('Feature').closest('.ant-tag');

    expect(taskIdTag).toHaveClass('ant-tag-purple');
    expect(priorityTag).toHaveClass('ant-tag-red');
    expect(typeTag).toHaveClass('ant-tag-magenta');
  });

  it('chama onEdit ao clicar no ícone de editar', async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn();

    render(
      <TaskCardWrapper>
        <TaskCard task={mockTask} onEdit={mockOnEdit} />
      </TaskCardWrapper>
    );

    const editIcon = screen.getByRole('img', { name: /edit/i });
    await user.click(editIcon);

    expect(mockOnEdit).toHaveBeenCalledWith('1');
  });

  it('renderiza avatar do usuário', () => {
    render(
      <TaskCardWrapper>
        <TaskCard task={mockTask} />
      </TaskCardWrapper>
    );

    const avatar = screen.getByText('U');
    expect(avatar).toBeInTheDocument();
    expect(avatar.closest('.ant-avatar')).toBeInTheDocument();
  });

  it('exibe tipo de deadline correto', () => {
    const taskWithDanger = {
      ...mockTask,
      deadlineInfo: { type: 'danger' as const, label: 'Atrasado' },
    };

    render(
      <TaskCardWrapper>
        <TaskCard task={taskWithDanger} />
      </TaskCardWrapper>
    );

    const deadlineText = screen.getByText('Atrasado');
    expect(deadlineText).toBeInTheDocument();
  });

  it('renderiza card em modo overlay', () => {
    const { container } = render(
      <TaskCardWrapper>
        <TaskCard task={mockTask} overlay />
      </TaskCardWrapper>
    );

    const cardWrapper = container.querySelector('[data-task-id="1"]');
    expect(cardWrapper).toHaveStyle({ zIndex: 9999 });
  });

  it('aplica data-task-id para identificação', () => {
    const { container } = render(
      <TaskCardWrapper>
        <TaskCard task={mockTask} />
      </TaskCardWrapper>
    );

    const taskElement = container.querySelector('[data-task-id="1"]');
    expect(taskElement).toBeInTheDocument();
  });

  it('trunca título longo com ellipsis', () => {
    const taskWithLongTitle = {
      ...mockTask,
      title: 'Este é um título muito longo que deveria ser truncado com ellipsis quando exceder o limite de linhas',
    };

    render(
      <TaskCardWrapper>
        <TaskCard task={taskWithLongTitle} />
      </TaskCardWrapper>
    );

    const titleElement = screen.getByText(taskWithLongTitle.title);
    expect(titleElement).toBeInTheDocument();
  });
});