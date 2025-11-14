import React from 'react';
import { Collapse, Flex, Space, Tag, Tooltip } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { FiEdit2 } from 'react-icons/fi';
import { FaRegCircleStop, FaCirclePlay } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

export type SprintItem = {
    id: number;
    name: string;
    startDate: string | null;
    endDate: string | null;
    isActive: boolean;
    activatedAt: string | null;
    closedAt: string | null;
    workspaceId: number;
};

type Props = {
    sprints: SprintItem[];
    onEdit: (sprint: SprintItem) => void;
    onActivate: (sprint: SprintItem) => void;
    onClose: (sprint: SprintItem) => void;
    onDelete?: (sprint: SprintItem) => void;
    contentBySprintId?: Record<number, React.ReactNode>;
    backlogContent?: React.ReactNode;
    autoOpenSprintId?: number | null;
};

const SprintList: React.FC<Props> = ({
    sprints,
    onEdit,
    onActivate,
    onClose,
    onDelete,
    contentBySprintId,
    backlogContent,
    autoOpenSprintId,
}) => {
    const items: CollapseProps['items'] = [
        ...sprints.map((s) => {
            let tag: React.ReactNode = null;
            if (s.isActive) {
                tag = <Tag color="success">Ativa</Tag>;
            } else if (s.closedAt) {
                tag = <Tag>Encerrada</Tag>;
            }

            return {
                key: `sprint-${s.id}`,
                label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{s.name}</span>
                        {tag}
                        <span style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                            <Space size="middle">
                                {!s.isActive && !s.closedAt && (
                                    <Tooltip title="Ativar sprint">
                                        <FaCirclePlay
                                            size={17}
                                            onClick={(e) => { e.stopPropagation(); onActivate(s); }}
                                        />
                                    </Tooltip>
                                )}
                                {s.isActive && (
                                    <Tooltip title="Encerrar sprint">
                                        <FaRegCircleStop
                                            size={17}
                                            onClick={(e) => { e.stopPropagation(); onClose(s); }}
                                        />
                                    </Tooltip>
                                )}
                                <Tooltip title="Editar">
                                    <FiEdit2
                                        size={17}
                                        onClick={(e) => { e.stopPropagation(); onEdit(s); }}
                                    />
                                </Tooltip>
                                {onDelete && (
                                    <Tooltip title="Deletar">
                                        <MdDelete
                                            size={17}
                                            onClick={(e) => { e.stopPropagation(); onDelete(s); }}
                                        />
                                    </Tooltip>
                                )}
                            </Space>
                        </span>
                    </div>
                ),
                style: { marginBottom: 16, background: 'rgba(56, 56, 56, 0.5)', opacity: 1, borderRadius: 8, border: 'none' },
                children: (
                    <div>
                        <Flex style={{ marginBottom: 16, marginLeft: 24, fontSize: 12, opacity: 0.8 }}>
                            <Space size={50}>
                                <div>
                                    <div>{s.startDate ? `Início planejado: ${s.startDate}` : 'Início planejado: —'}</div>
                                    <div>{s.endDate ? `Término planejado: ${s.endDate}` : 'Término planejado: —'}</div>
                                </div>
                                <div>
                                    <div>{s.activatedAt ? `Ativada em: ${s.activatedAt}` : 'Ativada em: —'}</div>
                                    <div>{s.closedAt ? `Encerrada em: ${s.closedAt}` : 'Encerrada em: —'}</div>
                                </div>
                            </Space>
                        </Flex>
                        {contentBySprintId?.[s.id] ?? <div>Sem tarefas nesta sprint.</div>}
                    </div>
                ),
            } as NonNullable<CollapseProps['items']>[number];

        }),
        {
            key: 'backlog',
            label: <strong>Backlog</strong>,
            style: { marginBottom: 16, background: 'rgba(56, 56, 56, 0.5)', borderRadius: 8, border: 'none' },
            children: backlogContent ?? <div>Sem tarefas no backlog.</div>,
        },
    ];

    const defaultActiveKey = Array.from(new Set([
        ...sprints.filter(s => s.isActive).map(s => `sprint-${s.id}`),
        ...(autoOpenSprintId ? [`sprint-${autoOpenSprintId}`] : []),
    ]));

    const expandIcon = ({ isActive }: { isActive: boolean }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
    );

    return (
        <Collapse
            bordered={false}
            expandIcon={expandIcon}
            items={items}
            defaultActiveKey={defaultActiveKey}
        />
    );
};

export default SprintList;
