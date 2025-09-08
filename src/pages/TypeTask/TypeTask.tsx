import React, { useEffect, useState } from 'react';
import { Table, Form, Modal, Tooltip, Popconfirm, Button, App } from 'antd';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import FormTaskType from './FormTaskType';
import {
	getTaskTypes,
	createTaskType,
	updateTaskType,
	deleteTaskTypes
} from '@/services/taskType.services';
import type { TableColumnsType } from 'antd';

type TaskTypeData = {
	id: number;
	name: string;
};

const TaskType: React.FC = () => {
	const { message } = App.useApp();
	const [taskTypes, setTaskTypes] = useState<TaskTypeData[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form] = Form.useForm();

	const fetchTaskTypes = async () => {
		try {
			const data = await getTaskTypes();
			setTaskTypes(data);
		} catch {
			message.error('Erro ao carregar tipos de atividade');
		}
	};

	useEffect(() => {
		fetchTaskTypes();
	}, []);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		form.resetFields();
		setEditingId(null);
		setIsModalOpen(false);
	};

	const handleFormSubmit = async (values: any) => {
		try {
			if (editingId) {
				await updateTaskType(editingId, values);
				message.success('Tipo de atividade atualizado com sucesso!');
			} else {
				await createTaskType(values);
				message.success('Tipo de atividade criado com sucesso!');
			}
			closeModal();
			fetchTaskTypes();
		} catch {
			message.error('Erro ao salvar tipo de atividade');
		}
	};

	const handleEditRecord = (record: TaskTypeData) => {
		form.setFieldsValue(record);
		setEditingId(record.id);
		setIsModalOpen(true);
	};

	const handleDeleteRecord = async (id: number) => {
		try {
			await deleteTaskTypes([id]);
			message.success('Tipo de atividade excluído com sucesso!');
			fetchTaskTypes();
		} catch {
			message.error('Erro ao excluir tipo de atividade');
		}
	};

	const columns: TableColumnsType<TaskTypeData> = [
		{ title: 'Nome', dataIndex: 'name', ellipsis: true },
		{
			title: 'Ações',
			key: 'actions',
			width: 110,
			align: 'center',
			render: (_: unknown, record: TaskTypeData) => (
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
							title="Excluir tipo de atividade?"
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

	return (
		<DefaultLayout
			title="Tipo de Atividade"
			addButton
			textButton="Criar Tipo"
			onAddClick={openModal}
		>
			<Table columns={columns} dataSource={taskTypes} rowKey="id" />

			<Modal
				open={isModalOpen}
				title={editingId ? 'Editar Tipo de Atividade' : 'Criar Tipo de Atividade'}
				onOk={() => form.submit()}
				okText="Salvar"
				cancelText="Cancelar"
				onCancel={closeModal}
			>
				<FormTaskType form={form} onFinish={handleFormSubmit} />
			</Modal>
		</DefaultLayout>
	);
};

export default TaskType;
