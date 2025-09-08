import React from 'react';
import { List, Tag, Typography, Tooltip } from 'antd';

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
};

type Props = {
    tasks: TaskItem[];
};

const TaskList: React.FC<Props> = ({ tasks }) => {
    return (
        <List
            size="small"
            dataSource={tasks}
            locale={{ emptyText: 'Sem tarefas' }}
            renderItem={(t) => (
                <List.Item
                    style={{ borderBlockEnd: '1px solid rgba(255,255,255,0.08)', padding: '8px 0' }}
                >
                    <div style={{ width: '100%' }}>
                        <Tooltip title={t.title}>
                            <Typography.Text
                                style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}
                                strong
                            >
                               {t.idTask} - {t.title}
                            </Typography.Text>
                        </Tooltip>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6, fontSize: 12 }}>
                            {t.step?.name && <Tag>{t.step.name}</Tag>}
                            {t.typeTask?.name && <Tag>{t.typeTask.name}</Tag>}
                            {t.priority?.name && (
                                <Tag color={t.priority.label}>{t.priority.name}</Tag>
                            )}
                            {t.deadline && <Tag>Prazo: {t.deadline}</Tag>}
                            {t.assignee?.name && <Tag>Resp.: {t.assignee.name}</Tag>}
                        </div>
                    </div>
                </List.Item>
            )}
        />
    );
};

export default TaskList;
