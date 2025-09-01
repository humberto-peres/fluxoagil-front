import React, { useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, Select, DatePicker, Row, Col } from 'antd';
import { getTaskTypes } from '@/services/taskType.services';
import { getPriorities } from '@/services/priority.services';
import { getUsers } from '@/services/user.services';
import { getSprints } from '@/services/sprint.services';
import { getWorkspaces } from '@/services/workspace.services';

const { TextArea } = Input;
const { Option } = Select;

type OptionType = { label: string; value: string | number };

type Props = {
	form: FormInstance;
	onFinish: (values: any) => void;
	selectedWorkspaceId?: number;
};

const FormTask: React.FC<Props> = ({ form, onFinish, selectedWorkspaceId }) => {
	const [types, setTypes] = useState<OptionType[]>([]);
	const [priorities, setPriorities] = useState<OptionType[]>([]);
	const [users, setUsers] = useState<OptionType[]>([]);
	const [sprints, setSprints] = useState<OptionType[]>([]);
	const [workspaces, setWorkspaces] = useState<OptionType[]>([]);

	// Carrega opções base (tipos, prioridades, usuários, workspaces)
	useEffect(() => {
		(async () => {
			try {
				const [typesRes, prioritiesRes, usersRes, workspacesRes] = await Promise.all([
					getTaskTypes(),
					getPriorities(),
					getUsers(),
					getWorkspaces(),
				]);

				setTypes((typesRes || []).map((t: any) => ({ label: t.name, value: t.id })));
				setPriorities((prioritiesRes || []).map((p: any) => ({ label: p.name, value: p.id })));
				setUsers((usersRes || []).map((u: any) => ({ label: u.name, value: u.id })));
				setWorkspaces(
					(workspacesRes || []).map((w: any) => ({
						// se você tiver w.code, pode usar `${w.code} — ${w.name}`
						label: w.code ? `${w.code} — ${w.name}` : w.name,
						value: w.id,
					}))
				);
			} catch { }
		})();
	}, []);

	// Observa o campo workspaceId dentro do form (para recarregar sprints quando mudar)
	const currentWorkspaceId = Form.useWatch('workspaceId', form);

	// Pré-preenche o workspace com o selecionado no Board (se existir e se ainda não houver valor no form)
	useEffect(() => {
		if (selectedWorkspaceId) {
			const already = form.getFieldValue('workspaceId');
			if (!already) form.setFieldsValue({ workspaceId: selectedWorkspaceId });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedWorkspaceId]);

	// Carrega sprints do workspace atualmente escolhido no form
	useEffect(() => {
		(async () => {
			const wsId = currentWorkspaceId || selectedWorkspaceId;
			if (!wsId) {
				setSprints([]);
				return;
			}
			try {
				const data = await getSprints({ workspaceId: Number(wsId) });
				setSprints((data || []).map((s: any) => ({ label: s.name, value: s.id })));
			} catch {
				setSprints([]);
			}
		})();
	}, [currentWorkspaceId, selectedWorkspaceId]);

	// Quando workspace mudar manualmente, limpamos a sprint selecionada
	useEffect(() => {
		if (currentWorkspaceId) {
			form.setFieldsValue({ sprint: undefined });
		}
	}, [currentWorkspaceId, form]);

	return (
		<Form form={form} layout="vertical" onFinish={onFinish} style={{ padding: 20 }}>
			<Form.Item
				label="Workspace"
				name="workspaceId"
				rules={[{ required: true, message: 'Selecione o workspace' }]}
			>
				<Select size="large" placeholder="Selecione o workspace" allowClear showSearch optionFilterProp="children">
					{workspaces.map((o) => (
						<Option key={o.value} value={o.value}>
							{o.label}
						</Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item
				label="Título"
				name="title"
				rules={[{ required: true, message: 'Informe um título' }]}
			>
				<Input size="large" placeholder="Digite o título" />
			</Form.Item>

			<Form.Item
				label="Tipo de Atividade"
				name="type-task"
				rules={[{ required: true, message: 'Selecione o tipo' }]}
			>
				<Select size="large" placeholder="Selecione o tipo" allowClear>
					{types.map((o) => (
						<Option key={o.value} value={o.value}>
							{o.label}
						</Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item
				label="Prioridade"
				name="priority"
				rules={[{ required: true, message: 'Selecione a prioridade' }]}
			>
				<Select size="large" placeholder="Selecione a prioridade" allowClear>
					{priorities.map((o) => (
						<Option key={o.value} value={o.value}>
							{o.label}
						</Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item label="Sprint" name="sprint">
				<Select size="large" placeholder="Selecione a sprint da atividade" allowClear>
					{sprints.map((o) => (
						<Option key={o.value} value={o.value}>
							{o.label}
						</Option>
					))}
				</Select>
			</Form.Item>

			<Row gutter={24}>
				<Col span={12}>
					<Form.Item label="Estimativa" name="estimate" tooltip="Em horas (ex.: 2 ou 2.5)">
						<Input size="large" placeholder="Digite a estimativa" />
					</Form.Item>
				</Col>
				<Col span={12} />
			</Row>

			<Row gutter={24}>
				<Col span={12}>
					<Form.Item label="Data de início" name="start-date">
						<DatePicker size="large" style={{ width: '100%' }} placeholder="Selecione a data" />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label="Prazo"
						name="deadline"
						dependencies={['start-date']}
						rules={[
							({ getFieldValue }) => ({
								validator(_, value) {
									const start = getFieldValue('start-date');
									if (!start || !value) return Promise.resolve();
									if (value.isSame(start, 'day') || value.isAfter(start, 'day')) {
										return Promise.resolve();
									}
									return Promise.reject(new Error('Prazo deve ser igual ou posterior à data de início'));
								},
							}),
						]}
					>
						<DatePicker size="large" style={{ width: '100%' }} placeholder="Selecione o prazo" />
					</Form.Item>
				</Col>
			</Row>

			<Form.Item
				label="Relator"
				name="report"
				rules={[{ required: true, message: 'Informe um relator' }]}
			>
				<Select size="large" placeholder="Selecione o relator" allowClear>
					{users.map((o) => (
						<Option key={o.value} value={o.value}>
							{o.label}
						</Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item label="Responsável" name="responsible">
				<Select size="large" placeholder="Selecione o responsável" allowClear>
					{users.map((o) => (
						<Option key={o.value} value={o.value}>
							{o.label}
						</Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item label="Descrição" name="description">
				<TextArea rows={4} placeholder="Descreva a atividade" />
			</Form.Item>

			<button type="submit" style={{ display: 'none' }} />
		</Form>
	);
};

export default FormTask;
