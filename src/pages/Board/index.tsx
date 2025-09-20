import React, { useEffect, useMemo, useState } from 'react';
import { Result, FloatButton, Form, Modal, App, Grid, Select, Space, Typography } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { createPortal } from 'react-dom';

import DefaultLayout from '@/components/Layout/DefaultLayout';
import { Column as ColumnCmp } from './Column';
import BoardFilterDrawer from '@/components/Task/BoardFilterDrawer';
import FormTask from '@/components/Task/FormTask';
import QuickAddTask from '@/components/Task/QuickAddTask';
import { TaskCard } from './TaskCard';

import { getWorkspaces } from '@/services/workspace.services';
import { getTaskById } from '@/services/task.services';
import { useBoardTasks } from '@/hooks/useBoardTasks';
import { getSprints, type SprintDTO } from '@/services/sprint.services';

export type Task = { id: string; status: string; title: string; description: string };
export type ColumnType = { id: string; title: string };
type Workspace = {
	id: number;
	name: string;
	methodology: string;
	key: string;
	steps: { stepId: number; name: string }[];
};

const COOKIE_WS = 'board.selectedWorkspaceId';
const COOKIE_SPRINT_PREFIX = 'board.selectedSprintId';
const { useBreakpoint } = Grid;

function getSprintCookie(wsId: number | null) {
	if (!wsId) return null;
	const raw = Cookies.get(`${COOKIE_SPRINT_PREFIX}.${wsId}`);
	const n = raw ? Number(raw) : NaN;
	return Number.isFinite(n) ? n : null;
}
function setSprintCookie(wsId: number | null, sprintId: number | null) {
	if (!wsId) return;
	const key = `${COOKIE_SPRINT_PREFIX}.${wsId}`;
	if (sprintId) Cookies.set(key, String(sprintId), { expires: 365 });
	else Cookies.remove(key);
}

