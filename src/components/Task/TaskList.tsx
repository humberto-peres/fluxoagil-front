import React from 'react';
import { List, Tag, Typography, Tooltip, Popconfirm } from 'antd';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

type User = { id: number; name: string };
type Priority = { id: number; name: string; label: string };
type TypeTask = { id: number; name: string };
type StepTask = { id: number; name: string };

export type TaskItem = {
    id: number;
    idTask: string;
    title: string;
    description?: string | null;
    deadline?: string | null;
    estimate?: string | null;
    priority?: Priority;
    typeTask?: TypeTask;
    step?: StepTask;
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
    
    const renderDetail = (label: string, value: string | React.ReactNode) => (
        <div className="text-sm">
            <span className="font-medium text-gray-400">{label}: </span> 
            <span className="font-medium text-white">{value}</span>
        </div>
    );

    const renderEpicDetail = (epic: TaskItem['epic']) => {
        if (!epic?.key) {
            return renderDetail('Épico', 'Sem associação');
        }
        
        const epicTag = (
            <Tag color="blue" className="ml-0 font-mono text-xs font-semibold">
                {`${epic.key} - ${epic.title}`}
            </Tag>
        );

        return renderDetail('Épico', epicTag);
    };

    return (
        <List
            dataSource={tasks}
            locale={{ emptyText: 'Sem tarefas' }}
            renderItem={(t) => {
                const canDelete = !t.epic;

                return (
                    <List.Item className="px-0 py-1 sm:px-2 md:py-1.5 mt-2"> 
                        <div 
                            className="group relative w-full rounded-xl shadow-lg transition-all duration-300 ease-in-out bg-[#1A112C] border border-[#1e293b] hover:shadow-xl hover:border-[#8A2BE2] p-3 md:p-4 mb-2"
                        >
                            
                            <div className="absolute right-3 top-2.5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {onEdit && (
                                    <Tooltip title="Editar" placement="top">
                                        <button
                                            aria-label="Editar atividade"
                                            onClick={() => onEdit?.(t.id)}
                                            className="text-gray-400 hover:text-[#8A2BE2] transition-colors"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                    </Tooltip>
                                )}
                                {onDelete && (
                                    <Tooltip title={!canDelete ? "Atividade associada a um épico" : "Excluir"} placement="top">
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
                                            <button 
                                                aria-label="Excluir atividade" 
                                                className={`transition-colors ${canDelete ? 'text-gray-400 hover:text-red-500' : 'text-gray-600 cursor-not-allowed'}`}
                                                disabled={!canDelete}
                                            >
                                                <FiTrash2 size={17} />
                                            </button>
                                        </Popconfirm>
                                    </Tooltip>
                                )}
                            </div>

                            <div className="mb-2 flex flex-wrap items-center gap-2 pr-16">
                                {t.priority?.name && (
                                    <Tag color={t.priority.label} className="font-semibold text-xs px-2 py-0.5">
                                        {t.priority.name}
                                    </Tag>
                                )}
                                <Tag color="geekblue" className="text-xs font-mono border-none px-2 py-0.5">
                                    {t.idTask}
                                </Tag>
                                {t.typeTask?.name && (
                                    <Tag color="magenta" className="text-xs border-none px-2 py-0.5">
                                        {t.typeTask.name}
                                    </Tag>
                                )}
                            </div>

                            <Typography.Text
                                strong
                                className="block text-lg md:text-xl font-bold leading-snug line-clamp-2 text-white"
                                title={`${t.idTask} - ${t.title}`}
                            >
                                {t.title}
                            </Typography.Text>
                            
                            <div 
                                className="mt-3 pt-2 border-t border-dashed border-gray-700 grid grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-6"
                            >
                                
                                {renderDetail('Etapa atual', t.step?.name ?? '—')}
                                {renderDetail('Prazo', t.deadline ?? 'Não preenchido')}
                                {renderDetail('Responsável', t.assignee?.name ?? 'Não preenchido')}
                                {renderEpicDetail(t.epic)}
                            </div>
                        </div>
                    </List.Item>
                );
            }}
        />
    );
};

export default TaskList;