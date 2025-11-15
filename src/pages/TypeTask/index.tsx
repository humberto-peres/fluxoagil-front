import React, { useCallback, useEffect, useState } from 'react';
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
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form] = Form.useForm();

	const fetchTaskTypes = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getTaskTypes();
			setTaskTypes(data);
		} catch (error: any) {
			message.error(error?.message || 'Erro ao carregar tipos de atividade. Tente novamente.');
		} finally {
			setLoading(false);
		}
	}, [message]);

	useEffect(() => {
		fetchTaskTypes();
	}, [fetchTaskTypes]);

	const openModal = () => {
		form.resetFields();
		setEditingId(null);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		form.resetFields();
		setEditingId(null);
		setIsModalOpen(false);
	};

	const handleFormSubmit = async (values: any) => {
		setSubmitting(true);
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
		} catch (error: any) {
			message.error(error?.message || 'Erro ao salvar tipo de atividade. Tente novamente.');
		} finally {
			setSubmitting(false);
		}
	};

	const handleEditRecord = (record: TaskTypeData) => {
		form.setFieldsValue(record);
		setEditingId(record.id);
		setIsModalOpen(true);
	};

	const handleDeleteRecord = async (id: number) => {
		setDeletingId(id);
		try {
			await deleteTaskTypes([id]);
			message.success('Tipo de atividade excluído com sucesso!');
			fetchTaskTypes();
		} catch (error: any) {
			message.error(error?.message || 'Erro ao excluir tipo de atividade. Tente novamente.');
		} finally {
			setDeletingId(null);
		}
	};

	const columns: TableColumnsType<TaskTypeData> = [
		{
			title: 'Nome',
			dataIndex: 'name',
			ellipsis: true,
			sorter: (a, b) => a.name.localeCompare(b.name),
		},
		{
			title: 'Ações',
			key: 'actions',
			width: 110,
			fixed: 'right',
			align: 'center',
			render: (_: unknown, record: TaskTypeData) => {
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
								title="Excluir tipo de atividade?"
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

	return (
		<DefaultLayout
			title="Tipo de Atividade"
			addButton
			textButton="Criar Tipo"
			onAddClick={openModal}
		>
			<Table
				columns={columns}
				dataSource={taskTypes}
				rowKey="id"
				loading={loading}
				size="middle"
				pagination={{
					pageSize: 10,
					responsive: true,
					showTotal: (total) => `Total: ${total} ${total === 1 ? 'tipo' : 'tipos'}`
				}}
				scroll={{ x: 640 }}
				tableLayout="auto"
				locale={{ emptyText: 'Nenhum tipo de atividade cadastrado' }}
			/>

			<Modal
				open={isModalOpen}
				title={editingId ? 'Editar Tipo de Atividade' : 'Criar Tipo de Atividade'}
				onOk={() => form.submit()}
				okText={submitting ? 'Salvando...' : 'Salvar'}
				cancelText="Cancelar"
				onCancel={closeModal}
				confirmLoading={submitting}
				destroyOnHidden
				rootClassName="responsive-modal"
				width={560}
				maskClosable={!submitting}
				keyboard={!submitting}
			>
				<FormTaskType form={form} onFinish={handleFormSubmit} loading={submitting} />
			</Modal>
		</DefaultLayout>
	);
};

export default TaskType;
