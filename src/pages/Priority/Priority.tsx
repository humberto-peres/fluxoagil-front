import React, { useEffect, useState } from 'react';
import { Table, Tag, Form, Modal, Tooltip, Popconfirm, Button, App } from 'antd';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import FormPriority from './FormPriority';
import { getPriorities, createPriority, updatePriority, deletePriorities } from '@/services/priority.services';
import type { TableColumnsType } from 'antd';

type PriorityType = {
	id: number;
	name: string;
	label: string;
};

const Priority: React.FC = () => {
	const { message } = App.useApp();
	const [priorities, setPriorities] = useState<PriorityType[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [editingId, setEditingId] = useState<number | null>(null);

	const fetchPriorities = async () => {
		try {
			const data = await getPriorities();
			setPriorities(data);
		} catch {
			message.error('Erro ao buscar prioridades');
		}
	};

	useEffect(() => {
		fetchPriorities();
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
				label: typeof values.label === 'string' ? values.label : values.label.toHexString(),
			};

			if (editingId) {
				await updatePriority(editingId, payload);
				message.success('Prioridade atualizada com sucesso!');
			} else {
				await createPriority(payload);
				message.success('Prioridade criada com sucesso!');
			}

			closeModal();
			fetchPriorities();
		} catch (error) {
			message.error('Erro ao salvar prioridade');
		}
	};

	const handleEditRecord = (record: PriorityType) => {
		form.setFieldsValue({ name: record.name, label: record.label });
		setEditingId(record.id);
		setIsModalOpen(true);
	};

	const handleDeleteRecord = async (id: number) => {
		try {
			await deletePriorities([id]);
			message.success('Prioridade excluída com sucesso!');
			fetchPriorities();
		} catch {
			message.error('Erro ao excluir prioridades');
		}
	};

	const columns: TableColumnsType<PriorityType> = [
		{
			title: 'Cor',
			dataIndex: 'label',
			width: '20%',
			render: (color: string) => <Tag color={color}>{color}</Tag>,
		},
		{ title: 'Nome', dataIndex: 'name', ellipsis: true },
		{
			title: 'Ações',
			key: 'actions',
			width: 110,
			align: 'center',
			render: (_: unknown, record: PriorityType) => (
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
							title="Excluir prioridade?"
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
			title="Prioridade"
			addButton
			textButton="Criar Prioridade"
			onAddClick={openModal}
		>
			<Table columns={columns} dataSource={priorities} rowKey="id" />

			<Modal
				open={isModalOpen}
				title={editingId ? 'Editar Prioridade' : 'Criar Prioridade'}
				onOk={() => form.submit()}
				okText="Salvar"
				cancelText="Cancelar"
				onCancel={closeModal}
			>
				<FormPriority form={form} onFinish={handleFormSubmit} />
			</Modal>
		</DefaultLayout>
	);
};

export default Priority;
