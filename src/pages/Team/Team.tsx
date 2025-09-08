import React, { useEffect, useState } from 'react';
import { Table, Form, message, Button, Tooltip, Popover, Modal, Popconfirm } from 'antd';
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

type User = { id: number; name: string; };
type TeamType = { id: number; name: string; members: { user: User }[]; };

const Team: React.FC = () => {
	const [teams, setTeams] = useState<TeamType[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
	const [form] = Form.useForm();
	const [currentTeamId, setCurrentTeamId] = useState<number | null>(null);
	const [messageApi, contextHolder] = message.useMessage();

	const messageAction = (type: 'success' | 'error', msg: string) => {
		messageApi.open({ type, content: msg });
	};

	const loadTeams = async () => {
		try {
			const data = await getTeams();
			setTeams(data);
		} catch {
			message.error('Erro ao carregar equipes');
		}
	};

	useEffect(() => { loadTeams(); }, []);

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
		try {
			if (editingTeamId) {
				await updateTeam(editingTeamId, values);
				messageAction('success', 'Equipe atualizada com sucesso!');
			} else {
				await createTeam(values);
				messageAction('success', 'Equipe criada com sucesso!');
			}
			closeModal();
			loadTeams();
		} catch {
			messageAction('error', 'Erro ao salvar equipe');
		}
	};

	const openDrawer = (teamId: number) => {
		setCurrentTeamId(teamId);
		setIsDrawerOpen(true);
	};

	const handleUpdateMembers = () => { loadTeams(); };

	const handleEditRecord = async (id: number) => {
		try {
			const team = await getTeamById(id);
			form.setFieldsValue({ name: team.name });
			setEditingTeamId(id);
			setIsModalOpen(true);
		} catch {
			messageAction('error', 'Erro ao carregar equipe');
		}
	};

	const handleDeleteRecord = async (id: number) => {
		try {
			await deleteTeams([id]);
			messageAction('success', 'Equipe excluída com sucesso!');
			loadTeams();
		} catch {
			messageAction('error', 'Erro ao excluir equipe');
		}
	};

	const columns: TableColumnsType<TeamType> = [
		{ title: 'Nome', dataIndex: 'name', width: '40%' },
		{
			title: 'Membros',
			dataIndex: 'members',
			render: (members) => {
				if (!members.length) return '-';
				const names = members.map((m: any) => m.user.name);
				const content = (
					<div style={{ maxWidth: 200 }}>
						{names.map((n: string, i: number) => (<div key={i}>{n}</div>))}
					</div>
				);
				return (
					<Popover content={content} title="Membros" placement="top">
						<a>{names.length === 1 ? names[0] : `${names[0]} e mais ${names.length - 1}`}</a>
					</Popover>
				);
			}
		},
		{
			title: 'Ações',
			dataIndex: 'actions',
			width: 110,
			align: 'center',
			render: (_, record) => (
				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
					<Tooltip title="Gerenciar membros">
						<Button type="primary" icon={<TeamOutlined />} onClick={() => openDrawer(record.id)} />
					</Tooltip>

					<Tooltip title="Editar">
						<Button
							type="text"
							aria-label={`Editar ${record.name}`}
							onClick={() => handleEditRecord(record.id)}
							icon={<FiEdit2 size={18} />}
						/>
					</Tooltip>

					<Tooltip title="Excluir">
						<Popconfirm
							title="Excluir equipe?"
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
			)
		}
	];

	return (
		<DefaultLayout
			title="Equipes"
			addButton
			textButton="Criar Equipe"
			onAddClick={openModal}
		>
			{contextHolder}
			<Table columns={columns} dataSource={teams} rowKey="id" />

			<Modal
				open={isModalOpen}
				title={editingTeamId ? 'Editar Equipe' : 'Criar Equipe'}
				onOk={() => form.submit()}
				onCancel={closeModal}
			>
				<FormTeam form={form} onFinish={handleFormSubmit} />
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
