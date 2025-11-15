import React from 'react';
import { Form, Input } from 'antd';
import type { FormInstance } from 'antd';

interface Props {
	form: FormInstance;
	onFinish: (values: { name: string }) => void;
	loading?: boolean;
}

const FormTeam: React.FC<Props> = ({ form, onFinish, loading = false }) => {
	return (
		<Form form={form} layout="vertical" onFinish={onFinish}>
			<Form.Item
				name="name"
				label="Nome da Equipe"
				rules={[
					{ required: true, message: 'Nome da equipe é obrigatório' }
				]}
			>
				<Input
					size="large"
					placeholder="Ex.: Backend, Mobile, Produto..."
					disabled={loading}
					maxLength={50}
					showCount
				/>
			</Form.Item>
		</Form>
	);
};

export default FormTeam;
