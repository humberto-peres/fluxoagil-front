import React, { useCallback, useEffect, useState } from 'react';
import { Table, Form, Modal, Tooltip, Popconfirm, Button, App, Grid } from 'antd';
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
	description?: string;
};

const { useBreakpoint } = Grid;

const Step: React.FC = () => {
	const { message } = App.useApp();
	const screens = useBreakpoint();
	const isCompact = !screens.lg;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form] = Form.useForm();
	const [data, setData] = useState<StepType[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [loadingStep, setLoadingStep] = useState(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);

	const fetchSteps = useCallback(async () => {
		setLoading(true);
		try {
			const response = await getSteps();
			setData(response);
		} catch (error: any) {
			message.error(error?.message || 'Erro ao carregar etapas. Tente novamente.');
		} finally {
			setLoading(false);
		}
	}, [message]);

	useEffect(() => {
		fetchSteps();
	}, [fetchSteps]);

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
		setSubmitting(true);
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
		} catch (error: any) {
			message.error(error?.message || 'Erro ao salvar etapa. Tente novamente.');
		} finally {
			setSubmitting(false);
		}
	};

	const handleEditRecord = async (record: StepType) => {
		setLoadingStep(true);
		try {
			const step = await getStepById(record.id);
			form.setFieldsValue(step);
			setEditingId(record.id);
			setIsModalOpen(true);
		} catch (error: any) {
			message.error(error?.message || 'Não foi possível carregar a etapa para edição.');
		} finally {
			setLoadingStep(false);
		}
	};

	const handleDeleteRecord = async (id: number) => {
		setDeletingId(id);
		try {
			await deleteSteps([id]);
			message.success('Etapa excluída com sucesso!');
			fetchSteps();
		} catch (error: any) {
			message.error(error?.message || 'Erro ao excluir etapa. Tente novamente.');
		} finally {
			setDeletingId(null);
		}
	};

	const columns: TableColumnsType<StepType> = [
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
			align: 'center',
			render: (_: unknown, record: StepType) => {
				const isDeleting = deletingId === record.id;
				const isDisabled = deletingId !== null || loadingStep;

				return (
					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
						<Tooltip title="Editar">
							<Button
								type="text"
								aria-label={`Editar ${record.name}`}
								onClick={() => handleEditRecord(record)}
								icon={<FiEdit2 size={18} />}
								loading={loadingStep}
								disabled={isDisabled && !loadingStep}
							/>
						</Tooltip>

						<Tooltip title="Excluir">
							<Popconfirm
								title="Excluir etapa?"
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
			title="Etapas"
			addButton
			textButton="Criar Etapa"
			onAddClick={openModal}
		>
			<Table
				columns={columns}
				dataSource={data}
				rowKey="id"
				loading={loading}
				size="middle"
				pagination={{
					pageSize: 10,
					responsive: true,
					showTotal: (total) => `Total: ${total} ${total === 1 ? 'etapa' : 'etapas'}`
				}}
				scroll={isCompact ? { x: 'max-content' } : undefined}
				tableLayout="auto"
				locale={{ emptyText: 'Nenhuma etapa cadastrada' }}
			/>

			<Modal
				open={isModalOpen}
				title={editingId ? 'Editar Etapa' : 'Criar Etapa'}
				onCancel={closeModal}
				onOk={() => form.submit()}
				okText={submitting ? 'Salvando...' : 'Salvar'}
				cancelText="Cancelar"
				confirmLoading={submitting}
				destroyOnHidden
				rootClassName="responsive-modal"
				width={560}
				maskClosable={!submitting}
				keyboard={!submitting}
			>
				<FormStep form={form} onFinish={handleSubmit} loading={submitting} />
			</Modal>
		</DefaultLayout>
	);
};

export default Step;