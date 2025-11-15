import React, { useCallback, useEffect, useState } from 'react';
import { Table, Tag, Form, Modal, Tooltip, Popconfirm, Button, App, Grid } from 'antd';
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

const { useBreakpoint } = Grid;

function getContrastText(hex: string) {
	const c = hex.replace('#', '');
	const r = Number.parseInt(c.substring(0, 2), 16);
	const g = Number.parseInt(c.substring(2, 4), 16);
	const b = Number.parseInt(c.substring(4, 6), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.6 ? '#000' : '#fff';
}

const Priority: React.FC = () => {
	const { message } = App.useApp();
	const screens = useBreakpoint();
	const isCompact = !screens.lg;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form] = Form.useForm();
	const [priorities, setPriorities] = useState<PriorityType[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);

	const fetchPriorities = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getPriorities();
			setPriorities(data);
		} catch (error: any) {
			message.error(error?.message || 'Erro ao carregar prioridades. Tente novamente.');
		} finally {
			setLoading(false);
		}
	}, [message]);

	useEffect(() => {
		fetchPriorities();
	}, [fetchPriorities]);

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
				label: typeof values.label === 'string' ? values.label : values.label.toHexString(),
			};

			if (editingId) {
				await updatePriority(editingId, payload);
				message.success('Prioridade atualizada com sucesso!');
			} else {
				await createPriority(payload);
				message.success('Prioridade criada com sucesso!');
			}
			fetchPriorities();
			closeModal();
		} catch (error: any) {
			message.error(error?.message || 'Erro ao salvar prioridade. Tente novamente.');
		} finally {
			setSubmitting(false);
		}
	};

	const handleEditRecord = (record: PriorityType) => {
		form.setFieldsValue({ name: record.name, label: record.label });
		setEditingId(record.id);
		setIsModalOpen(true);
	};

	const handleDeleteRecord = async (id: number) => {
		setDeletingId(id);
		try {
			await deletePriorities([id]);
			message.success('Prioridade excluída com sucesso!');
			fetchPriorities();
		} catch (error: any) {
			message.error(error?.message || 'Erro ao excluir prioridade. Tente novamente.');
		} finally {
			setDeletingId(null);
		}
	};

	const columns: TableColumnsType<PriorityType> = [
		{
			title: 'Cor',
			dataIndex: 'label',
			width: 160,
			render: (color: string) => (
				<Tag
					color={color}
					style={{ color: getContrastText(color), borderColor: color }}
				>
					{color}
				</Tag>
			),
		},
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
			render: (_: unknown, record: PriorityType) => {
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
								title="Excluir prioridade?"
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
			title="Prioridade"
			addButton
			textButton="Criar Prioridade"
			onAddClick={openModal}
		>
			<Table
				columns={columns}
				dataSource={priorities}
				rowKey="id"
				loading={loading}
				size="middle"
				pagination={{
					pageSize: 10,
					responsive: true,
					showTotal: (total) => `Total: ${total} ${total === 1 ? 'prioridade' : 'prioridades'}`
				}}
				scroll={isCompact ? { x: 'max-content' } : undefined}
				tableLayout="auto"
				locale={{ emptyText: 'Nenhuma prioridade cadastrada' }}
			/>

			<Modal
				open={isModalOpen}
				title={editingId ? 'Editar Prioridade' : 'Criar Prioridade'}
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
				<FormPriority form={form} onFinish={handleFormSubmit} loading={submitting} />
			</Modal>
		</DefaultLayout>
	);
};

export default Priority;
