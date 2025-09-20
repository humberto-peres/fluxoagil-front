import React, { useEffect, useState } from 'react';
import { Drawer, List, Button, Select, App, Grid, Space, Typography } from 'antd';
import {
	getTeamMembers,
	addTeamMembers,
	removeTeamMember,
	getAvailableUsers
} from '@/services/team.services';

const { Option } = Select;
const { useBreakpoint } = Grid;
const { Text } = Typography;

type Props = {
	teamId: number | null;
	isOpen: boolean;
	onClose: () => void;
	onMembersChange?: () => void;
};

type User = { id: number; name: string };

const DrawerTeamMembers: React.FC<Props> = ({ teamId, isOpen, onClose, onMembersChange }) => {
	const screens = useBreakpoint();
	const isMobile = !screens.md;
	const { message } = App.useApp();

	const [availableUsers, setAvailableUsers] = useState<User[]>([]);
	const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
	const [members, setMembers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchAvailableUsers = async () => {
		if (!teamId) return;
		try {
			const data = await getAvailableUsers(teamId);
			setAvailableUsers(data);
		} catch {
			message.error('Erro ao buscar usuários disponíveis');
		}
	};

	const fetchMembers = async () => {
		if (!teamId) return;
		try {
			setLoading(true);
			const data = await getTeamMembers(teamId);
			const memberUsers = data.map((m: any) => m.user);
			setMembers(memberUsers);
		} catch {
			message.error('Erro ao buscar membros');
		} finally {
			setLoading(false);
		}
	};

	const handleAddMembers = async () => {
		if (!teamId || selectedUserIds.length === 0) return;
		try {
			await addTeamMembers(teamId, selectedUserIds);
			message.success('Membros adicionados!');
			setSelectedUserIds([]);
			await fetchAvailableUsers();
			await fetchMembers();
			onMembersChange?.();
		} catch {
			message.error('Erro ao adicionar membros');
		}
	};

	const handleRemove = async (userId: number) => {
		if (!teamId) return;
		try {
			await removeTeamMember(teamId, userId);
			message.success('Membro removido');
			await fetchAvailableUsers();
			await fetchMembers();
			onMembersChange?.();
		} catch {
			message.error('Erro ao remover membro');
		}
	};

	useEffect(() => {
		if (!isOpen) return;
		fetchAvailableUsers();
		fetchMembers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [teamId, isOpen]);

	return (
		<Drawer
			title="Gerenciar Membros"
			placement={isMobile ? 'bottom' : 'right'}
			height={isMobile ? '85vh' : undefined}
			width={isMobile ? '100%' : 480}
			onClose={onClose}
			open={isOpen}
			destroyOnHidden
			maskClosable
			styles={{
				body: { padding: 16 },
				header: { padding: 16 },
			}}
		>
			<Space direction="vertical" size="middle" style={{ width: '100%' }}>
				<div>
					<Text strong>Adicionar membros</Text>
					<Select
						mode="multiple"
						style={{ width: '100%', marginTop: 8 }}
						placeholder="Selecione usuários"
						value={selectedUserIds}
						onChange={setSelectedUserIds}
						showSearch
						optionFilterProp="children"
						maxTagCount="responsive"
					>
						{availableUsers.map((user) => (
							<Option key={user.id} value={user.id}>
								{user.name}
							</Option>
						))}
					</Select>

					<Button
						type="primary"
						onClick={handleAddMembers}
						disabled={selectedUserIds.length === 0}
						block
						style={{ marginTop: 8 }}
					>
						Adicionar
					</Button>
				</div>

				<div>
					<Text strong>Membros da equipe</Text>
					<List
						loading={loading}
						style={{ marginTop: 8 }}
						dataSource={members}
						locale={{ emptyText: 'Sem membros nesta equipe' }}
						renderItem={(member) => (
							<List.Item
								actions={[
									<Button key="remove" danger onClick={() => handleRemove(member.id)}>
										Remover
									</Button>,
								]}
							>
								{member.name}
							</List.Item>
						)}
					/>
				</div>
			</Space>
		</Drawer>
	);
};

export default DrawerTeamMembers;
