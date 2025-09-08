import React, { useEffect, useMemo, useState } from 'react';
import { Result, message, FloatButton, Form, Modal } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';

import DefaultLayout from '@/components/Layout/DefaultLayout';
import { Column as ColumnCmp } from './Column';
import { DndContext } from '@dnd-kit/core';
import { getWorkspaces } from '@/services/workspace.services';
import BoardFilterDrawer from '@/components/Task/BoardFilterDrawer';
import FormTask from '@/components/Task/FormTask';
import { useBoardTasks } from '@/hooks/useBoardTasks';
import { getTaskById } from '@/services/task.services';
import { getSprints, type SprintDTO } from '@/services/sprint.services';
import type { DragEndEvent } from '@dnd-kit/core';

export type Task = { id: string; status: string; title: string; description: string };
export type ColumnType = { id: string; title: string };
type Workspace = { id: number; name: string; methodology: string; steps: { stepId: number; name: string }[] };

const COOKIE_KEY = 'board.selectedWorkspaceId';

const Board: React.FC = () => {
	const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
	const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);
	const [columns, setColumns] = useState<ColumnType[]>([]);
	const [filterOpen, setFilterOpen] = useState(false);
	const [filterForm] = Form.useForm();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [activeSprint, setActiveSprint] = useState<SprintDTO | null>(null);
	const [form] = Form.useForm();

	const { tasks, loadByWorkspace, create, update, onDragEnd } = useBoardTasks();

	useEffect(() => {
		(async () => {
			try {
				const data = await getWorkspaces();
				setWorkspaces(data);
			} catch {
				message.error('Erro ao carregar workspaces');
			}
		})();
	}, []);

	useEffect(() => {
		const saved = Cookies.get(COOKIE_KEY);
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
				setActiveSprint(null);
				return;
			}

			const cols = (selectedWorkspace.steps || []).map((s) => ({
				id: s.stepId.toString(),
				title: s.name,
			}));
			setColumns(cols);

			if (selectedWorkspace.methodology === 'Scrum') {
				try {
					const actives = await getSprints({ workspaceId: selectedWorkspaceId, active: true });
					const current = actives[0] ?? null;
					setActiveSprint(current);
					await loadByWorkspace({ workspaceId: selectedWorkspaceId, sprintId: current?.id ?? null });
				} catch {
					message.error('Erro ao carregar sprint ativa');
				}
			} else {
				setActiveSprint(null);
				await loadByWorkspace({ workspaceId: selectedWorkspaceId, sprintId: undefined });
			}
		};
		run();
	}, [selectedWorkspaceId, selectedWorkspace, loadByWorkspace]);

	const tasksByColumn = useMemo<Record<string, Task[]>>(() => {
		const by: Record<string, Task[]> = {};
		for (const t of tasks) (by[t.status] ||= []).push(t);
		return by;
	}, [tasks]);

	function handleDragEnd(event: DragEndEvent) {
		onDragEnd(event).catch(() => message.error('Não foi possível mover a atividade'));
	}

	const openFilter = () => {
		filterForm.setFieldsValue({ workspaceId: selectedWorkspaceId ?? undefined });
		setFilterOpen(true);
	};

	const openModal = () => {
		if (activeSprint) form.setFieldsValue({ sprint: activeSprint.id });
		setIsModalOpen(true);
	};

	const closeModal = () => {
		form.resetFields();
		setEditingId(null);
		setIsModalOpen(false);
	};

	const handleFormSubmit = async (values: any) => {
		try {
			const stepIdDefault = columns[0] ? Number(columns[0].id) : undefined;
			if (!stepIdDefault) {
				message.error('Nenhuma etapa encontrada neste Workspace');
				return;
			}

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
				workspaceId: selectedWorkspaceId ?? null,
				stepId: editingId ? undefined : stepIdDefault,
				status: editingId ? undefined : String(stepIdDefault),
			};

			if (editingId) {
				await update(editingId, payload);
				message.success('Atividade atualizada com sucesso!');
			} else {
				await create(payload);
				message.success('Atividade criada com sucesso!');
			}

			closeModal();

			if (selectedWorkspaceId) {
				await loadByWorkspace({
					workspaceId: selectedWorkspaceId,
					sprintId: activeSprint?.id ?? (selectedWorkspace?.methodology === 'Scrum' ? null : undefined),
				});
			}
		} catch {
			message.error('Erro ao salvar atividade');
		}
	};

	const handleEditTask = async (id: string) => {
		try {
			const data = await getTaskById(Number(id));
			setEditingId(Number(id));
			form.setFieldsValue({
				title: data.title,
				'type-task': data.typeTaskId,
				priority: data.priorityId,
				sprint: data.sprintId ?? undefined,
				estimate: data.estimate ?? undefined,
				'start-date': data.startDate ? dayjs(data.startDate) : undefined,
				deadline: data.deadline ? dayjs(data.deadline) : undefined,
				report: data.reporterId ?? undefined,
				responsible: data.assigneeId ?? undefined,
				description: data.description ?? '',
			});
			setIsModalOpen(true);
		} catch {
			message.error('Erro ao carregar atividade');
		}
	};

	return (
		<DefaultLayout
			title="Board"
			addButton
			textButton="Criar Atividade"
			onAddClick={openModal}
		>
			<FloatButton
				icon={<FilterOutlined />}
				tooltip="Filtros"
				onClick={openFilter}
				badge={selectedWorkspaceId ? { dot: true } : undefined}
				type="primary"
			/>

			<BoardFilterDrawer
				open={filterOpen}
				onClose={() => setFilterOpen(false)}
				workspaces={workspaces}
				initialWorkspaceId={selectedWorkspaceId}
				onApply={({ workspaceId }) => {
					setSelectedWorkspaceId(workspaceId ?? null);
					message.success('Filtro aplicado');
					setFilterOpen(false);
				}}
				onClear={() => {
					setSelectedWorkspaceId(null);
					message.success('Filtro limpo');
					setFilterOpen(false);
				}}
			/>

			<Modal
				open={isModalOpen}
				title={editingId ? 'Editar Atividade' : 'Criar Atividade'}
				onOk={() => form.submit()}
				onCancel={closeModal}
			>
				<FormTask form={form} onFinish={handleFormSubmit} selectedWorkspaceId={selectedWorkspaceId ?? undefined} />
			</Modal>

			{!selectedWorkspaceId ? (
				<Result
					status="info"
					title="Selecione um Workspace para visualizar o Board"
					subTitle="Use o botão de Filtros para escolher um workspace."
					style={{ marginTop: 48, height: 'calc(100% - 200px)' }}
				/>
			) : selectedWorkspace?.methodology === 'Scrum' && !activeSprint ? (
				<Result
					status="warning"
					title="Nenhuma sprint ativa"
					subTitle="Ative uma sprint neste workspace para visualizar o board."
					style={{ marginTop: 48, height: 'calc(100% - 200px)' }}
				/>
			) : (
				<div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginInline: 16 }}>
					<DndContext onDragEnd={handleDragEnd}>
						{columns.map((column) => (
							<ColumnCmp
								key={column.id}
								column={column}
								tasks={(tasksByColumn[column.id] ?? []) as any}
								onEditTask={handleEditTask}
							/>
						))}
					</DndContext>
				</div>
			)}
		</DefaultLayout>
	);
};

export default Board;
