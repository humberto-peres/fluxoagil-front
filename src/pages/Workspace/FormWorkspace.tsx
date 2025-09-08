import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Card, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { MdDeleteOutline } from "react-icons/md";
import { GoMoveToTop, GoMoveToBottom } from "react-icons/go";

import { getSteps } from '../../services/step.services';
import { getTeams } from '../../services/team.services';

const { Option } = Select;

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

    const fetchSteps = async () => {
        const stepData = await getSteps();
        setSteps(stepData);
    };

    const fetchTeams = async () => {
        const teamData = await getTeams();
        setTeams(teamData);
    };

    useEffect(() => {
        fetchSteps();
        fetchTeams();
    }, []);

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Nome do Workspace" name="name" rules={[{ required: true }]}>
                <Input size="large" placeholder="Digite o nome do workspace" />
            </Form.Item>

            <Form.Item
                label="Identificador"
                name="prefix"
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
                        form.setFieldsValue({ prefix: onlyLetters.toUpperCase() });
                    }}
                />
            </Form.Item>

            <Form.Item label="Metodologia" name="methodology" rules={[{ required: true }]}>
                <Select size="large" placeholder="Selecione a metodologia" onChange={(value) => setMethodology(value)}>
                    <Option value="Scrum">Scrum</Option>
                    <Option value="Kanban">Kanban</Option>
                </Select>
            </Form.Item>

            <Form.List name="steps">
                {(fields, { add, remove, move }) => (
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
                            {fields.length < 2 && (
                                <div style={{ marginBottom: 12, color: '#faad14' }}>
                                    ⚠️ Adicione pelo menos duas etapas para uma organização mais eficaz do board.
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

                                const selectedStepIds = form
                                    .getFieldValue("steps")
                                    ?.map((s: any) => s?.stepId)
                                    .filter(Boolean) || [];

                                return (
                                    <div
                                        key={field.key}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: 8,
                                            gap: 8,
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                            <span style={{ width: 32 }}>
                                                <Tag color="#9B30FF" style={{ padding: '4px' }}>#{index + 1}</Tag>
                                            </span>

                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'stepId']}
                                                rules={[{ required: true, message: 'Selecione uma etapa' }]}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Select
                                                    placeholder={`Etapa #${index + 1}`}
                                                    style={{ width: 280 }}
                                                    disabled={isEditing}
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

                                        <div style={{ display: 'flex', gap: 4 }}>
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
                                                    color="danger"
                                                    variant="solid"
                                                    icon={<MdDeleteOutline />}
                                                    onClick={() => remove(field.name)}
                                                    disabled={isEditing}
                                                />
                                            </Tooltip>
                                        </div>
                                    </div>

                                );
                            })}
                        </div>
                    </Card>
                )}
            </Form.List>


            <Form.Item label="Equipe Responsável" name="teamId" rules={[{ required: true }]} style={{ marginTop: 15 }}>
                <Select placeholder="Selecione uma equipe" size="large">
                    {teams.map((team) => (
                        <Option key={team.id} value={team.id}>
                            {team.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </Form>
    );
};

export default FormWorkspace;
