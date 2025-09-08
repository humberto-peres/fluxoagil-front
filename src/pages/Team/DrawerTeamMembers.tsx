import React, { useEffect, useState } from 'react';
import { Drawer, List, Button, Select, App } from 'antd';
import {
	getTeamMembers,
	addTeamMembers,
	removeTeamMember,
	getAvailableUsers
} from '@/services/team.services';

const { Option } = Select;

type Props = {
	teamId: number | null;
	isOpen: boolean;
	onClose: () => void;
	onMembersChange?: () => void;
};

type User = {
	id: number;
	name: string;
};

const DrawerTeamMembers: React.FC<Props> = ({ teamId, isOpen, onClose, onMembersChange }) => {
	const { message } = App.useApp();
	const [availableUsers, setAvailableUsers] = useState<User[]>([]);
	const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
	const [members, setMembers] = useState<User[]>([]);

	const fetchAvailableUsers = async () => {
		if (!teamId) return;
		try {
			const data = await getAvailableUsers(teamId);
			console.log("data", data)
			setAvailableUsers(data);
		} catch {
			message.error('Erro ao buscar usuários disponíveis');
		}
	};

	const fetchMembers = async () => {
		if (!teamId) return;
		try {
			const data = await getTeamMembers(teamId);
			const memberUsers = data.map((m: any) => m.user);
			setMembers(memberUsers);
		} catch {
			message.error('Erro ao buscar membros');
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
		fetchAvailableUsers();
		fetchMembers();
	}, [teamId]);

	return (
		<Drawer
			title="Gerenciar Membros"
			width={480}
			onClose={onClose}
			open={isOpen}
		>
			<Select
				mode="multiple"
				style={{ width: '100%', marginBottom: 12 }}
				placeholder="Adicionar membros"
				value={selectedUserIds}
				onChange={setSelectedUserIds}
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
			>
				Adicionar
			</Button>

			<List
				header="Membros da equipe"
				dataSource={members}
				renderItem={(member) => (
					<List.Item
						actions={[
							<Button danger onClick={() => handleRemove(member.id)}>
								Remover
							</Button>
						]}
					>
						{member.name}
					</List.Item>
				)}
			/>
		</Drawer>
	);
};

export default DrawerTeamMembers;
