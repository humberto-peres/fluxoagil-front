import React, { useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, DatePicker, Select, Row, Col } from 'antd';
import { getPriorities } from '@/services/priority.services';

const { TextArea } = Input;
const { Option } = Select;

type Props = {
	form: FormInstance;
	onFinish: (values: any) => void;
	disabled?: boolean;
};

const FormEpic: React.FC<Props> = ({ form, onFinish, disabled }) => {
	const [priorities, setPriorities] = useState<{ label: string; value: number }[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const list = await getPriorities();
				setPriorities((list || []).map((p: any) => ({ label: p.name, value: p.id })));
			} catch { /* noop */ }
		})();
	}, []);

	return (
		<Form layout="vertical" form={form} onFinish={onFinish}>
			<Form.Item name="title" label="Título" rules={[{ required: true, message: 'Informe um título' }]}>
				<Input size="large" placeholder="Digite o título do épico" disabled={disabled} />
			</Form.Item>

			<Form.Item name="priorityId" label="Prioridade">
				<Select size="large" placeholder="Selecione a prioridade" allowClear disabled={disabled} showSearch optionFilterProp="children">
					{priorities.map((o) => (
						<Option key={o.value} value={o.value}>{o.label}</Option>
					))}
				</Select>
			</Form.Item>

			<Row gutter={[12, 0]}>
				<Col xs={24} md={12}>
					<Form.Item name="startDate" label="Início">
						<DatePicker size="large" style={{ width: '100%' }} format="DD/MM/YYYY" disabled={disabled} placeholder='DD/MM/YYYY' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name="targetDate"
						label="Meta"
						dependencies={['startDate']}
						rules={[
							({ getFieldValue }) => ({
								validator(_, value) {
									const start = getFieldValue('startDate');
									if (!start || !value) return Promise.resolve();
									if (value.isSame(start, 'day') || value.isAfter(start, 'day')) return Promise.resolve();
									return Promise.reject(new Error('Meta deve ser igual ou após o início'));
								},
							}),
						]}
					>
						<DatePicker size='large' style={{ width: '100%' }} format="DD/MM/YYYY" disabled={disabled} placeholder='DD/MM/YYYY' />
					</Form.Item>
				</Col>
			</Row>

			<Form.Item name="description" label="Descrição">
				<TextArea rows={4} placeholder="Contexto, objetivos e restrições" disabled={disabled} />
			</Form.Item>

			<button type="submit" style={{ display: 'none' }} />
		</Form>
	);
};

export default FormEpic;
