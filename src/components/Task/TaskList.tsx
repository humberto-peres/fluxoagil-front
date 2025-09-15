import React from 'react';
import { List, Tag, Typography, Tooltip, Popconfirm } from 'antd';
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
            dataSource={tasks}
            locale={{ emptyText: 'Sem tarefas' }}
            renderItem={(t) => {
                const canDelete = !t.epic;

                return (
                    <List.Item className="px-2 md:px-3">
                        <div className="group relative w-full rounded-xl border border-white/10 bg-white/5 p-4 md:p-5 transition-colors hover:border-white/20">
                            <div className="absolute right-3 top-3 flex items-center gap-2 opacity-70 transition-opacity group-hover:opacity-100">
                                {onEdit && (
                                    <Tooltip title="Editar">
                                        <button
                                            aria-label="Editar atividade"
                                            onClick={() => onEdit?.(t.id)}
                                            className="cursor-pointer"
                                        >
                                            <FiEdit2 size={18} />
                                        </button>
                                    </Tooltip>
                                )}
                                {onDelete && (
                                    <Tooltip title="Excluir">
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
                                            <button aria-label="Excluir atividade" className="cursor-pointer">
                                                <FiTrash2 size={19} />
                                            </button>
                                        </Popconfirm>
                                    </Tooltip>
                                )}
                            </div>

                            <div className="mb-2 flex flex-wrap items-center gap-2 pr-12">
                                {t.priority?.name && <Tag color={t.priority.label}>{t.priority.name}</Tag>}
                                <Tag color="purple">{t.idTask}</Tag>
                                {t.typeTask?.name && <Tag color="magenta">{t.typeTask.name}</Tag>}
                            </div>

                            <Typography.Text
                                strong
                                className="block text-base md:text-lg leading-snug line-clamp-2"
                                title={`${t.idTask} - ${t.title}`}
                            >
                                {t.idTask} - {t.title}
                            </Typography.Text>

                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1 text-sm">
                                <div>
                                    <span className="text-gray-400">Etapa atual: </span>
                                    <span>{t.step?.name ?? '—'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Prazo: </span>
                                    <span>{t.deadline ?? 'Não preenchido'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Tipo da tarefa: </span>
                                    <span>{t.typeTask?.name ?? '—'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Responsável: </span>
                                    <span>{t.assignee?.name ?? 'Não preenchido'}</span>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="text-gray-400">Épico associado: </span>
                                    {t.epic?.key ? (
                                        <Tag color="geekblue" className="ml-1">{`${t.epic.key} - ${t.epic.title}`}</Tag>
                                    ) : (
                                        <span className="ml-1">Sem associações</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </List.Item>
                );
            }}
        />
    );
};

export default TaskList;
