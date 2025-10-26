import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Card, Tag, Tooltip, Alert, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { MdDeleteOutline } from "react-icons/md";
import { GoMoveToTop, GoMoveToBottom } from "react-icons/go";

import { getSteps } from '../../services/step.services';
import { getTeams } from '../../services/team.services';

const { Option } = Select;
const { Text } = Typography;

type Props = {
	form: any;
	onFinish: (values: any) => void;
	isEditing?: boolean;
};

type StepType = { id: number; name: string };
type TeamType = { id: number; name: string };

const CODE_ONLY_LETTERS = /^[A-Za-z]*$/;

const FormWorkspace: React.FC<Props> = ({ form, onFinish, isEditing }) => {
	const [steps, setSteps] = useState<StepType[]>([]);
	const [teams, setTeams] = useState<TeamType[]>([]);
	const [_, setMethodology] = useState<'Scrum' | 'Kanban'>('Scrum');

	useEffect(() => {
		(async () => {
			setSteps(await getSteps());
			setTeams(await getTeams());
		})();
	}, []);

	return (
		<Form form={form} layout="vertical" onFinish={onFinish}>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Form.Item label="Nome do Workspace" name="name" rules={[{ required: true }]}>
					<Input size="large" placeholder="Digite o nome do workspace" />
				</Form.Item>

				<Form.Item
					label="Identificador"
					name="key"
					tooltip="Apenas letras, até 5 (ex.: WOR). Será usado como prefixo: WOR-1, WOR-2..."
					rules={[
						{ required: true, message: 'Informe o código do workspace' },
						{
							validator: (_, v) =>
								v && v.length >= 1 && v.length <= 5 && CODE_ONLY_LETTERS.test(v)
									? Promise.resolve()
									: Promise.reject(new Error('Use apenas letras (1 a 5)')),
						},
					]}
				>
					<Input
						size="large"
						maxLength={5}
						placeholder="Ex.: WOR"
						onChange={(e) => {
							const onlyLetters = e.target.value.replace(/[^A-Za-z]/g, '');
							form.setFieldsValue({ key: onlyLetters.toUpperCase() });
						}}
					/>
				</Form.Item>

				<Form.Item className="md:col-span-1" label="Metodologia" name="methodology" rules={[{ required: true }]}>
					<Select size="large" placeholder="Selecione a metodologia" onChange={(value) => setMethodology(value)}>
						<Option value="Scrum">Scrum</Option>
						<Option value="Kanban">Kanban</Option>
					</Select>
				</Form.Item>

				<Form.Item className="md:col-span-1" label="Equipe Responsável" name="teamId" rules={[{ required: true }]}>
					<Select placeholder="Selecione uma equipe" size="large" showSearch optionFilterProp="children">
						{teams.map((team) => (
							<Option key={team.id} value={team.id}>
								{team.name}
							</Option>
						))}
					</Select>
				</Form.Item>
			</div>

			<Alert
				type="info"
				showIcon
				style={{ marginBottom: 12 }}
				message="Fluxo das etapas"
				description={
					<div>
						<div>• <Text strong>A primeira etapa</Text> é o início do fluxo do board.</div>
						<div>• <Text strong>A última etapa</Text> é considerada <Text strong>“Concluída”</Text>. Ao encerrar uma sprint,
							todas as atividades que estiverem nessa última etapa permanecem na sprint; as demais serão movidas de acordo com a sua escolha.</div>
						<div>• É recomendado ter pelo menos 3 etapas para um fluxo saudável (ex.: <em>Backlog → Em andamento → Concluído</em>).</div>
					</div>
				}
			/>

			<Form.List
				name="steps"
				
			>
				{(fields, { add, remove, move }, { errors }) => (
					<Card
						title="Ordem das Etapas"
						extra={
							!isEditing && (
								<Button type="primary" onClick={() => add()} icon={<PlusOutlined />}>
									Adicionar
								</Button>
							)
						}
						style={{ padding: '12px 24px', backgroundColor: "#25262aff" }}
					>
						<div style={{ maxHeight: 300, overflowY: 'auto', paddingRight: 10 }}>
							{!isEditing && fields.length < 3 && (
								<div style={{ marginBottom: 12, color: '#faad14' }}>
									⚠️ É necessário adicionar <b>pelo menos 3 etapas</b> para habilitar o salvamento.
								</div>
							)}

							{fields.map((field, index) => {
								const stepValue = form.getFieldValue("steps")?.[field.name];

								if (isEditing) {
									return (
										<Tag
											key={field.key}
											color="#9B30FF"
											style={{ display: 'block', marginBottom: 8, fontSize: 14 }}
										>
											{index + 1}. {stepValue?.name || 'Etapa desconhecida'}
										</Tag>
									);
								}

								const selectedStepIds =
									form.getFieldValue("steps")?.map((s: any) => s?.stepId).filter(Boolean) || [];

								return (
									<div
										key={field.key}
										className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2"
									>
										<div className="flex items-center gap-2 md:gap-3">
											<span className="w-8">
												<Tag color="#9B30FF" style={{ padding: '4px' }}>#{index + 1}</Tag>
											</span>

											<Form.Item
												{...field}
												name={[field.name, 'stepId']}
												rules={[{ required: true, message: 'Selecione uma etapa' }]}
												style={{ marginBottom: 0, flex: 1 }}
												className="w-[150px]"
											>
												<Select
													placeholder={`Etapa #${index + 1}`}
													className="w-full"
													popupMatchSelectWidth={false}
													showSearch
													optionFilterProp="children"
												>
													{steps
														.filter(
															(step) =>
																!selectedStepIds.includes(step.id) ||
																step.id === form.getFieldValue('steps')?.[field.name]?.stepId
														)
														.map((step) => (
															<Option key={step.id} value={step.id}>
																{step.name}
															</Option>
														))}
												</Select>
											</Form.Item>
										</div>

										<div className="flex gap-2">
											<Tooltip title="Mover para cima">
												<Button
													type="primary"
													icon={<GoMoveToTop color='white' />}
													onClick={() => move(index, index - 1)}
													disabled={index === 0 || isEditing}
												/>
											</Tooltip>
											<Tooltip title="Mover para baixo">
												<Button
													type="primary"
													icon={<GoMoveToBottom color='white' />}
													onClick={() => move(index, index + 1)}
													disabled={index === fields.length - 1 || isEditing}
												/>
											</Tooltip>
											<Tooltip title="Remover">
												<Button
													danger
													icon={<MdDeleteOutline />}
													onClick={() => remove(field.name)}
													disabled={isEditing}
												/>
											</Tooltip>
										</div>
									</div>
								);
							})}

							<Form.ErrorList errors={errors} />
						</div>
					</Card>
				)}
			</Form.List>
		</Form>
	);
};

export default FormWorkspace;
