import React from 'react';
import { Button, Divider, List, Popconfirm, Space, Tag, Tooltip, Typography, Grid } from 'antd';
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

const { Text } = Typography;
const { useBreakpoint } = Grid;

const EpicList: React.FC<EpicListProps> = ({
    epics,
    loading,
    openDrawer,
    onEdit,
    onDelete,
}) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    return (
        <List
            loading={loading}
            dataSource={epics}
            pagination={{ pageSize: 8, responsive: true }}
            renderItem={(item, index) => {
                const hasTasks = (item._count?.tasks ?? 0) > 0;

                return (
                    <>
                        <List.Item
                            actions={[
                                <Space size="small" key="actions">
                                    <Tooltip title="Editar">
                                        <Button type="text" aria-label="Editar épico" icon={<FiEdit2 size={18} />} onClick={() => onEdit(item)} />
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <Popconfirm
                                            title="Excluir épico?"
                                            description={
                                                hasTasks
                                                    ? 'Não é possível excluir: existem atividades associadas.'
                                                    : 'Esta ação não pode ser desfeita.'
                                            }
                                            okText="Excluir"
                                            okButtonProps={{ danger: true, disabled: hasTasks }}
                                            cancelText="Cancelar"
                                            onConfirm={() => onDelete(item)}
                                        >
                                            <Button type="text" aria-label="Excluir épico" icon={<FiTrash2 size={18} />} />
                                        </Popconfirm>
                                    </Tooltip>
                                    <Tooltip title="Abrir vínculos do épico">
                                        <Button type="text" aria-label="Vínculos do épico" icon={<IoIosLink size={18} />} onClick={() => openDrawer(item.id)} />
                                    </Tooltip>
                                </Space>,
                            ]}
                            data-epic-id={item.id}
                        >
                            <List.Item.Meta
                                avatar={
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 8,
                                            background: '#d01f1f',
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
                                        <Text strong>{item.key}</Text>
                                        {isMobile ? <div><Text>{item.title}</Text></div> : <Text>{item.title}</Text>}
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
                                            <Text>Início: {item.startDate}</Text>
                                        ) : null}
                                        {item.targetDate ? (
                                            <Text>Meta: {item.targetDate}</Text>
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
