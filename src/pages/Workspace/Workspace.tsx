import React, { useEffect, useState } from 'react';
import { Table, Form, message, Popover, Tag, Modal, Tooltip, Popconfirm, Button } from 'antd';
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
	prefix: string;
	methodology: string;
	teamName: string;
	teamId: number;
	steps?: { stepId: number; name: string }[];
	members?: string[];
}

const Workspace: React.FC = () => {
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

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		form.resetFields();
		setEditingId(null);
	};

	const handleFormSubmit = async (values: any) => {
		try {
			const payload = {
				name: values.name,
				prefix: values.prefix,
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
			prefix: record.prefix,
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
		{ title: 'Nome', dataIndex: 'name', width: '32%' },
		{ title: 'Código', dataIndex: 'prefix', width: '12%' },
		{ title: 'Metodologia', dataIndex: 'methodology', width: '20%' },
		{
			title: 'Equipe',
			dataIndex: 'teamName',
			width: '25%',
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
						<span style={{ cursor: 'pointer', color: '#1677ff' }}>{record.teamName}</span>
					</Popover>
				);
			}
		},
		{
			title: 'Ações',
			key: 'actions',
			width: 120,
			align: 'center',
			render: (_: unknown, record: WorkspaceType) => (
				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
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
								className="group"
								aria-label={`Excluir ${record.name}`}
								icon={
									<FiTrash2 size={18} />
								}
							/>
						</Popconfirm>
					</Tooltip>
				</div>
			),
		},
	];

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
			/>

			<Modal
				open={isModalOpen}
				title={editingId ? 'Editar Workspace' : 'Criar Workspace'}
				onOk={() => form.submit()}
				onCancel={closeModal}
				width={700}
			>
				<FormWorkspace form={form} onFinish={handleFormSubmit} isEditing={!!editingId} />
			</Modal>
		</DefaultLayout>
	);
};

export default Workspace;
