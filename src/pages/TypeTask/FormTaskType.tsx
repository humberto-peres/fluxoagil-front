import React from 'react';
import type { FormInstance } from 'antd';
import { Form, Input } from 'antd';

type FieldType = { name?: string };

interface FormTaskTypeProps {
	form: FormInstance;
	onFinish: (values: FieldType) => void;
}

const FormTaskType: React.FC<FormTaskTypeProps> = ({ form, onFinish }) => (
	<Form form={form} name="task-type-form" layout="vertical" onFinish={onFinish}>
		<Form.Item<FieldType>
			label="Nome"
			name="name"
			rules={[{ required: true, message: 'Nome é obrigatório!' }]}
		>
			<Input size="large" placeholder="Ex.: Bug, Feature, Improvement..." autoFocus />
		</Form.Item>
	</Form>
);

export default FormTaskType;
