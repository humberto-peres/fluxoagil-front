import React from "react";
import type { FormInstance } from "antd";
import { Col, Flex, Form, Input, Row } from "antd";
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
		} catch (error) {
			setAddressFieldsDisabled(true);
		}
	};

	return (
		<Form form={form} name="user-form" layout="vertical" onFinish={onFinish}>
			<Flex>
				<div style={{ width: "50%", paddingRight: 24 }}>
					<Form.Item<FieldType>
						name="name"
						label="Nome"
						rules={[{ required: true }]}
					>
						<Input size="large" />
					</Form.Item>
					<Form.Item<FieldType>
						name="email"
						label="Email"
						rules={[{ required: true }, { type: "email" }]}
					>
						<Input size="large" />
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item<FieldType>
								name="username"
								label="Username"
								rules={[{ required: true }]}
							>
								<Input size="large" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item<FieldType>
								name="password"
								label="Senha"
								rules={isEditing ? [{ min: 6 }] : [{ required: true, min: 6 }]}
							>
								<Input.Password
									size="large"
									placeholder={
										isEditing ? "Deixe em branco para manter a senha atual" : ""
									}
								/>
							</Form.Item>
						</Col>
					</Row>
				</div>

				<div style={{ width: "50%" }}>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item<FieldType>
								name="cep"
								label="CEP"
								rules={[{ required: true }]}
							>
								<Input.Search onSearch={onSearch} size="large" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item<FieldType>
								name="state"
								label="Estado"
								rules={[{ required: true }]}
							>
								<Input size="large" disabled={addressFieldsDisabled} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item<FieldType>
								name="city"
								label="Cidade"
								rules={[{ required: true }]}
							>
								<Input size="large" disabled={addressFieldsDisabled} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item<FieldType>
								name="street"
								label="Rua"
								rules={[{ required: true }]}
							>
								<Input size="large" disabled={addressFieldsDisabled} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item<FieldType>
								name="neighborhood"
								label="Bairro"
								rules={[{ required: true }]}
							>
								<Input size="large" disabled={addressFieldsDisabled} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item<FieldType>
								name="number"
								label="Número"
								rules={[{ required: true }]}
							>
								<Input size="large" type="number" />
							</Form.Item>
						</Col>
					</Row>
				</div>
			</Flex>
		</Form>
	);
};

export default FormUser;
