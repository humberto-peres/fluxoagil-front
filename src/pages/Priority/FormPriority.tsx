import React from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, ColorPicker, Row, Col } from 'antd';

type FieldType = { name?: string; label?: string };

interface FormPriorityProps {
	form: FormInstance;
	onFinish: (values: FieldType) => void;
	loading?: boolean;
}

const FormPriority: React.FC<FormPriorityProps> = ({ form, onFinish, loading = false }) => (
	<Form
		form={form}
		name="priority-form"
		layout="vertical"
		onFinish={onFinish}
		initialValues={{ label: '#000000' }}
	>
		<Row align="middle" gutter={[16, 0]}>
			<Col xs={24} md={6}>
				<Form.Item<FieldType>
					label="Cor"
					name="label"
					rules={[{ required: true, message: 'Escolha uma cor!' }]}
				>
					<ColorPicker format="hex" size="large" showText disabled={loading} />
				</Form.Item>
			</Col>

			<Col xs={24} md={18}>
				<Form.Item<FieldType>
					label="Nome"
					name="name"
					rules={[{ required: true, message: 'Nome não preenchido!' }]}
				>
					<Input
						size="large"
						placeholder="Ex.: Alta, Média, Baixa..."
						autoFocus
						disabled={loading}
						maxLength={50}
						showCount
					/>
				</Form.Item>
			</Col>
		</Row>
	</Form>
);

export default FormPriority;