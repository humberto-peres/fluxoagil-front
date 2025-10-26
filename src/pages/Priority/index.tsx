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
	const r = parseInt(c.substring(0, 2), 16);
	const g = parseInt(c.substring(2, 4), 16);
	const b = parseInt(c.substring(4, 6), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.6 ? '#000' : '#fff';
}

const Priority: React.FC = () => {
	const { message } = App.useApp();
	const screens = useBreakpoint();
	const isCompact = !screens.lg;

	const [priorities, setPriorities] = useState<PriorityType[]>([]);
	const [loading, setLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form] = Form.useForm();

	const fetchPriorities = useCallback(async () => {
		try {
			setLoading(true);
			const data = await getPriorities();
			setPriorities(data);
		} catch {
			message.error('Erro ao buscar prioridades');
		} finally {
			setLoading(false);
		}
	}, [message]);

	useEffect(() => {
		fetchPriorities();
	}, [fetchPriorities]);

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
		} catch {
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
				pagination={{ pageSize: 10, responsive: true, showSizeChanger: true }}
				scroll={isCompact ? { x: 'max-content' } : undefined}
				tableLayout="auto"
			/>

			<Modal
				open={isModalOpen}
				title={editingId ? 'Editar Prioridade' : 'Criar Prioridade'}
				onOk={() => form.submit()}
				okText="Salvar"
				cancelText="Cancelar"
				onCancel={closeModal}
				destroyOnHidden
				rootClassName="responsive-modal"
				width={560}
			>
				<FormPriority form={form} onFinish={handleFormSubmit} />
			</Modal>
		</DefaultLayout>
	);
};

export default Priority;
