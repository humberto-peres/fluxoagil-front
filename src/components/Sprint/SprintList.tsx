import React from 'react';
import { Collapse, Button, Space, Tag } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';

export type SprintItem = {
    id: number;
    name: string;
    startDate: string | null;
    endDate: string | null;
    isActive: boolean;
};

type Props = {
    sprints: SprintItem[];
    onEdit: (sprint: SprintItem) => void;
    onActivate: (sprint: SprintItem) => void;
    onClose: (sprint: SprintItem) => void;
    onDelete?: (sprint: SprintItem) => void;
    contentBySprintId?: Record<number, React.ReactNode>;
    backlogContent?: React.ReactNode;
};

const SprintList: React.FC<Props> = ({
    sprints,
    onEdit,
    onActivate,
    onClose,
    onDelete,
    contentBySprintId,
    backlogContent,
}) => {
    const items: CollapseProps['items'] = [
        ...sprints.map((s) => ({
            key: `sprint-${s.id}`,
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ opacity: s.isActive ? 1 : 0.7 }}>{s.name}</span>
                    {s.isActive ? <Tag color="success">Ativa</Tag> : <Tag>Inativa</Tag>}
                    <span style={{ marginLeft: 'auto' }}>
                        <Space size="small">
                            {!s.isActive && s.startDate && s.endDate && (
                                <Button size="small" onClick={(e) => { e.stopPropagation(); onActivate(s); }}>
                                    Ativar
                                </Button>
                            )}
                            {s.isActive && (
                                <Button size="small" danger onClick={(e) => { e.stopPropagation(); onClose(s); }}>
                                    Encerrar
                                </Button>
                            )}
                            <Button size="small" onClick={(e) => { e.stopPropagation(); onEdit(s); }}>
                                Editar
                            </Button>
                            {onDelete && (
                                <Button size="small" danger onClick={(e) => { e.stopPropagation(); onDelete(s); }}>
                                    Excluir
                                </Button>
                            )}
                        </Space>
                    </span>
                </div>
            ),
            style: {
                marginBottom: 16,
                background: s.isActive ? '#383838' : '#2b2b2b',
                opacity: s.isActive ? 1 : 0.85,
                borderRadius: 8,
                border: 'none',
            },
            children: (
                <div>
                    <div style={{ marginBottom: 8, fontSize: 12, opacity: 0.8 }}>
                        {s.startDate ? `Início: ${s.startDate}` : 'Início: —'} • {s.endDate ? `Término: ${s.endDate}` : 'Término: —'}
                    </div>
                    {contentBySprintId?.[s.id] ?? <div>Sem tarefas nesta sprint.</div>}
                </div>
            ),
        })),
        {
            key: 'backlog',
            label: <strong>Backlog</strong>,
            style: {
                marginBottom: 16,
                background: '#383838',
                borderRadius: 8,
                border: 'none',
            },
            children: backlogContent ?? <div>Sem tarefas no backlog.</div>,
        },
    ];

    return (
        <Collapse
            bordered={false}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            items={items}
        />
    );
};

export default SprintList;
