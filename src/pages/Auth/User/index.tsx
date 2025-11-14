import React, { useCallback, useEffect, useState } from "react";
import { Table, Form, Popover, Modal, App, Grid, Button, Tooltip, Popconfirm } from "antd";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import FormUser from "./FormUser";
import type { TableColumnsType } from "antd";
import { getUsers, createUser, updateUser, deleteUsers } from "@/services/user.services";

type AddressType = {
	street: string;
	number: number;
	neighborhood: string;
	city: string;
	state: string;
	zipCode: string;
};

type UserType = {
	id: number;
	name: string;
	username: string;
	email: string;
	teamId?: number;
	address?: AddressType;
};

const { useBreakpoint } = Grid;

const User: React.FC = () => {
	const { message } = App.useApp();
	const screens = useBreakpoint();
	const isCompact = !screens.lg;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [addressFieldsDisabled, setAddressFieldsDisabled] = useState(true);
	const [form] = Form.useForm();
	const [data, setData] = useState<UserType[]>([]);
	const [editingUserId, setEditingUserId] = useState<number | null>(null);

	const fetchUsers = useCallback(async () => {
		try {
			const users = await getUsers();
			setData(users);
		} catch {
			message.error("Erro ao carregar usuários");
		}
	}, [message]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const openModal = () => setIsModalOpen(true);

	const closeModal = () => {
		setIsModalOpen(false);
		setAddressFieldsDisabled(true);
		form.resetFields();
		setEditingUserId(null);
	};

	const handleFormSubmit = async (values: any) => {
		const payload: any = {
			name: values.name,
			username: values.username,
			email: values.email,
			...(values.password && { password: values.password }),
			address: {
				zipCode: values.cep,
				street: values.street,
				city: values.city,
				state: values.state,
				neighborhood: values.neighborhood,
				number: Number(values.number),

			},
		};

		try {
			if (editingUserId) {
				await updateUser(editingUserId, payload);
				message.success("Usuário atualizado com sucesso!");
			} else {
				await createUser(payload);
				message.success("Usuário criado com sucesso!");
			}

			closeModal();
			fetchUsers();
		} catch (error: any) {
			message.error(error.message || "Erro ao salvar o usuário");
		}
	};

	const handleEditRecord = (record: UserType) => {
		form.setFieldsValue({
			name: record.name,
			username: record.username,
			email: record.email,
			teamId: record.teamId,
			cep: record.address?.zipCode,
			state: record.address?.state,
			city: record.address?.city,
			street: record.address?.street,
			neighborhood: record.address?.neighborhood,
			number: record.address?.number,
		});

		setEditingUserId(record.id);
		setAddressFieldsDisabled(false);
		setIsModalOpen(true);
	};

	const handleDeleteRecord = async (id: number) => {
		try {
			await deleteUsers([id]);
			message.success('Usuário excluído com sucesso!');
			fetchUsers();
		} catch (error: any) {
			message.error(error.message || 'Erro ao excluir usuário');
		}
	};

	const columns: TableColumnsType<UserType> = [
		{ title: "Nome", dataIndex: "name", ellipsis: true },
		{ title: "Username", dataIndex: "username", responsive: ['sm'], ellipsis: true },
		{ title: "Email", dataIndex: "email", ellipsis: true },
		{
			title: "Endereço",
			dataIndex: "address",
			responsive: ['md'],
			render: (_, record) => {
				if (!record.address) return "-";
				const resume = `${record.address.street}, ${record.address.number} – ${record.address.neighborhood}`;
				const details = (
					<div className="space-y-1">
						<div><strong>Rua:</strong> {record.address.street}</div>
						<div><strong>Número:</strong> {record.address.number}</div>
						<div><strong>Bairro:</strong> {record.address.neighborhood}</div>
						<div><strong>Cidade:</strong> {record.address.city}</div>
						<div><strong>Estado:</strong> {record.address.state}</div>
						<div><strong>CEP:</strong> {record.address.zipCode}</div>
					</div>
				);
				return (
					<Popover content={details} title="Endereço completo" placement="top">
						<button type="button" className="cursor-pointer bg-transparent border-0 p-0 text-inherit underline">{resume}</button>
					</Popover>
				);
			},
		},
		{
			title: 'Ações',
			key: 'actions',
			width: 110,
			fixed: 'right',
			align: 'center',
			render: (_: unknown, record: UserType) => (
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
							title="Excluir usuário?"
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
			title="Usuários"
			addButton
			textButton="Criar Usuário"
			onAddClick={openModal}
		>
			<Table
				columns={columns}
				dataSource={data}
				rowKey="id"
				pagination={{ pageSize: 10, responsive: true, showSizeChanger: true }}
				scroll={isCompact ? { x: 'max-content' } : undefined}
			/>

			<Modal
				open={isModalOpen}
				title={editingUserId ? "Editar Usuário" : "Criar Usuário"}
				onOk={() => form.submit()}
				okText="Salvar"
				cancelText="Cancelar"
				onCancel={closeModal}
				destroyOnHidden
				rootClassName="responsive-modal"
				width={720}
			>
				<FormUser
					form={form}
					onFinish={handleFormSubmit}
					addressFieldsDisabled={addressFieldsDisabled}
					setAddressFieldsDisabled={setAddressFieldsDisabled}
					isEditing={!!editingUserId}
				/>
			</Modal>
		</DefaultLayout>
	);
};

export default User;