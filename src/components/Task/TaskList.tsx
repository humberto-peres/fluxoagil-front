import React from 'react';
import { List, Tag, Typography, Tooltip, Popconfirm, Space, Flex } from 'antd';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

type User = { id: number; name: string };
type Priority = { id: number; name: string; label: string };
type TypeTask = { id: number; name: string };
type Step = { id: number; name: string };

export type TaskItem = {
    id: number;
    idTask: string;
    title: string;
    description?: string | null;
    deadline?: string | null;
    estimate?: string | null;
    priority?: Priority;
    typeTask?: TypeTask;
    step?: Step;
    reporter?: User | null;
    assignee?: User | null;
    epic?: { id: number; key: string; title: string } | null;
};

type Props = {
    tasks: TaskItem[];
    onEdit?: (taskId: number) => void;
    onDelete?: (taskId: number) => void;
};

const TaskList: React.FC<Props> = ({ tasks, onEdit, onDelete }) => {
    return (
        <List
            size="large"
            dataSource={tasks}
            locale={{ emptyText: 'Sem tarefas' }}
            renderItem={(t) => {
                const canDelete = !t.epic;
                const {
                    step,
                    typeTask,
                    priority,
                    deadline,
                    assignee,
                    epic
                } = t;

                return (
                    <List.Item
                        className="relative group px-2 py-2 p-[50px]"
                        actions={[
                            <Space size={'middle'}>
                                {onEdit && (
                                    <Tooltip title="Editar">
                                        <FiEdit2 size={17} onClick={() => onEdit?.(t.id)} style={{ cursor: 'pointer' }} />
                                    </Tooltip>
                                )}
                                {onDelete && (

                                    <Tooltip title={'Excluir'}>
                                        <Popconfirm
                                            title="Excluir atividade?"
                                            description={
                                                !canDelete
                                                    ? 'Não é possível excluir, a atividade está associada a um épico.'
                                                    : 'Esta ação não pode ser desfeita.'
                                            }
                                            okText="Excluir"
                                            okButtonProps={{ danger: true, disabled: !canDelete }}
                                            cancelText="Cancelar"
                                            onConfirm={() => onDelete?.(t.id)}
                                        >
                                            <FiTrash2 size={20} style={{ cursor: 'pointer' }} />
                                        </Popconfirm>
                                    </Tooltip>
                                )}
                            </Space>
                        ]}
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="w-full pl-2 pr-14">
                            <Flex>
                                <Tooltip title={`${t.idTask} - ${t.title}`}>
                                    <Typography.Text className="font-semibold line-clamp-2">
                                        {t.idTask} - {t.title}
                                    </Typography.Text>
                                </Tooltip>
                            </Flex>

                            <Space size={35} className='!mt-[5px]'>
                                <Flex vertical>
                                    <p className='!text-xs !text-gray-300'>Etapa atual:</p>
                                    <Typography.Text>{step?.name}</Typography.Text>
                                </Flex>
                                <Flex vertical>
                                    <p className='!text-xs !text-gray-300'>Tipo da tarefa:</p>
                                    <Typography.Text>{typeTask?.name}</Typography.Text>
                                </Flex>
                                <Flex vertical>
                                    <p className='!text-xs !text-gray-300'>Prioridade:</p>
                                    <Typography.Text>{priority?.name}</Typography.Text>
                                </Flex>
                                <Flex vertical>
                                    <p className='!text-xs !text-gray-300'>Prazo:</p>
                                    <Typography.Text>{deadline ?? "Não preenchido"}</Typography.Text>
                                </Flex>
                                <Flex vertical>
                                    <p className='!text-xs !text-gray-300'>Responsável:</p>
                                    <Typography.Text>{assignee?.name ?? "Não preenchido"}</Typography.Text>
                                </Flex>
                                <Flex vertical>
                                    <p className='!text-xs !text-gray-300'>Épico associado:</p>
                                    {t.epic?.key ? <Tag color="geekblue">{`${epic?.key} - ${epic?.title}`}</Tag> : "Sem associações"}

                                </Flex>
                            </Space>
                        </div>
                    </List.Item>
                );
            }}
        />
    );
};

export default TaskList;
