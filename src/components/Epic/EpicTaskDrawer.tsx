import React, { useEffect, useMemo, useState } from 'react';
import { Drawer, List, Button, Space, Typography, Divider, Select, Popconfirm, Flex, App, Grid } from 'antd';
import { getEpicById, type EpicWithTasksDTO } from '@/services/epic.services';
import { getTasks, updateTask } from '@/services/task.services';
import { IoIosLink } from "react-icons/io";

type Props = {
    open: boolean;
    epicId: number | null;
    workspaceId: number | null;
    onClose: () => void;
};

const { useBreakpoint } = Grid;

const EpicTaskDrawer: React.FC<Props> = ({ open, epicId, workspaceId, onClose }) => {
    const { message } = App.useApp();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [loading, setLoading] = useState(false);
    const [epic, setEpic] = useState<EpicWithTasksDTO | null>(null);
    const [allTasks, setAllTasks] = useState<any[]>([]);
    const [selecting, setSelecting] = useState<number[]>([]);
    const [saving, setSaving] = useState(false);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const load = async () => {
        if (!open || !epicId || !workspaceId) {
            setEpic(null);
            setAllTasks([]);
            return;
        }
        try {
            setLoading(true);
            const [e, t] = await Promise.all([
                getEpicById(epicId),
                getTasks({ workspaceId }),
            ]);
            setEpic(e);
            setAllTasks(t || []);
        } catch {
            message.error('Erro ao carregar dados do épico');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, epicId, workspaceId]);

    const tasksInEpic = useMemo(() => epic?.tasks ?? [], [epic]);
    const tasksAvailable = useMemo(
        () => (allTasks || []).filter((t) => !t.epicId),
        [allTasks]
    );

    const associateSelected = async () => {
        if (!epic) return;
        try {
            setSaving(true);
            await Promise.all(selecting.map((id) => updateTask(id, { epicId: epic.id })));
            message.success('Atividades associadas');
            setSelecting([]);
            await load();
        } catch {
            message.error('Erro ao associar atividades');
        } finally {
            setSaving(false);
        }
    };

    const unassign = async (taskId: number) => {
        try {
            setRemovingId(taskId);
            await updateTask(taskId, { epicId: null });
            message.success('Atividade removida do épico');
            await load();
        } catch {
            message.error('Erro ao remover atividade do épico');
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <Drawer
            open={open}
            onClose={onClose}
            placement={isMobile ? 'bottom' : 'right'}
            height={isMobile ? '85vh' : undefined}
            width={isMobile ? '100%' : 520}
            title={
                epic ? (
                    <Space>
                        <Typography.Text strong>{epic.key + ' - ' + epic.title}</Typography.Text>
                    </Space>
                ) : (
                    'Épico'
                )
            }
            destroyOnHidden
            styles={{
                body: { padding: 16 },
                header: { padding: 16 },
            }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                    <Typography.Text strong>Associar atividades</Typography.Text>
                    <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                        <Flex gap={8} align="center">
                            <Select
                                mode="multiple"
                                size='large'
                                value={selecting}
                                onChange={setSelecting as any}
                                style={{ width: '100%' }}
                                placeholder="Selecione atividades sem épico"
                                options={tasksAvailable.map((t) => ({
                                    label: t.idTask + ' - ' + t.title,
                                    value: t.id,
                                }))}
                                maxTagCount="responsive"
                                showSearch
                                optionFilterProp="label"
                            />
                            <Button size='large' type="primary" onClick={associateSelected} loading={saving} disabled={!selecting.length}>
                                <IoIosLink />
                            </Button>
                        </Flex>
                    </Space>
                </div>

                <Divider style={{ margin: '8px 0' }} />

                <div>
                    <List
                        loading={loading}
                        dataSource={tasksInEpic}
                        locale={{ emptyText: 'Sem atividades no épico' }}
                        style={{ marginTop: 8 }}
                        header={<Typography.Text strong>Atividades do épico</Typography.Text>}
                        bordered
                        renderItem={(item: any) => (
                            <List.Item
                                actions={[
                                    <Popconfirm
                                        key="rm"
                                        title="Remover do épico?"
                                        okText="Remover"
                                        cancelText="Cancelar"
                                        onConfirm={() => unassign(item.id)}
                                    >
                                        <Button type="link" danger loading={removingId === item.id}>
                                            Remover
                                        </Button>
                                    </Popconfirm>,
                                ]}
                            >
                                <List.Item.Meta
                                    title={item.title}
                                    description={
                                        <Space split={<span>•</span>} wrap>
                                            {item.step?.name ? <span>{item.step.name}</span> : null}
                                            {item.priority?.name ? <span>{item.priority.name}</span> : null}
                                            {item.deadline ? <span>Prazo: {item.deadline}</span> : null}
                                        </Space>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </Space>
        </Drawer>
    );
};

export default EpicTaskDrawer;
