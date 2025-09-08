import React, { useEffect, useMemo, useState } from 'react';
import { message, FloatButton, Modal, Form, Result } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';

import DefaultLayout from '@/components/Layout/DefaultLayout';
import BoardFilterDrawer from '@/components/Task/BoardFilterDrawer';
import SprintList from '@/components/Sprint/SprintList';
import FormSprint from '@/components/Sprint/FormSprint';
import TaskList from '@/components/Task/TaskList';

import { getWorkspaces } from '@/services/workspace.services';
import {
	getSprints,
	createSprint,
	updateSprint,
	activateSprint,
	closeSprint,
	type SprintDTO
} from '@/services/sprint.services';
import { getTasks } from '@/services/task.services';

type Workspace = { id: number; name: string; methodology: string };

type ApiTask = {
	id: number;
	title: string;
	description?: string | null;
	estimate?: string | null;
	startDate?: string | null;
	deadline?: string | null;
	sprintId?: number | null;
	step?: { id: number; name: string };
	priority?: { id: number; name: string; label: string };
	typeTask?: { id: number; name: string };
	reporter?: { id: number; name: string } | null;
	assignee?: { id: number; name: string } | null;
};

const COOKIE_KEY = 'board.selectedWorkspaceId';

const Backlog: React.FC = () => {
	const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
	const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);

	const [filterOpen, setFilterOpen] = useState(false);

	const [sprints, setSprints] = useState<SprintDTO[]>([]);
	const [tasks, setTasks] = useState<ApiTask[]>([]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form] = Form.useForm();

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
		() => workspaces.find(w => w.id === selectedWorkspaceId) ?? null,
		[workspaces, selectedWorkspaceId]
	);
	const isScrum = selectedWorkspace?.methodology === 'Scrum';

	const loadSprints = async () => {
		if (!selectedWorkspaceId) {
			setSprints([]);
			return;
		}
		try {
			const list = await getSprints({ workspaceId: selectedWorkspaceId });
			setSprints(list);
		} catch {
			message.error('Erro ao carregar sprints');
		}
	};

	const loadTasks = async () => {
		if (!selectedWorkspaceId) {
			setTasks([]);
			return;
		}
		try {
			const list: ApiTask[] = await getTasks({ workspaceId: selectedWorkspaceId });
			setTasks(list || []);
		} catch {
			message.error('Erro ao carregar tarefas');
		}
	};

	useEffect(() => {
		(async () => {
			await Promise.all([loadSprints(), loadTasks()]);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedWorkspaceId]);

	const openCreate = () => {
		setEditingId(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	const openEdit = (s: SprintDTO) => {
		setEditingId(s.id);
		form.setFieldsValue({
			name: s.name,
			startDate: s.startDate ? dayjs(s.startDate, 'DD/MM/YYYY, HH:mm:ss') : undefined,
			endDate: s.endDate ? dayjs(s.endDate, 'DD/MM/YYYY, HH:mm:ss') : undefined,
		});
		setIsModalOpen(true);
	};

	const submitForm = async (values: any) => {
		try {
			if (!selectedWorkspaceId) {
				message.error('Selecione um workspace');
				return;
			}
			const payload = {
				name: values.name,
				workspaceId: selectedWorkspaceId,
				startDate: values.startDate?.toISOString?.() ?? null,
				endDate: values.endDate?.toISOString?.() ?? null,
			};
			if (editingId) {
				await updateSprint(editingId, payload);
				message.success('Sprint atualizada');
			} else {
				await createSprint(payload);
				message.success('Sprint criada');
			}
			setIsModalOpen(false);
			form.resetFields();
			await Promise.all([loadSprints(), loadTasks()]);
		} catch (e: any) {
			message.error(e?.message || 'Erro ao salvar sprint');
		}
	};

	const onActivate = async (s: SprintDTO) => {
		try {
			await activateSprint(s.id);
			message.success('Sprint ativada');
			await Promise.all([loadSprints(), loadTasks()]);
		} catch (e: any) {
			message.error(e?.message || 'Erro ao ativar sprint');
		}
	};

	const onClose = async (s: SprintDTO) => {
		try {
			await closeSprint(s.id);
			message.success('Sprint encerrada');
			await Promise.all([loadSprints(), loadTasks()]);
		} catch (e: any) {
			message.error(e?.message || 'Erro ao encerrar sprint');
		}
	};

	const { contentBySprintId, backlogContent } = useMemo(() => {
		const by: Record<number, ApiTask[]> = {};
		const backlog: ApiTask[] = [];

		for (const t of tasks) {
			if (isScrum) {
				if (t.sprintId == null) backlog.push(t);
				else (by[t.sprintId] ||= []).push(t);
			} else {
				backlog.push(t);
			}
		}

		const contentBySprintId: Record<number, React.ReactNode> = {};
		for (const s of sprints) {
			contentBySprintId[s.id] = <TaskList tasks={by[s.id] ?? []} />;
		}

		const backlogContent = <TaskList tasks={backlog} />;

		return { contentBySprintId, backlogContent };
	}, [tasks, sprints, isScrum]);

	return (
		<DefaultLayout
			title="Backlog"
			addButton
			textButton="Criar Sprint"
			onAddClick={openCreate}
		>
			<FloatButton
				icon={<FilterOutlined />}
				tooltip="Filtros"
				onClick={() => setFilterOpen(true)}
				badge={selectedWorkspaceId ? { dot: true } : undefined}
				type="primary"
			/>

			<BoardFilterDrawer
				open={filterOpen}
				onClose={() => setFilterOpen(false)}
				workspaces={workspaces}
				initialWorkspaceId={selectedWorkspaceId}
				onApply={({ workspaceId }) => {
					if (workspaceId) {
						Cookies.set(COOKIE_KEY, String(workspaceId), { expires: 365 });
					} else {
						Cookies.remove(COOKIE_KEY);
					}
					setSelectedWorkspaceId(workspaceId ?? null);
					message.success('Filtro aplicado');
					setFilterOpen(false);
				}}
				onClear={() => {
					Cookies.remove(COOKIE_KEY);
					setSelectedWorkspaceId(null);
					message.success('Filtro limpo');
					setFilterOpen(false);
				}}
			/>

			<Modal
				open={isModalOpen}
				title={editingId ? 'Editar Sprint' : 'Criar Sprint'}
				onOk={() => form.submit()}
				onCancel={() => setIsModalOpen(false)}
			>
				<FormSprint form={form} onFinish={submitForm} />
			</Modal>

			{!selectedWorkspaceId ? (
				<Result
					status="info"
					title="Selecione um Workspace para ver sprints e backlog"
					subTitle="Use o botão de Filtros para escolher um workspace."
					style={{ marginTop: 48 }}
				/>
			) : (
				<SprintList
					sprints={sprints}
					onEdit={openEdit}
					onActivate={onActivate}
					onClose={onClose}
					contentBySprintId={contentBySprintId}
					backlogContent={backlogContent}
				/>
			)}
		</DefaultLayout>
	);
};

export default Backlog;
