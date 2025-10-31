import React, { useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, Select, DatePicker, Row, Col } from 'antd';
import { getTaskTypes } from '@/services/taskType.services';
import { getPriorities } from '@/services/priority.services';
import { getUsers } from '@/services/user.services';
import { getSprints } from '@/services/sprint.services';
import { getMyWorkspaces } from '@/services/workspace.services';
import { getEpics } from '@/services/epic.services';
import { useAuth } from '@/context/AuthContext';
import { getSteps } from '@/services/step.services';

const { TextArea } = Input;
const { Option } = Select;

type OptionType = { label: string; value: string | number };

type Props = {
	form: FormInstance;
	onFinish: (values: any) => void;
	selectedWorkspaceId?: number;
	isEdit?: boolean;
	isScrum?: boolean;
};

const FormTask: React.FC<Props> = ({ form, onFinish, selectedWorkspaceId, isEdit = true, isScrum = true }) => {
	const { user } = useAuth();
	const [types, setTypes] = useState<OptionType[]>([]);
	const [priorities, setPriorities] = useState<OptionType[]>([]);
	const [users, setUsers] = useState<OptionType[]>([]);
	const [sprints, setSprints] = useState<OptionType[]>([]);
	const [workspaces, setWorkspaces] = useState<OptionType[]>([]);
	const [epics, setEpics] = useState<OptionType[]>([]);
	const [steps, setSteps] = useState<OptionType[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const [typesRes, prioritiesRes, usersRes] = await Promise.all([
					getTaskTypes(),
					getPriorities(),
					getUsers(),
				]);
				setTypes((typesRes || []).map((t: any) => ({ label: t.name, value: t.id })));
				setPriorities((prioritiesRes || []).map((p: any) => ({ label: p.name, value: p.id })));

				const opts = (usersRes || []).map((u: any) => ({ label: u.name, value: u.id }));
				if (user && !opts.some((o: { value: any; }) => Number(o.value) === Number(user.id))) {
					opts.unshift({ label: user.name ?? 'Você', value: Number(user.id) });
				}
				setUsers(opts);
			} catch {
				/* noop */
			}
		})();
	}, [user]);

	useEffect(() => {
		(async () => {
			try {
				const ws = await getMyWorkspaces();
				setWorkspaces((ws || []).map((w: any) => ({ label: `${w.name} (${w.key})`, value: w.id })));
				if (selectedWorkspaceId) {
					form.setFieldsValue({ workspaceId: selectedWorkspaceId });
				}
			} catch { /* noop */ }
		})();
	}, [selectedWorkspaceId, form]);

	useEffect(() => {
		(async () => {
			const wsId = form.getFieldValue('workspaceId') || selectedWorkspaceId;
			if (!wsId) {
				setSprints([]); setEpics([]); setSteps([]);
				return;
			}
			try {
				const [sps, eps, stps] = await Promise.all([
					getSprints({ workspaceId: Number(wsId) }),
					getEpics({ workspaceId: Number(wsId) }),
					getSteps({ workspaceId: Number(wsId) }),
				]);
				setSprints((sps || []).map((s: any) => ({ label: s.name, value: s.id })));
				setEpics((eps || []).map((e: any) => ({ label: `${e.key} — ${e.title}`, value: e.id })));
				setSteps((stps || []).map((p: any) => ({ label: p.name, value: p.id })));
			} catch {
				setSprints([]); setEpics([]); setSteps([]);
			}
		})();
	}, [selectedWorkspaceId, form]);

	useEffect(() => {
		if (!user) return;
		const current = form.getFieldValue('reporterId');
		if (!current) {
			form.setFieldsValue({ reporterId: Number(user.id) });
		}
	}, [user, users, form]);

	const onWorkspaceChange = async (wid: number) => {
		form.setFieldsValue({ sprintId: undefined, epicId: undefined, stepId: undefined });
		try {
			const [sps, eps, stps] = await Promise.all([
				getSprints({ workspaceId: wid }),
				getEpics({ workspaceId: wid }),
				getSteps({ workspaceId: wid }),
			]);
			setSprints((sps || []).map((s: any) => ({ label: s.name, value: s.id })));
			setEpics((eps || []).map((e: any) => ({ label: `${e.key} — ${e.title}`, value: e.id })));
			setSteps((stps || []).map((p: any) => ({ label: p.name, value: p.id })));
		} catch {
			setSprints([]); setEpics([]); setSteps([]);
		}
	};

	return (
		<Form form={form} layout="vertical" onFinish={onFinish}>
			{isEdit && <Form.Item
				label="Etapa"
				name="stepId"
				rules={[{ required: true, message: 'Informe o workspace' }]}
			>
				<Select
					size="large"
					placeholder="Selecione a etapa"
					allowClear
					options={steps}
					showSearch
					optionFilterProp="label"
				/>
			</Form.Item>}
			
			<Form.Item
				label="Workspace"
				name="workspaceId"
				rules={[{ required: true, message: 'Informe o workspace' }]}
			>
				<Select
					size="large"
					placeholder="Selecione um workspace"
					allowClear
					onChange={(val) => onWorkspaceChange(Number(val))}
					options={workspaces}
					showSearch
					optionFilterProp="label"
				/>
			</Form.Item>

			<Form.Item label="Título" name="title" rules={[{ required: true, message: 'Informe um título' }]}>
				<Input size="large" placeholder="Digite o título" />
			</Form.Item>

			<Row gutter={[16, 0]}>
				<Col xs={24} md={12}>
					<Form.Item label="Tipo de Atividade" name="type-task" rules={[{ required: true, message: 'Selecione o tipo' }]}>
						<Select size="large" placeholder="Selecione o tipo" allowClear>
							{types.map((o) => (
								<Option key={o.value} value={o.value}>{o.label}</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item label="Prioridade" name="priority" rules={[{ required: true, message: 'Selecione a prioridade' }]}>
						<Select size="large" placeholder="Selecione a prioridade" allowClear>
							{priorities.map((o) => (
								<Option key={o.value} value={o.value}>{o.label}</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={[16, 0]}>
				{isScrum && <Col xs={24} md={12}>
					<Form.Item label="Sprint" name="sprint">
						<Select size="large" placeholder="Selecione a sprint" allowClear options={sprints} />
					</Form.Item>
				</Col>}
				<Col xs={24} md={12}>
					<Form.Item label="Épico" name="epicId">
						<Select size="large" placeholder="Vincular a um épico" allowClear options={epics} showSearch optionFilterProp="label" />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={[16, 0]}>
				<Col xs={24} md={12}>
					<Form.Item label="Estimativa" name="estimate" tooltip="Em horas (ex.: 2 ou 2.5)">
						<Input size="large" placeholder="Digite a estimativa" />
					</Form.Item>
				</Col>
				<Col xs={24} md={12} />
			</Row>

			<Row gutter={[16, 0]}>
				<Col xs={24} md={12}>
					<Form.Item label="Data de início" name="start-date">
						<DatePicker size="large" style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Selecione a data" />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						label="Prazo"
						name="deadline"
						dependencies={['start-date']}
						rules={[
							({ getFieldValue }) => ({
								validator(_, value) {
									const start = getFieldValue('start-date');
									if (!start || !value) return Promise.resolve();
									if (value.isSame(start, 'day') || value.isAfter(start, 'day')) return Promise.resolve();
									return Promise.reject(new Error('Prazo deve ser igual ou posterior à data de início'));
								},
							}),
						]}
					>
						<DatePicker size="large" style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Selecione o prazo" />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={[16, 0]}>
				<Col xs={24} md={12}>
					<Form.Item label="Relator" name="report" rules={[{ required: true, message: 'Informe um relator' }]}>
						<Select size="large" placeholder="Selecione o relator" allowClear>
							{users.map((o) => (
								<Option key={o.value} value={o.value}>{o.label}</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item label="Responsável" name="responsible">
						<Select size="large" placeholder="Selecione o responsável" allowClear>
							{users.map((o) => (
								<Option key={o.value} value={o.value}>{o.label}</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
			</Row>

			<Form.Item label="Descrição" name="description">
				<TextArea rows={4} placeholder="Descreva a atividade" />
			</Form.Item>

			<button type="submit" style={{ display: 'none' }} />
		</Form>
	);
};

export default FormTask;
