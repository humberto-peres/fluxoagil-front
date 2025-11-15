import React, { useCallback, useEffect, useState } from 'react';
import { Table, Form, Button, Tooltip, Popover, Modal, Popconfirm, App, Grid, Typography } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import FormTeam from './FormTeam';
import DrawerTeamMembers from './DrawerTeamMembers';
import {
	getTeams,
	getTeamById,
	createTeam,
	updateTeam,
	deleteTeams
} from '@/services/team.services';
import type { TableColumnsType } from 'antd';

type User = { id: number; name: string };
type TeamType = { id: number; name: string; members: { user: User }[] };

const { Text } = Typography;
const { useBreakpoint } = Grid;

const Team: React.FC = () => {
	const screens = useBreakpoint();
	const isCompact = !screens.lg;
	const { message } = App.useApp();

	const [teams, setTeams] = useState<TeamType[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [loadingTeam, setLoadingTeam] = useState(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
	const [currentTeamId, setCurrentTeamId] = useState<number | null>(null);

	const [form] = Form.useForm();

	const loadTeams = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getTeams();
			setTeams(data);
		} catch (error: any) {
			message.error(error?.message || 'Erro ao carregar equipes. Tente novamente.');
		} finally {
			setLoading(false);
		}
	}, [message]);

	useEffect(() => { loadTeams(); }, [loadTeams]);

	const openModal = () => {
		form.resetFields();
		setEditingTeamId(null);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setEditingTeamId(null);
		form.resetFields();
	};

	const handleFormSubmit = async (values: any) => {
		setSubmitting(true);
		try {
			if (editingTeamId) {
				await updateTeam(editingTeamId, values);
				message.success('Equipe atualizada com sucesso!');
			} else {
				await createTeam(values);
				message.success('Equipe criada com sucesso!');
			}
			closeModal();
			loadTeams();
		} catch (error: any) {
			message.error(error?.message || 'Erro ao salvar equipe. Tente novamente.');
		} finally {
			setSubmitting(false);
		}
	};

	const openDrawer = (teamId: number) => {
		setCurrentTeamId(teamId);
		setIsDrawerOpen(true);
	};

	const handleUpdateMembers = () => { loadTeams(); };

	const handleEditRecord = async (id: number) => {
		setLoadingTeam(true);
		try {
			const team = await getTeamById(id);
			form.setFieldsValue({ name: team.name });
			setEditingTeamId(id);
			setIsModalOpen(true);
		} catch (error: any) {
			message.error(error?.message || 'Erro ao carregar dados da equipe');
		} finally {
			setLoadingTeam(false);
		}
	};

	const handleDeleteRecord = async (id: number) => {
		setDeletingId(id);
		try {
			await deleteTeams([id]);
			message.success('Equipe excluída com sucesso!');
			loadTeams();
		} catch (error: any) {
			message.error(error?.message || 'Erro ao excluir equipe. Tente novamente.');
		} finally {
			setDeletingId(null);
		}
	};

	const columns: TableColumnsType<TeamType> = [
		{
			title: 'Nome',
			dataIndex: 'name',
			ellipsis: true,
			render: (name, record) => (
				<span>
					{name}
					{!screens.md && record.members?.length > 0 && (
						<Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
							({record.members.length} {record.members.length === 1 ? 'membro' : 'membros'})
						</Text>
					)}
				</span>
			),
		},
		{
			title: 'Membros',
			dataIndex: 'members',
			responsive: ['md'],
			render: (members: { user: User }[]) => {
				if (!members?.length) return <Text type="secondary">Sem membros</Text>;
				const names = members.map((m) => m.user.name);
				const content = (
					<div style={{ maxWidth: 260 }}>
						{names.map((n) => (<div key={n}>{n}</div>))}
					</div>
				);
				return (
					<Popover content={content} title={`Membros (${names.length})`} trigger="hover" placement="top">
						<button type="button" className="bg-transparent border-0 p-0 text-inherit underline cursor-pointer">
							{names.length === 1 ? names[0] : `${names[0]} e mais ${names.length - 1}`}
						</button>
					</Popover>
				);
			}
		},
		{
			title: 'Ações',
			key: 'actions',
			width: 160,
			align: 'right',
			render: (_, record) => {
				const isDeleting = deletingId === record.id;
				const isDisabled = deletingId !== null || loadingTeam;

				return (
					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
						<Tooltip title="Gerenciar membros">
							<Button
								type="primary"
								icon={<TeamOutlined />}
								onClick={() => openDrawer(record.id)}
								disabled={isDisabled}
							/>
						</Tooltip>

						<Tooltip title="Editar">
							<Button
								type="text"
								aria-label={`Editar ${record.name}`}
								onClick={() => handleEditRecord(record.id)}
								icon={<FiEdit2 size={18} />}
								loading={loadingTeam}
								disabled={isDisabled && !loadingTeam}
							/>
						</Tooltip>

						<Tooltip title="Excluir">
							<Popconfirm
								title="Excluir equipe?"
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
			}
		}
	];

	return (
		<DefaultLayout
			title="Equipes"
			addButton
			textButton="Criar Equipe"
			onAddClick={openModal}
		>
			<Table
				columns={columns}
				dataSource={teams}
				rowKey="id"
				loading={loading}
				size="middle"
				pagination={{
					pageSize: 10,
					responsive: true,
					showTotal: (total) => `Total: ${total} ${total === 1 ? 'equipe' : 'equipes'}`
				}}
				scroll={isCompact ? { x: 'max-content' } : undefined}
				tableLayout="auto"
				locale={{ emptyText: 'Nenhuma equipe cadastrada' }}
			/>

			<Modal
				open={isModalOpen}
				title={editingTeamId ? 'Editar Equipe' : 'Criar Equipe'}
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
				<FormTeam form={form} onFinish={handleFormSubmit} loading={submitting} />
			</Modal>

			<DrawerTeamMembers
				teamId={currentTeamId}
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				onMembersChange={handleUpdateMembers}
			/>
		</DefaultLayout>
	);
};

export default Team;