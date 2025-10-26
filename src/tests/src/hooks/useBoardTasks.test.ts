import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBoardTasks } from '@/hooks/useBoardTasks';
import * as taskServices from '@/services/task.services';

vi.mock('@/services/task.services', () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTasks: vi.fn(),
  moveTask: vi.fn(),
  getTaskById: vi.fn(),
}));

const mockTask = {
  id: 1,
  title: 'Tarefa 1',
  description: 'Descrição',
  stepId: 10,
  status: '10',
  workspaceId: 1,
};

const mockTask2 = {
  id: 2,
  title: 'Tarefa 2',
  description: 'Descrição 2',
  stepId: 20,
  status: '20',
  workspaceId: 1,
};

describe('useBoardTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar tarefas por workspace', async () => {
    vi.mocked(taskServices.getTasks).mockResolvedValue([mockTask, mockTask2]);

    const { result } = renderHook(() => useBoardTasks());

    await act(async () => {
      await result.current.loadByWorkspace({ workspaceId: 1 });
    });

    expect(taskServices.getTasks).toHaveBeenCalledWith({ workspaceId: 1, sprintId: undefined });
    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.tasks[0].id).toBe('1');
    expect(result.current.tasks[1].id).toBe('2');
  });

  it('deve criar nova tarefa', async () => {
    vi.mocked(taskServices.createTask).mockResolvedValue({ id: 3 });
    vi.mocked(taskServices.getTaskById).mockResolvedValue({ ...mockTask, id: 3 });

    const { result } = renderHook(() => useBoardTasks());

    await act(async () => {
      await result.current.create({ title: 'Nova Tarefa' });
    });

    expect(taskServices.createTask).toHaveBeenCalledWith({ title: 'Nova Tarefa' });
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe('3');
  });

  it('deve atualizar tarefa existente', async () => {
    vi.mocked(taskServices.getTasks).mockResolvedValue([mockTask]);
    vi.mocked(taskServices.updateTask).mockResolvedValue(undefined);
    vi.mocked(taskServices.getTaskById).mockResolvedValue({
      ...mockTask,
      title: 'Tarefa Atualizada',
    });

    const { result } = renderHook(() => useBoardTasks());

    await act(async () => {
      await result.current.loadByWorkspace({ workspaceId: 1 });
    });

    await act(async () => {
      await result.current.update(1, { title: 'Tarefa Atualizada' });
    });

    expect(taskServices.updateTask).toHaveBeenCalledWith(1, { title: 'Tarefa Atualizada' });
    expect(result.current.tasks[0].title).toBe('Tarefa Atualizada');
  });

  it('deve remover múltiplas tarefas', async () => {
    vi.mocked(taskServices.getTasks).mockResolvedValue([mockTask, mockTask2]);
    vi.mocked(taskServices.deleteTasks).mockResolvedValue(undefined);

    const { result } = renderHook(() => useBoardTasks());

    await act(async () => {
      await result.current.loadByWorkspace({ workspaceId: 1 });
    });

    expect(result.current.tasks).toHaveLength(2);

    await act(async () => {
      await result.current.removeMany([1]);
    });

    expect(taskServices.deleteTasks).toHaveBeenCalledWith([1]);
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe('2');
  });

  it('deve mover tarefa no drag and drop', async () => {
    vi.mocked(taskServices.getTasks).mockResolvedValue([mockTask]);
    vi.mocked(taskServices.moveTask).mockResolvedValue(undefined);

    const { result } = renderHook(() => useBoardTasks());

    await act(async () => {
      await result.current.loadByWorkspace({ workspaceId: 1 });
    });

    const dragEvent = {
      active: { id: 1 },
      over: { id: 30 },
    };

    await act(async () => {
      await result.current.onDragEnd(dragEvent as any);
    });

    expect(taskServices.moveTask).toHaveBeenCalledWith(1, 30);
    expect(result.current.tasks[0].stepId).toBe(30);
    expect(result.current.tasks[0].status).toBe('30');
  });
});