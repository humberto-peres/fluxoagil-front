import React, { useEffect, useState } from 'react';
import { Table, Form, Popover, Tag, Modal, Tooltip, Popconfirm, Button, App } from 'antd';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import DefaultLayout from '@/components/Layout/DefaultLayout'
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
}

const Workspace: React.FC = () => {
	const { message } = App.useApp();
	const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [editingId, setEditingId] = useState<number | null>(null);

	const fetchWorkspaces = async () => {
		const data = await getWorkspaces();
		setWorkspaces(data);
	};

	useEffect(() => {
		fetchWorkspaces();
	}, []);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => {
		setIsModalOpen(false);
		form.resetFields();
		setEditingId(null);
	};

	const handleFormSubmit = async (values: any) => {
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

			closeModal();
			fetchWorkspaces();
		} catch {
			message.error('Erro ao salvar workspace');
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
		try {
			await deleteWorkspaces([id]);
			message.success('Workspace excluído com sucesso!');
			fetchWorkspaces();
		} catch {
			message.error('Erro ao excluir workspace');
		}
	};

	const columns: TableColumnsType<WorkspaceType> = [
		{ title: 'Nome', dataIndex: 'name', width: 280, ellipsis: true },
		{ title: 'Código', dataIndex: 'key', width: 120, responsive: ['sm'] },
		{ title: 'Metodologia', dataIndex: 'methodology', width: 160, responsive: ['md'] },
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
						<button type="button" className="bg-transparent border-0 p-0 text-inherit underline cursor-pointer">{record.teamName}</button>
					</Popover>
				);
			}
		},
		{
			title: 'Ações',
			key: 'actions',
			width: 110,
			fixed: 'right',
			render: (_: unknown, record: WorkspaceType) => (
				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
					<Tooltip title="Editar">
						<Button
							type="text"
							aria-label={`Editar ${record.name}`}
							onClick={() => handleEditRecord(record)}
							icon={<FiEdit2 size={18} />}
						/>
					</Tooltip>
					<Tooltip title="Excluir">
						<Popconfirm
							title="Excluir workspace?"
							description="Esta ação não pode ser desfeita."
							okText="Excluir"
							okButtonProps={{ danger: true }}
							cancelText="Cancelar"
							onConfirm={() => handleDeleteRecord(record.id)}
						>
							<Button
								type="text"
								aria-label={`Excluir ${record.name}`}
								icon={<FiTrash2 size={18} />}
							/>
						</Popconfirm>
					</Tooltip>
				</div>
			),
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
				size="middle"
				pagination={{ pageSize: 10, responsive: true, showSizeChanger: true }}
				scroll={{ x: 720 }}
			/>

			<Modal
				open={isModalOpen}
				title={editingId ? 'Editar Workspace' : 'Criar Workspace'}
				onOk={() => form.submit()}
				okText="Salvar"
				okButtonProps={{ disabled: disableOk }}
				cancelText="Cancelar"
				onCancel={closeModal}
				rootClassName="responsive-modal"
				width={700}
			>
				<FormWorkspace form={form} onFinish={handleFormSubmit} isEditing={!!editingId} />
			</Modal>
		</DefaultLayout>
	);
};

export default Workspace;
