import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Drawer, List, Button, Space, Typography, Divider, Select, Popconfirm, Flex, App, Grid, Spin } from 'antd';
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

    const [epic, setEpic] = useState<EpicWithTasksDTO | null>(null);
    const [allTasks, setAllTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selecting, setSelecting] = useState<number[]>([]);
    const [saving, setSaving] = useState(false);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const load = useCallback(async () => {
        if (!open || !epicId || !workspaceId) {
            setEpic(null);
            setAllTasks([]);
            return;
        }
        setLoading(true);
        try {
            const [e, t] = await Promise.all([
                getEpicById(epicId),
                getTasks({ workspaceId }),
            ]);
            setEpic(e);
            setAllTasks(t || []);
        } catch (error: any) {
            message.error(error?.message || 'Erro ao carregar dados do épico. Tente novamente.');
            console.error('Erro ao carregar dados do épico:', error);
        } finally {
            setLoading(false);
        }
    }, [open, epicId, workspaceId, message]);

    useEffect(() => {
        load();
    }, [load]);

    const tasksInEpic = useMemo(() => epic?.tasks ?? [], [epic]);
    const tasksAvailable = useMemo(
        () => (allTasks || []).filter((t) => !t.epicId),
        [allTasks]
    );

    const associateSelected = async () => {
        if (!epic) return;
        setSaving(true);
        try {
            await Promise.all(selecting.map((id) => updateTask(id, { epicId: epic.id })));
            message.success('Atividades associadas com sucesso!');
            setSelecting([]);
            load();
        } catch (error: any) {
            message.error(error?.message || 'Erro ao associar atividades. Tente novamente.');
            console.error('Erro ao associar atividades:', error);
        } finally {
            setSaving(false);
        }
    };

    const unassign = async (taskId: number) => {
        setRemovingId(taskId);
        try {
            await updateTask(taskId, { epicId: null });
            message.success('Atividade removida do épico com sucesso!');
            load();
        } catch (error: any) {
            message.error(error?.message || 'Erro ao remover atividade do épico. Tente novamente.');
            console.error('Erro ao remover atividade:', error);
        } finally {
            setRemovingId(null);
        }
    };

    const isDisabled = saving || removingId !== null;

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
            maskClosable={!isDisabled}
            keyboard={!isDisabled}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" tip="Carregando dados do épico..." />
                </div>
            ) : (
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <div>
                        <Typography.Text strong>Associar atividades</Typography.Text>
                        <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                            <Flex gap={8} align="center">
                                <Select
                                    mode="multiple"
                                    size="large"
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
                                    disabled={isDisabled}
                                />
                                <Button
                                    size="large"
                                    type="primary"
                                    onClick={associateSelected}
                                    loading={saving}
                                    disabled={!selecting.length || isDisabled}
                                >
                                    <IoIosLink />
                                </Button>
                            </Flex>
                        </Space>
                    </div>

                    <Divider style={{ margin: '8px 0' }} />

                    <div>
                        <List
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
                                            disabled={isDisabled}
                                        >
                                            <Button
                                                type="link"
                                                danger
                                                loading={removingId === item.id}
                                                disabled={isDisabled && removingId !== item.id}
                                            >
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
            )}
        </Drawer>
    );
};

export default EpicTaskDrawer;
