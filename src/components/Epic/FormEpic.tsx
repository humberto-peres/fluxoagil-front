import React, { useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, DatePicker, Select, Row, Col, Spin } from 'antd';
import { getPriorities } from '@/services/priority.services';

const { TextArea } = Input;
const { Option } = Select;

type Props = {
	form: FormInstance;
	onFinish: (values: any) => void;
	loading?: boolean;
};

const FormEpic: React.FC<Props> = ({ form, onFinish, loading = false }) => {
	const [priorities, setPriorities] = useState<{ label: string; value: number }[]>([]);
	const [loadingData, setLoadingData] = useState(true);

	useEffect(() => {
		(async () => {
			setLoadingData(true);
			try {
				const list = await getPriorities();
				setPriorities((list || []).map((p: any) => ({ label: p.name, value: p.id })));
			} catch (error) {
				console.error('Erro ao carregar prioridades:', error);
			} finally {
				setLoadingData(false);
			}
		})();
	}, []);

	if (loadingData) {
		return (
			<div style={{ textAlign: 'center', padding: '40px 0' }}>
				<Spin size="large" tip="Carregando dados..." />
			</div>
		);
	}

	return (
		<Form layout="vertical" form={form} onFinish={onFinish}>
			<Form.Item
				name="title"
				label="Título"
				rules={[{ required: true, message: 'Informe um título' }]}
			>
				<Input
					size="large"
					placeholder="Digite o título do épico"
					disabled={loading}
					maxLength={200}
					showCount
				/>
			</Form.Item>

			<Form.Item name="priorityId" label="Prioridade">
				<Select
					size="large"
					placeholder="Selecione a prioridade"
					allowClear
					disabled={loading}
					showSearch
					optionFilterProp="children"
				>
					{priorities.map((o) => (
						<Option key={o.value} value={o.value}>{o.label}</Option>
					))}
				</Select>
			</Form.Item>

			<Row gutter={[12, 0]}>
				<Col xs={24} md={12}>
					<Form.Item name="startDate" label="Início">
						<DatePicker
							size="large"
							style={{ width: '100%' }}
							format="DD/MM/YYYY"
							disabled={loading}
							placeholder="DD/MM/YYYY"
						/>
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
						<DatePicker
							size="large"
							style={{ width: '100%' }}
							format="DD/MM/YYYY"
							disabled={loading}
							placeholder="DD/MM/YYYY"
						/>
					</Form.Item>
				</Col>
			</Row>

			<Form.Item name="description" label="Descrição">
				<TextArea
					rows={4}
					placeholder="Contexto, objetivos e restrições"
					disabled={loading}
					maxLength={1000}
					showCount
				/>
			</Form.Item>

			<button type="submit" style={{ display: 'none' }} />
		</Form>
	);
};

export default FormEpic;
