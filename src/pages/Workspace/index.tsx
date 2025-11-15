import React, { useCallback, useEffect, useState } from 'react';
import { Table, Form, Popover, Tag, Modal, Tooltip, Popconfirm, Button, App, Grid } from 'antd';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import FormWorkspace from './FormWorkspace';
import {
	getWorkspaces,
	createWorkspace,
	updateWorkspace,
	deleteWorkspaces
} from '@/services/workspace.services';
import type { TableColumnsType } from 'antd';

type WorkspaceType = {
	id: number;
	name: string;
	key: string;
	methodology: string;
	teamName: string;
	teamId: number;
	steps?: { stepId: number; name: string }[];
	members?: string[];
};

const { useBreakpoint } = Grid;

const Workspace: React.FC = () => {
	const { message } = App.useApp();
	const screens = useBreakpoint();
	const isCompact = !screens.lg;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form] = Form.useForm();
	const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);

	const fetchWorkspaces = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getWorkspaces();
			setWorkspaces(data);
		} catch (error: any) {
			message.error(error?.message || 'Erro ao carregar workspaces. Tente novamente.');
		} finally {
			setLoading(false);
		}
	}, [message]);

	useEffect(() => {
		fetchWorkspaces();
	}, [fetchWorkspaces]);

	const openModal = () => {
		setEditingId(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setEditingId(null);
		form.resetFields();
	};

	const handleFormSubmit = async (values: any) => {
		setSubmitting(true);
		try {
			const payload = {
				name: values.name,
				key: values.key,
				methodology: values.methodology,
				teamId: values.teamId,
				steps: values.steps.map((step: any, index: number) => ({
					stepId: step.stepId,
					order: index + 1,
				})),
			};

			if (editingId) {
				await updateWorkspace(editingId, payload);
				message.success('Workspace atualizado com sucesso!');
			} else {
				await createWorkspace(payload);
				message.success('Workspace criado com sucesso!');
			}
			fetchWorkspaces();
			closeModal();
		} catch (error: any) {
			message.error(error?.message || 'Erro ao salvar workspace. Tente novamente.');
		} finally {
			setSubmitting(false);
		}
	};

	const handleEditRecord = (record: WorkspaceType) => {
		form.setFieldsValue({
			name: record.name,
			key: record.key,
			methodology: record.methodology,
			steps: (record.steps ?? []).map(s => ({ stepId: s.stepId, name: s.name })),
			teamId: record.teamId,
		});
		setEditingId(record.id);
		setIsModalOpen(true);
	};

	const handleDeleteRecord = async (id: number) => {
		setDeletingId(id);
		try {
			await deleteWorkspaces([id]);
			message.success('Workspace excluído com sucesso!');
			fetchWorkspaces();
		} catch (error: any) {
			message.error(error?.message || 'Erro ao excluir workspace. Tente novamente.');
		} finally {
			setDeletingId(null);
		}
	};

	const columns: TableColumnsType<WorkspaceType> = [
		{
			title: 'Nome',
			dataIndex: 'name',
			width: 280,
			ellipsis: true,
			sorter: (a, b) => a.name.localeCompare(b.name),
		},
		{
			title: 'Código',
			dataIndex: 'key',
			width: 120,
			responsive: ['sm']
		},
		{
			title: 'Metodologia',
			dataIndex: 'methodology',
			width: 160,
			responsive: ['md']
		},
		{
			title: 'Equipe',
			dataIndex: 'teamName',
			width: 220,
			responsive: ['lg'],
			render: (_, record) => {
				const content = (
					<div style={{ maxWidth: 240 }}>
						{(record.members?.length ?? 0) > 0 ? (
							record.members!.map((name) => <Tag key={name}>{name}</Tag>)
						) : (
							<span>Sem membros</span>
						)}
					</div>
				);
				return (
					<Popover content={content} title="Membros da equipe" trigger="hover">
						<button
							type="button"
							className="bg-transparent border-0 p-0 text-inherit underline cursor-pointer"
						>
							{record.teamName}
						</button>
					</Popover>
				);
			}
		},
		{
			title: 'Ações',
			key: 'actions',
			width: 110,
			fixed: 'right',
			align: 'center',
			render: (_: unknown, record: WorkspaceType) => {
				const isDeleting = deletingId === record.id;
				const isDisabled = deletingId !== null;

				return (
					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
						<Tooltip title="Editar">
							<Button
								type="text"
								aria-label={`Editar ${record.name}`}
								onClick={() => handleEditRecord(record)}
								icon={<FiEdit2 size={18} />}
								disabled={isDisabled}
							/>
						</Tooltip>
						<Tooltip title="Excluir">
							<Popconfirm
								title="Excluir workspace?"
								description="Esta ação não pode ser desfeita."
								okText="Excluir"
								okButtonProps={{ danger: true, loading: isDeleting }}
								cancelText="Cancelar"
								onConfirm={() => handleDeleteRecord(record.id)}
								disabled={isDisabled}
							>
								<Button
									type="text"
									aria-label={`Excluir ${record.name}`}
									icon={<FiTrash2 size={18} />}
									loading={isDeleting}
									disabled={isDisabled && !isDeleting}
								/>
							</Popconfirm>
						</Tooltip>
					</div>
				);
			},
		},
	];

	const stepsWatch = Form.useWatch('steps', form) as any[] | undefined;
	const stepsCount = (stepsWatch?.length ?? 0);
	const disableOk = !editingId && stepsCount < 3;

	return (
		<DefaultLayout
			title="Workspace"
			addButton
			textButton="Criar Workspace"
			onAddClick={openModal}
		>
			<Table
				columns={columns}
				dataSource={workspaces}
				rowKey="id"
				loading={loading}
				size="middle"
				pagination={{
					pageSize: 10,
					responsive: true,
					showTotal: (total) => `Total: ${total} ${total === 1 ? 'workspace' : 'workspaces'}`
				}}
				scroll={isCompact ? { x: 'max-content' } : { x: 720 }}
				tableLayout="auto"
				locale={{ emptyText: 'Nenhum workspace cadastrado' }}
			/>

			<Modal
				open={isModalOpen}
				title={editingId ? 'Editar Workspace' : 'Criar Workspace'}
				onCancel={closeModal}
				onOk={() => form.submit()}
				okText={submitting ? 'Salvando...' : 'Salvar'}
				okButtonProps={{ disabled: disableOk }}
				cancelText="Cancelar"
				confirmLoading={submitting}
				destroyOnHidden
				rootClassName="responsive-modal"
				width={700}
				maskClosable={!submitting}
				keyboard={!submitting}
			>
				<FormWorkspace
					form={form}
					onFinish={handleFormSubmit}
					isEditing={!!editingId}
					loading={submitting}
				/>
			</Modal>
		</DefaultLayout>
	);
};

export default Workspace;
