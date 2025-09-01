import React from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, ColorPicker, Row, Col } from 'antd';

type FieldType = {
	name?: string;
	label?: string;
};

interface FormPriorityProps {
	form: FormInstance;
	onFinish: (values: FieldType) => void;
}

const FormPriority: React.FC<FormPriorityProps> = ({ form, onFinish }) => (
	<Form form={form} name="priority-form" layout="vertical" onFinish={onFinish} initialValues={{ label: '#000000' }}>
		<Row align="middle" gutter={20}>
			<Col span={3}>
				<Form.Item<FieldType>
					label="Cor"
					name="label"
					rules={[{ required: true, message: 'Escolha uma cor!' }]}
				>
					<ColorPicker format="hex" size="large" />
				</Form.Item>
			</Col>
			<Col span={21}>
				<Form.Item<FieldType>
					label="Nome"
					name="name"
					rules={[{ required: true, message: 'Nome não preenchido!' }]}
				>
					<Input size='large' />
				</Form.Item>
			</Col>
		</Row>
	</Form>
);

export default FormPriority;
