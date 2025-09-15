import React from 'react';
import { Form, Input } from 'antd';
import type { FormInstance } from 'antd';

interface Props {
	form: FormInstance;
	onFinish: (values: { name: string }) => void;
}

const FormTeam: React.FC<Props> = ({ form, onFinish }) => {
	return (
		<Form form={form} layout="vertical" onFinish={onFinish}>
			<Form.Item name="name" label="Nome da Equipe" rules={[{ required: true }]}>
				<Input size="large" placeholder="Ex.: Backend, Mobile, Produto..." />
			</Form.Item>
		</Form>
	);
};

export default FormTeam;
