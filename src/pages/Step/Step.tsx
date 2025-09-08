import React, { useEffect, useState } from 'react';
import { Table, Form, message, Modal, Tooltip, Popconfirm, Button } from 'antd';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import FormStep from './FormStep';
import {
	getSteps,
	getStepById,
	createStep,
	updateStep,
	deleteSteps,
} from '@/services/step.services';
import type { TableColumnsType } from 'antd';

type StepType = {
	id: number;
	name: string;
	description: string;
};

const Step: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form] = Form.useForm();
	const [data, setData] = useState<StepType[]>([]);

	const fetchSteps = async () => {
		const response = await getSteps();
		setData(response);
	};

	useEffect(() => {
		fetchSteps();
	}, []);

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

	const handleSubmit = async (values: any) => {
		try {
			if (editingId) {
				await updateStep(editingId, values);
				message.success('Etapa atualizada com sucesso!');
			} else {
				await createStep(values);
				message.success('Etapa criada com sucesso!');
			}
			fetchSteps();
			closeModal();
		} catch {
			message.error('Erro ao salvar etapa');
		}
	};

	const handleEditRecord = async (record: StepType) => {
		try {
			const step = await getStepById(record.id);
			form.setFieldsValue(step);
			setEditingId(record.id);
			setIsModalOpen(true);
		} catch {
			message.error('Não foi possível carregar a etapa para edição.');
		}
	};

	const handleDeleteRecord = async (id: number) => {
		try {
			await deleteSteps([id]);
			message.success('Etapa excluída com sucesso!');
			fetchSteps();
		} catch {
			message.error('Erro ao excluir etapa');
		}
	};

	const columns: TableColumnsType<StepType> = [
		{ title: 'Nome', dataIndex: 'name', ellipsis: true },
		{
			title: 'Ações',
			key: 'actions',
			width: 110,
			align: 'center',
			render: (_: unknown, record: StepType) => (
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
							title="Excluir etapa?"
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
			title="Etapas"
			addButton
			textButton="Criar Etapa"
			onAddClick={openModal}
		>
			<Table columns={columns} dataSource={data} rowKey="id" />

			<Modal
				open={isModalOpen}
				title={editingId ? 'Editar Etapa' : 'Criar Etapa'}
				onCancel={closeModal}
				onOk={() => form.submit()}
			>
				<FormStep form={form} onFinish={handleSubmit} />
			</Modal>
		</DefaultLayout>
	);
};

export default Step;
