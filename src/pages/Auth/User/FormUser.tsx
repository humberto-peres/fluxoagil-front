import React from "react";
import type { FormInstance } from "antd";
import { Col, Form, Input, Row } from "antd";
import cepUtils from "../../../utils/cepUtils";
import type { Dispatch, SetStateAction } from "react";

interface FieldType {
	name?: string;
	username?: string;
	email?: string;
	password?: string;
	cep?: string;
	state?: string;
	city?: string;
	street?: string;
	neighborhood?: string;
	number?: number;
	teamId?: number;
}

interface FormUserProps {
	form: FormInstance;
	onFinish: (values: FieldType) => void;
	addressFieldsDisabled: boolean;
	setAddressFieldsDisabled: Dispatch<SetStateAction<boolean>>;
	isEditing: boolean;
}

const FormUser: React.FC<FormUserProps> = ({
	form,
	onFinish,
	addressFieldsDisabled,
	setAddressFieldsDisabled,
	isEditing,
}) => {
	const onSearch = async (value: string) => {
		try {
			const addressData = await cepUtils.fetchAddress(value);
			form.setFieldsValue({
				city: addressData.city,
				state: addressData.state,
				neighborhood: addressData.neighborhood,
				street: addressData.street,
			});
			setAddressFieldsDisabled(false);
		} catch {
			setAddressFieldsDisabled(true);
		}
	};

	return (
		<Form form={form} name="user-form" layout="vertical" onFinish={onFinish}>
			<Row gutter={[24, 0]}>
				<Col xs={24} md={12}>
					<Form.Item<FieldType> name="name" label="Nome" rules={[{ required: true }]}>
						<Input size="large" />
					</Form.Item>

					<Form.Item<FieldType> name="email" label="Email" rules={[{ required: true }, { type: "email" }]}>
						<Input size="large" />
					</Form.Item>

					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item<FieldType> name="username" label="Username" rules={[{ required: true }]}>
								<Input size="large" />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item<FieldType>
								name="password"
								label="Senha"
								rules={isEditing ? [{ min: 6 }] : [{ required: true, min: 6 }]}
							>
								<Input.Password
									size="large"
									placeholder={isEditing ? "Deixe em branco para manter a senha atual" : ""}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Col>

				<Col xs={24} md={12}>
					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item<FieldType> name="cep" label="CEP">
								<Input.Search onSearch={onSearch} size="large" placeholder="Ex.: 01001-000" />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item<FieldType> name="state" label="Estado">
								<Input size="large" disabled={addressFieldsDisabled} />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item<FieldType> name="city" label="Cidade">
								<Input size="large" disabled={addressFieldsDisabled} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item<FieldType> name="street" label="Rua">
								<Input size="large" disabled={addressFieldsDisabled} />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item<FieldType> name="neighborhood" label="Bairro">
								<Input size="large" disabled={addressFieldsDisabled} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item<FieldType> name="number" label="Número">
								<Input size="large" type="number" />
							</Form.Item>
						</Col>
					</Row>
				</Col>
			</Row>
		</Form>
	);
};

export default FormUser;
