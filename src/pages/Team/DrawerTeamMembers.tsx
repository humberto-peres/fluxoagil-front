import React, { useEffect, useState } from 'react';
import { Drawer, List, Button, Select, App, Grid, Space, Typography, Spin } from 'antd';
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
	const [loadingUsers, setLoadingUsers] = useState(false);
	const [addingMembers, setAddingMembers] = useState(false);
	const [removingMemberId, setRemovingMemberId] = useState<number | null>(null);

	const fetchAvailableUsers = async () => {
		if (!teamId) return;
		setLoadingUsers(true);
		try {
			const data = await getAvailableUsers(teamId);
			setAvailableUsers(data);
		} catch (error: any) {
			message.error(error?.message || 'Erro ao buscar usuários disponíveis');
		} finally {
			setLoadingUsers(false);
		}
	};

	const fetchMembers = async () => {
		if (!teamId) return;
		setLoading(true);
		try {
			const data = await getTeamMembers(teamId);
			const memberUsers = data.map((m: any) => m.user);
			setMembers(memberUsers);
		} catch (error: any) {
			message.error(error?.message || 'Erro ao buscar membros da equipe');
		} finally {
			setLoading(false);
		}
	};

	const handleAddMembers = async () => {
		if (!teamId || selectedUserIds.length === 0) return;

		setAddingMembers(true);
		try {
			await addTeamMembers(teamId, selectedUserIds);
			const count = selectedUserIds.length;
			message.success(`${count} ${count === 1 ? 'membro adicionado' : 'membros adicionados'} com sucesso!`);
			setSelectedUserIds([]);
			await fetchAvailableUsers();
			await fetchMembers();
			onMembersChange?.();
		} catch (error: any) {
			message.error(error?.message || 'Erro ao adicionar membros. Tente novamente.');
		} finally {
			setAddingMembers(false);
		}
	};

	const handleRemove = async (userId: number) => {
		if (!teamId) return;

		setRemovingMemberId(userId);
		try {
			await removeTeamMember(teamId, userId);
			message.success('Membro removido com sucesso!');
			await fetchAvailableUsers();
			await fetchMembers();
			onMembersChange?.();
		} catch (error: any) {
			message.error(error?.message || 'Erro ao remover membro. Tente novamente.');
		} finally {
			setRemovingMemberId(null);
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
			<Spin spinning={loading && members.length === 0} tip="Carregando membros...">
				<Space direction="vertical" size="middle" style={{ width: '100%' }}>
					<div>
						<Text strong>Adicionar membros</Text>
						<Select
							mode="multiple"
							style={{ width: '100%', marginTop: 8 }}
							placeholder="Selecione usuários para adicionar"
							value={selectedUserIds}
							onChange={setSelectedUserIds}
							showSearch
							optionFilterProp="children"
							maxTagCount="responsive"
							loading={loadingUsers}
							disabled={addingMembers}
							notFoundContent={loadingUsers ? <Spin size="small" /> : 'Nenhum usuário disponível'}
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
							loading={addingMembers}
							block
							style={{ marginTop: 8 }}
						>
							{addingMembers ? 'Adicionando...' : `Adicionar ${selectedUserIds.length > 0 ? `(${selectedUserIds.length})` : ''}`}
						</Button>
					</div>

					<div>
						<Text strong>Membros da equipe {members.length > 0 && `(${members.length})`}</Text>
						<List
							loading={loading}
							style={{ marginTop: 8 }}
							dataSource={members}
							locale={{ emptyText: 'Nenhum membro nesta equipe' }}
							renderItem={(member) => (
								<List.Item
									actions={[
										<Button
											key="remove"
											danger
											onClick={() => handleRemove(member.id)}
											loading={removingMemberId === member.id}
											disabled={removingMemberId !== null && removingMemberId !== member.id}
										>
											{removingMemberId === member.id ? 'Removendo...' : 'Remover'}
										</Button>,
									]}
								>
									{member.name}
								</List.Item>
							)}
						/>
					</div>
				</Space>
			</Spin>
		</Drawer>
	);
};

export default DrawerTeamMembers;