import React from 'react';
import { Button, Divider, List, Popconfirm, Space, Tag, Tooltip, Typography } from 'antd';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { IoIosLink } from 'react-icons/io';
import { type EpicDTO as BaseEpicDTO } from '@/services/epic.services';

type EpicDTO = BaseEpicDTO & { _count?: { tasks: number } };

type EpicListProps = {
    epics: EpicDTO[];
    loading: boolean;
    openDrawer: (id: number) => void;
    onEdit: (epic: EpicDTO) => void;
    onDelete: (epic: EpicDTO) => void;
};

const EpicList: React.FC<EpicListProps> = ({
    epics,
    loading,
    openDrawer,
    onEdit,
    onDelete,
}) => {
    return (
        <List
            loading={loading}
            dataSource={epics}
            pagination={{ pageSize: 8, align: 'end' }}
            renderItem={(item, index) => {
                const hasTasks = (item._count?.tasks ?? 0) > 0;

                return (
                    <>
                        <List.Item
                            actions={[
                                <Space size="middle" key="actions">
                                    <Tooltip title="Editar">
                                        <FiEdit2
                                            size={20}
                                            onClick={() => onEdit(item)}
                                            style={{ cursor: 'pointer' }}
                                            title="Editar"
                                        />
                                    </Tooltip>
                                    <Tooltip title='Excluir'>
                                        <Popconfirm
                                            title="Excluir equipe?"
                                            description={
                                                hasTasks
                                                ? 'Não é possível excluir, existem  atividades associadas'
                                                : 'Esta ação não pode ser desfeita.'
                                            }
                                            okText="Excluir"
                                            okButtonProps={{ danger: true, disabled: hasTasks }}
                                            cancelText="Cancelar"
                                            onConfirm={() => onDelete(item)}
                                        >
                                            <FiTrash2 size={20} style={{ cursor: 'pointer' }} />
                                        </Popconfirm>
                                    </Tooltip>                                                                        
                                    <Tooltip title="Abrir vínculos do épico">
                                        <IoIosLink
                                            size={20}
                                            onClick={() => openDrawer(item.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </Tooltip>
                                </Space>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 8,
                                            background: '#d01f1fff',
                                            display: 'grid',
                                            placeItems: 'center',
                                            fontWeight: 600,
                                            color: '#fff',
                                        }}
                                        aria-hidden
                                    >
                                        {index + 1}
                                    </div>
                                }
                                title={
                                    <Space wrap>
                                        <Typography.Text strong>{item.key}</Typography.Text>
                                        <Typography.Text>{item.title}</Typography.Text>
                                        {typeof item._count?.tasks === 'number' && (
                                            <Tag>{item._count.tasks} atividade(s)</Tag>
                                        )}
                                    </Space>
                                }
                                description={
                                    <Space wrap>
                                        {item.priority?.name ? (
                                            <Tag color={item.priority.label}>{item.priority.name}</Tag>
                                        ) : null}
                                        {item.startDate ? (
                                            <Typography.Text>Início: {item.startDate}</Typography.Text>
                                        ) : null}
                                        {item.targetDate ? (
                                            <Typography.Text>Meta: {item.targetDate}</Typography.Text>
                                        ) : null}
                                    </Space>
                                }
                            />
                        </List.Item>
                        <Divider />
                    </>
                );
            }}
        />
    );
};

export default EpicList;
