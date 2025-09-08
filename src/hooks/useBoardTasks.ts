import { useCallback, useState } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  getTasks,
  createTask as apiCreate,
  updateTask as apiUpdate,
  deleteTasks,
  moveTask,
  getTaskById,
  type TaskDTO,
} from '@/services/task.services';

export type ApiTask = TaskDTO;
export type BoardTask = Omit<ApiTask, 'id'> & { id: string };
type LoadParams = { workspaceId: number; sprintId?: number | null };

export function useBoardTasks() {
  const [tasks, setTasks] = useState<BoardTask[]>([]);

  const toBoardTask = (t: ApiTask): BoardTask => ({
    ...t,
    id: String(t.id),
    status: String(t.stepId),
  });

  const loadByWorkspace = useCallback(async ({ workspaceId, sprintId }: LoadParams) => {
    const apiTasks: ApiTask[] = await getTasks({ workspaceId, sprintId });
    setTasks((apiTasks || []).map(toBoardTask));
  }, []);

  const create = useCallback(async (payload: any) => {
    const created = await apiCreate(payload);
    const full: ApiTask = await getTaskById(created.id);
    const bt = toBoardTask(full);
    setTasks(prev => [bt, ...prev]);
    return full;
  }, []);

  const update = useCallback(async (id: number, payload: any) => {
    await apiUpdate(id, payload);
    const full: ApiTask = await getTaskById(id);
    const bt = toBoardTask(full);
    setTasks(prev => prev.map(t => (t.id === String(id) ? bt : t)));
    return full;
  }, []);

  const removeMany = useCallback(async (ids: number[]) => {
    await deleteTasks(ids);
    const idsStr = ids.map(String);
    setTasks(prev => prev.filter(t => !idsStr.includes(t.id)));
  }, []);

  const onDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = Number(active.id);
    const newStepId = Number(over.id);
    await moveTask(taskId, newStepId);
    setTasks(prev =>
      prev.map(t =>
        t.id === String(taskId)
          ? { ...t, status: String(newStepId), stepId: newStepId }
          : t
      )
    );
  }, []);

  return { tasks, setTasks, loadByWorkspace, create, update, removeMany, onDragEnd };
}