const Board: React.FC = () => {
	const { message } = App.useApp();
	const screens = useBreakpoint();
	const isMobile = !screens.md;

	const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
	const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);
	const [columns, setColumns] = useState<ColumnType[]>([]);
	const [filterOpen, setFilterOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form] = Form.useForm();

	const { tasks, loadByWorkspace, create, update, onDragEnd } = useBoardTasks();

	const [activeTask, setActiveTask] = useState<any | null>(null);

	const [activeSprints, setActiveSprints] = useState<SprintDTO[]>([]);
	const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null);

	useEffect(() => {
		(async () => {
			try { setWorkspaces(await getWorkspaces()); }
			catch { message.error('Erro ao carregar workspaces'); }
		})();
	}, [message]);

	useEffect(() => {
		const saved = Cookies.get(COOKIE_WS);
		const parsed = saved ? Number(saved) : null;
		if (parsed && !Number.isNaN(parsed)) setSelectedWorkspaceId(parsed);
	}, []);

	const selectedWorkspace = useMemo(
		() => workspaces.find((w) => w.id === selectedWorkspaceId) ?? null,
		[workspaces, selectedWorkspaceId]
	);

	useEffect(() => {
		const run = async () => {
			if (!selectedWorkspaceId || !selectedWorkspace) {
				setColumns([]);
				setActiveSprints([]);
				setSelectedSprintId(null);
				return;
			}

			const cols = (selectedWorkspace.steps || []).map((s) => ({ id: s.stepId.toString(), title: s.name }));
			setColumns(cols);

			if (selectedWorkspace.methodology === 'Scrum') {
				try {
					const actives = await getSprints({ workspaceId: selectedWorkspaceId, state: 'active' });
					setActiveSprints(actives);

					const wanted = getSprintCookie(selectedWorkspaceId);
					const chosen = actives.length
						? (actives.some(s => s.id === wanted) ? wanted : actives[0].id)
						: null;

					setSelectedSprintId(chosen);
					setSprintCookie(selectedWorkspaceId, chosen);

					await loadByWorkspace({ workspaceId: selectedWorkspaceId, sprintId: chosen ?? null });
				} catch {
					message.error('Erro ao carregar sprint ativa');
				}
			} else {
				setActiveSprints([]);
				setSelectedSprintId(null);
				await loadByWorkspace({ workspaceId: selectedWorkspaceId, sprintId: undefined });
			}
		};
		run();
	}, [selectedWorkspaceId, selectedWorkspace]);

	const tasksByColumn = useMemo<Record<string, Task[]>>(() => {
		const by: Record<string, Task[]> = {};
		for (const t of tasks) (by[t.status] ||= []).push(t as any);
		return by;
	}, [tasks]);

	function handleDragStart(e: DragStartEvent) {
		const id = String(e.active.id);
		const found = (tasks as any[]).find((t) => String(t.id) === id) || null;
		setActiveTask(found);
	}
	async function handleDragEnd(e: DragEndEvent) {
		setActiveTask(null);
		try { await onDragEnd(e); }
		catch { message.error('Não foi possível mover a atividade'); }
	}

	const openFilter = () => { setFilterOpen(true); };
	const openModal = () => {
		if (selectedSprintId) form.setFieldsValue({ sprint: selectedSprintId });
		if (selectedWorkspaceId) form.setFieldsValue({ workspaceId: selectedWorkspaceId });
		setIsModalOpen(true);
	};
	const closeModal = () => { form.resetFields(); setEditingId(null); setIsModalOpen(false); };

	const handleFormSubmit = async (values: any) => {
		try {
			const stepIdDefault = columns[0] ? Number(columns[0].id) : undefined;
			if (!stepIdDefault) { message.error('Nenhuma etapa encontrada neste Workspace'); return; }

			const payload = {
				title: values.title,
				description: values.description ?? null,
				estimate: values.estimate ?? null,
				startDate: values['start-date']?.toISOString?.() ?? null,
				deadline: values.deadline?.toISOString?.() ?? null,
				sprintId: values.sprint ?? null,
				typeTaskId: Number(values['type-task']),
				priorityId: Number(values.priority),
				reporterId: values.report ? Number(values.report) : null,
				assigneeId: values.responsible ? Number(values.responsible) : null,
				userId: Number(values.report ?? values.responsible),
				workspaceId: Number(values.workspaceId ?? selectedWorkspaceId),
				epicId: values.epicId ?? null,
				stepId: editingId ? undefined : stepIdDefault,
				status: editingId ? undefined : String(stepIdDefault),
			};

			if (editingId) { await update(editingId, payload); message.success('Atividade atualizada com sucesso!'); }
			else { await create(payload); message.success('Atividade criada com sucesso!'); }

			closeModal();

			if (selectedWorkspaceId) {
				await loadByWorkspace({ workspaceId: selectedWorkspaceId, sprintId: selectedSprintId ?? null });
			}
		} catch { message.error('Erro ao salvar atividade'); }
	};

	const handleEditTask = async (id: string) => {
		try {
			const data = await getTaskById(Number(id));
			setEditingId(Number(id));
			form.setFieldsValue({
				workspaceId: data.workspaceId,
				title: data.title,
				'type-task': data.typeTaskId,
				priority: data.priorityId,
				sprint: data.sprintId ?? undefined,
				epicId: data.epic?.id ?? undefined,
				estimate: data.estimate ?? undefined,
				'start-date': data.startDate ? dayjs(data.startDate) : undefined,
				deadline: data.deadline ? dayjs(data.deadline) : undefined,
				report: data.reporterId ?? undefined,
				responsible: data.assigneeId ?? undefined,
				description: data.description ?? '',
			});
			setIsModalOpen(true);
		} catch { message.error('Erro ao carregar atividade'); }
	};

	const handleQuickCreate = async (partial: any) => {
		const stepIdDefault = columns[0] ? Number(columns[0].id) : undefined;
		if (!stepIdDefault) throw new Error('Nenhuma etapa encontrada neste Workspace');
		const payload = { ...partial, workspaceId: selectedWorkspaceId, stepId: stepIdDefault, status: String(stepIdDefault) };
		await create(payload);
	};

	return (
		<DefaultLayout title="Board" addButton textButton="Criar Atividade" onAddClick={openModal}>
			<FloatButton icon={<FilterOutlined />} tooltip="Filtros" onClick={openFilter}
				badge={selectedWorkspaceId ? { dot: true } : undefined} type="primary" /> 

			{!isMobile && (
				<div className="px-4 mb-4">
					<QuickAddTask onCreate={handleQuickCreate} selectedWorkspaceId={selectedWorkspaceId} />
				</div>
			)}

			<BoardFilterDrawer
				open={filterOpen}
				onClose={() => setFilterOpen(false)}
				initialWorkspaceId={selectedWorkspaceId}
				showSprintSelector
				sprintOptions={activeSprints.map(s => ({ label: s.name, value: s.id }))}
				initialSprintId={selectedSprintId ?? getSprintCookie(selectedWorkspaceId) ?? null}
				onApply={({ workspaceId, sprintId }) => {
					const wsChanged = workspaceId !== undefined && workspaceId !== selectedWorkspaceId;

					if (workspaceId) Cookies.set(COOKIE_WS, String(workspaceId), { expires: 365 });
					else Cookies.remove(COOKIE_WS);
					setSelectedWorkspaceId(workspaceId ?? null);

					if (!wsChanged && typeof sprintId !== 'undefined') {
						setSelectedSprintId(sprintId ?? null);
						setSprintCookie(selectedWorkspaceId, sprintId ?? null);
						if (selectedWorkspaceId) {
							loadByWorkspace({ workspaceId: selectedWorkspaceId, sprintId: sprintId ?? null })
								.catch(() => message.error('Erro ao aplicar filtros'));
						}
					}

					message.success('Filtro aplicado');
					setFilterOpen(false);
				}}
				onClear={() => {
					Cookies.remove(COOKIE_WS);
					setSelectedWorkspaceId(null);

					setSprintCookie(selectedWorkspaceId, null);
					setSelectedSprintId(null);

					message.success('Filtro limpo');
					setFilterOpen(false);
				}}
			/>

			<Modal
				open={isModalOpen}
				title={editingId ? 'Editar Atividade' : 'Criar Atividade'}
				onOk={() => form.submit()}
				okText="Salvar"
				cancelText="Cancelar"
				onCancel={closeModal}
				destroyOnHidden
				rootClassName="responsive-modal"
				width={screens.lg ? 720 : undefined}
			>
				<FormTask form={form} onFinish={handleFormSubmit} selectedWorkspaceId={selectedWorkspaceId ?? undefined} />
			</Modal>

			{!selectedWorkspaceId ? (
				<Result status="info" title="Selecione um Workspace para visualizar o Board"
					subTitle="Use o botão de Filtros para escolher um workspace." style={{ marginTop: 48, height: 'calc(100% - 200px)' }} />
			) : selectedWorkspace?.methodology === 'Scrum' && activeSprints.length === 0 ? (
				<></>
			) : (
				<div className="flex gap-3 overflow-x-auto px-3 py-2 snap-x snap-mandatory scroll-px-3 no-scrollbar">
					<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
						{columns.map((column) => (
							<ColumnCmp key={column.id} column={column} tasks={(tasksByColumn[column.id] ?? []) as any} onEditTask={handleEditTask} />
						))}
						{createPortal(
							<DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(.2,.8,.2,1)' }}>
								{activeTask ? <TaskCard task={activeTask} overlay /> : null}
							</DragOverlay>,
							document.body
						)}
					</DndContext>
				</div>
			)}
		</DefaultLayout>
	);
};

export default Board;
