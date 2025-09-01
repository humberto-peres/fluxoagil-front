import React, { useEffect, useState } from "react";
import { Table, Form, message, Popover, Modal } from "antd";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import FormUser from "./FormUser";
import { deleteUsers } from "@/services/user.services";
import type { NoticeType } from "antd/es/message/interface";
import type { TableColumnsType } from "antd";

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

const columns: TableColumnsType<UserType> = [
	{ title: "Nome", dataIndex: "name", width: "20%" },
	{ title: "Username", dataIndex: "username", width: "20%" },
	{ title: "Email", dataIndex: "email", width: "40%" },
	{
		title: "Endereço",
		dataIndex: "address",
		width: "20%",
		render: (_, record) => {
			if (!record.address) return "-";
			const resume = `${record.address.street}, ${record.address.number} – ${record.address.neighborhood}`;
			const details = (
				<div>
					<div>
						<strong>Rua:</strong> {record.address.street}
					</div>
					<div>
						<strong>Número:</strong> {record.address.number}
					</div>
					<div>
						<strong>Bairro:</strong> {record.address.neighborhood}
					</div>
					<div>
						<strong>Cidade:</strong> {record.address.city}
					</div>
					<div>
						<strong>Estado:</strong> {record.address.state}
					</div>
					<div>
						<strong>CEP:</strong> {record.address.zipCode}
					</div>
				</div>
			);
			return (
				<Popover content={details} title="Endereço completo" placement="top">
					<a style={{ cursor: "pointer" }}>{resume}</a>
				</Popover>
			);
		},
	},
];

const User: React.FC = () => {
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [addressFieldsDisabled, setAddressFieldsDisabled] = useState(true);
	const [form] = Form.useForm();
	const [data, setData] = useState<UserType[]>([]);
	const [editingUserId, setEditingUserId] = useState<number | null>(null);
	const [messageApi, contextHolder] = message.useMessage();

	const messageAction = (type: NoticeType, msg: string) => {
		messageApi.open({
			type: type,
			content: msg,
		});
	};

	const fetchUsers = async () => {
		const response = await fetch("http://localhost:3000/users");
		const json = await response.json();
		console.log("json", json);
		setData(json);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

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
				update: {
					zipCode: values.cep,
					street: values.street,
					city: values.city,
					state: values.state,
					neighborhood: values.neighborhood,
					number: Number(values.number),
				},
			},
		};

		try {
			if (editingUserId) {
				await fetch(`http://localhost:3000/users/${editingUserId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				messageAction("success", "Usuário atualizado com sucesso!");
			} else {
				payload.address = {
					create: payload.address.update,
				};
				delete payload.address.update;

				await fetch("http://localhost:3000/users", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				messageAction("success", "Usuário criado com sucesso!");
			}

			closeModal();
			fetchUsers();
		} catch (error) {
			messageAction("error", "Erro ao salvar o usuário");
		}
	};

	const onDeleteClick = () => {
		if (selectedRowKeys.length === 0) return;

		deleteUsers(selectedRowKeys as number[])
			.then(() => {
				setSelectedRowKeys([]);
				fetchUsers();
				messageAction("success", "Usuário(s) excluído(s) com sucesso!");
			})
			.catch(() => {
				messageAction("error", "Erro ao excluir usuário(s)");
			});
	};

	const onEditClick = () => {
		if (selectedRowKeys.length !== 1) return;

		const userToEdit = data.find((u) => u.id === selectedRowKeys[0]);
		if (!userToEdit) return;

		form.setFieldsValue({
			name: userToEdit.name,
			username: userToEdit.username,
			email: userToEdit.email,
			teamId: userToEdit.teamId,
			cep: userToEdit.address?.zipCode,
			state: userToEdit.address?.state,
			city: userToEdit.address?.city,
			street: userToEdit.address?.street,
			neighborhood: userToEdit.address?.neighborhood,
			number: userToEdit.address?.number,
		});

		setEditingUserId(userToEdit.id);
		setAddressFieldsDisabled(false);
		setIsModalOpen(true);
	};

	return (
		<DefaultLayout
			title="Usuários"
			addButton
			textButton="Criar Usuário"
			onAddClick={openModal}
		>
			{contextHolder}
			<Table
				rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
				columns={columns}
				dataSource={data}
				rowKey="id"
			/>

			<Modal
				open={isModalOpen}
				title={editingUserId ? "Editar Usuário" : "Criar Usuário"}
				onOk={() => form.submit()}
				onCancel={closeModal}
				width={832}
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
