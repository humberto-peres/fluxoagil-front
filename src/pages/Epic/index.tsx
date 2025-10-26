import React, { useEffect, useState } from 'react';
import { Modal, Form, Result, FloatButton, App } from "antd";
import { FilterOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

import DefaultLayout from '@/components/Layout/DefaultLayout';
import BoardFilterDrawer from '@/components/Task/BoardFilterDrawer';
import FormEpic from '@/components/Epic/FormEpic';
import EpicTaskDrawer from '@/components/Epic/EpicTaskDrawer';

import {
	getEpics,
	createEpic,
	updateEpic,
	deleteEpics,
	type EpicDTO as BaseEpicDTO,
} from '@/services/epic.services';
import EpicList from '@/components/Epic/EpicList';

type EpicDTO = BaseEpicDTO & { _count?: { tasks: number } };

const COOKIE_KEY = 'board.selectedWorkspaceId';

function highlight(el: HTMLElement) {
	el.classList.add('ring-2', 'ring-violet-500', 'shadow-[0_0_0_6px_rgba(139,92,246,0.35)]');
	setTimeout(() => el.classList.remove('ring-2', 'ring-violet-500', 'shadow-[0_0_0_6px_rgba(139,92,246,0.35)]'), 2200);
}

const EpicPage: React.FC = () => {
	const { message } = App.useApp();
	const location = useLocation();

	const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);
	const [filterOpen, setFilterOpen] = useState(false);

	const [epics, setEpics] = useState<EpicDTO[]>([]);
	const [loading, setLoading] = useState(false);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form] = Form.useForm();

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [drawerEpicId, setDrawerEpicId] = useState<number | null>(null);

	useEffect(() => {
		const saved = Cookies.get(COOKIE_KEY);
		const parsed = saved ? Number(saved) : null;
		if (parsed && !Number.isNaN(parsed)) setSelectedWorkspaceId(parsed);
	}, []);

	useEffect(() => {
		const focus = (location.state as any)?.focus;
		if (!focus || focus.type !== 'epic') return;

		const t = setTimeout(() => {
			const el = document.querySelector<HTMLElement>(`[data-epic-id="${focus.id}"]`);
			if (el) {
				el.scrollIntoView({ behavior: 'smooth', block: 'center' });
				highlight(el);
			}
		}, 120);
		return () => clearTimeout(t);
	}, [location.state]);

	const loadEpics = async (): Promise<void> => {
		if (!selectedWorkspaceId) {
			setEpics([]);
			return;
		}
		try {
			setLoading(true);
			const list = (await getEpics({ workspaceId: selectedWorkspaceId })) as EpicDTO[];
			setEpics(list);
		} catch {
			message.error('Erro ao carregar épicos');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadEpics();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedWorkspaceId]);

	const openCreateModal = (): void => {
		if (!selectedWorkspaceId) {
			message.warning('Selecione um workspace');
			return;
		}
		setEditingId(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	const openEditModal = (epic: EpicDTO): void => {
		setEditingId(epic.id);
		form.setFieldsValue({
			title: epic.title,
			description: epic.description ?? null,
			priorityId: epic.priority?.id ?? undefined,
			startDate: epic.startDate ? dayjs(epic.startDate, 'DD/MM/YYYY') : undefined,
			targetDate: epic.targetDate ? dayjs(epic.targetDate, 'DD/MM/YYYY') : undefined,
		});
		setIsModalOpen(true);
	};

	const closeModal = (): void => {
		setIsModalOpen(false);
		form.resetFields();
		setEditingId(null);
	};

	const handleSubmit = async (values: any): Promise<void> => {
		try {
			if (!selectedWorkspaceId) {
				message.error('Selecione um workspace');
				return;
			}
			const payload = {
				workspaceId: selectedWorkspaceId,
				title: values.title,
				description: values.description ?? null,
				startDate: values.startDate?.toDate?.() ?? null,
				targetDate: values.targetDate?.toDate?.() ?? null,
				priorityId: values.priorityId ?? null,
			};

			if (editingId) {
				await updateEpic(editingId, payload);
				message.success('Épico atualizado');
			} else {
				await createEpic(payload);
				message.success('Épico criado');
			}

			closeModal();
			await loadEpics();
		} catch (e: any) {
			message.error(e?.message || 'Erro ao salvar épico');
		}
	};

	const openDrawer = (id: number): void => {
		setDrawerEpicId(id);
		setDrawerOpen(true);
	};

	const confirmDelete = async (epic: EpicDTO) => {
		try {
			await deleteEpics([epic.id]);
			message.success('Épico excluído');
			await loadEpics();
		} catch (e: any) {
			message.error(e?.message || 'Não foi possível excluir. Verifique se há atividades associadas.');
		}
	};

	return (
		<DefaultLayout
			title="Épicos"
			addButton
			textButton="Criar Épico"
			onAddClick={openCreateModal}
		>
			<FloatButton
				icon={<FilterOutlined />}
				tooltip="Filtros"
				onClick={() => setFilterOpen(true)}
				badge={selectedWorkspaceId ? { dot: true } : undefined}
				type="primary"
			/>

			{!selectedWorkspaceId ? (
				<Result
					status="info"
					title="Selecione um Workspace para visualizar/gerenciar épicos"
					subTitle="Use o botão de Filtros para escolher um workspace."
					style={{ marginTop: 48 }}
				/>
			) : (
				<EpicList
					epics={epics}
					loading={loading}
					onEdit={openEditModal}
					onDelete={confirmDelete}
					openDrawer={openDrawer}
				/>
			)}

			<BoardFilterDrawer
				open={filterOpen}
				onClose={() => setFilterOpen(false)}
				initialWorkspaceId={selectedWorkspaceId}
				onApply={({ workspaceId }) => {
					if (workspaceId) Cookies.set(COOKIE_KEY, String(workspaceId), { expires: 365 });
					else Cookies.remove(COOKIE_KEY);
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
				title={editingId ? 'Editar Épico' : 'Criar Épico'}
				onOk={() => form.submit()}
				okText="Salvar"
				cancelText="Cancelar"
				onCancel={closeModal}
				destroyOnHidden
				rootClassName="responsive-modal"
				width={640}
			>
				<FormEpic form={form} onFinish={handleSubmit} />
			</Modal>

			<EpicTaskDrawer
				open={drawerOpen}
				epicId={drawerEpicId}
				workspaceId={selectedWorkspaceId}
				onClose={() => setDrawerOpen(false)}
			/>
		</DefaultLayout>
	);
};

export default EpicPage;
