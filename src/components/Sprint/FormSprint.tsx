import React from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, DatePicker } from 'antd';
import { Dayjs } from 'dayjs';

type Props = {
	form: FormInstance;
	onFinish: (values: any) => void;
	loading?: boolean;
};

const FormSprint: React.FC<Props> = ({ form, onFinish, loading = false }) => {
	const start = Form.useWatch('startDate', form) as Dayjs | undefined;

	const validateEndAfterStart = (_: any, value: Dayjs | undefined) => {
		if (!start || !value) return Promise.resolve();
		if (value.isSame(start, 'day') || value.isAfter(start, 'day')) return Promise.resolve();
		return Promise.reject(new Error('Término deve ser igual ou após o início'));
	};

	const handleFinish = (values: any) => onFinish(values);

	return (
		<Form form={form} layout="vertical" onFinish={handleFinish} colon={false}>
			<Form.Item
				label="Nome da sprint"
				name="name"
				rules={[
					{ required: true, message: 'Informe um nome para a sprint.' },
					{ max: 120, message: 'Nome muito longo (máximo 120 caracteres)' }
				]}
			>
				<Input
					size="large"
					placeholder="Digite o nome da sprint"
					disabled={loading}
					maxLength={120}
					showCount
				/>
			</Form.Item>

			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
				<Form.Item
					label="Início"
					name="startDate"
					rules={[{ required: true, message: 'Informe a data de início.' }]}
				>
					<DatePicker
						size="large"
						style={{ width: '100%' }}
						format="DD/MM/YYYY"
						disabled={loading}
						placeholder="DD/MM/YYYY"
					/>
				</Form.Item>

				<Form.Item
					label="Término"
					name="endDate"
					rules={[
						{ validator: validateEndAfterStart },
						{ required: true, message: 'Informe a data de término.' }
					]}
					dependencies={['startDate']}
				>
					<DatePicker
						size="large"
						style={{ width: '100%' }}
						format="DD/MM/YYYY"
						disabled={loading}
						placeholder="DD/MM/YYYY"
					/>
				</Form.Item>
			</div>
		</Form>
	);
};

export default FormSprint;
