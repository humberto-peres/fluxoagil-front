import React, { useEffect, useMemo, useState } from "react";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { useNavigate, useParams } from "react-router-dom";
import {
    App,
    Card,
    Descriptions,
    Space,
    Button,
    Skeleton,
    Result,
    Typography,
    Divider,
    Tooltip,
} from "antd";
import { getTaskById, type TaskDTO } from "@/services/task.services";
import { MdOpenInNew } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { HiOutlineClipboardCopy } from "react-icons/hi";
import { FiActivity, FiList } from "react-icons/fi"
import { useOpenEpic } from "@/hooks/useOpenEpic";

const { Text } = Typography;

const fmt = (x?: string | null) => (x && x.trim() ? x : <span className="text-[#94a3b8]">Não preenchido</span>);

const TaskDetails: React.FC = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();

    const [loading, setLoading] = useState<boolean>(true);
    const [task, setTask] = useState<TaskDTO | null>(null);

    const taskId = Number(params.id);
    const openEpic = useOpenEpic();

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            try {
                const data = await getTaskById(taskId);
                if (!alive) return;
                setTask(data ?? null);
            } catch {
                if (alive) setTask(null);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [taskId]);

    const pageTitle = useMemo(() => {
        if (!task) return "Atividade";
        const prefix = task.idTask ? `${task.idTask} — ` : "";
        return `${prefix}${task.title}`;
    }, [task]);

    const goBack = () => {
        if (window.history.length > 1) navigate(-1);
        else navigate("/board");
    };

    const openOnBoard = () => {
        if (!task) return;
        navigate("/board", {
            state: {
                focus: {
                    type: "task",
                    id: task.id,
                    meta: { sprintId: task.sprint?.id ?? null },
                },
            },
        });
    };

    const openOnBacklog = () => {
        if (!task) return;
        navigate("/backlog", {
            state: {
                focus: {
                    type: "task",
                    id: task.id,
                    meta: { sprintId: task.sprint?.id ?? null },
                },
            },
        });
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            message.success("Link copiado!");
        } catch {
            message.error("Não foi possível copiar o link");
        }
    };

    return (
        <DefaultLayout
            title={pageTitle}
            subtitle={task?.typeTask?.name}
            extra={
                <Space>
                    <Tooltip title="Voltar">
                        <Button onClick={goBack} icon={<BiArrowBack />} />
                    </Tooltip>
                    <Tooltip title="Copiar link">
                        <Button onClick={copyLink} icon={<HiOutlineClipboardCopy />} />
                    </Tooltip>
                </Space>
            }
            breadcrumbItems={[
                { title: "Atividades", href: "/task" },
                { title: task?.idTask },
            ]}
        >
            {loading ? (
                <Card>
                    <Skeleton active paragraph={{ rows: 6 }} />
                </Card>
            ) : !task ? (
                <Result
                    status="404"
                    title="Atividade não encontrada"
                    subTitle="Verifique se o link está correto ou se você tem acesso a essa atividade."
                    extra={
                        <Button type="primary" onClick={() => navigate("/board")}>
                            Ir para o Board
                        </Button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                    {/* Coluna principal */}
                    <div className="xl:col-span-2 space-y-12">
                        <div>
                            <Space direction='vertical'>
                                <Space wrap size="small">
                                    {task.sprint?.id ? (
                                        <Space>
                                            <Space><FiList color="green" /> Sprint - {task.sprint.name}</Space>
                                        </Space>
                                    ) : (
                                        <Space><FiActivity color="orange" /> Backlog</Space>
                                    )}
                                </Space>
                                <Space>
                                    <Text type="secondary">Etapa:</Text>
                                    <Text>{task.step?.name}</Text>
                                </Space>
                                <Space>
                                    <Text type="secondary">Prioridade:</Text>
                                    <Text>{task.priority?.name}</Text>
                                </Space>
                                <Space>
                                    <Text type="secondary">Tipo de atividade:</Text>
                                    <Text>{task.typeTask?.name}</Text>
                                </Space>
                                {task.epic ? (
                                    <Space>
                                        <Text type="secondary">Vinculado ao épico:</Text>
                                        <Button size="small" onClick={() => openEpic(task.epic!.id, { from: 'task-details' })}>
                                            {task.epic.key} — {task.epic.title}
                                        </Button>
                                    </Space>
                                ) : (
                                    <Text type="secondary">Sem épico vinculado</Text>
                                )}
                            </Space>
                        </div>

                        <Card title="Descrição" variant="borderless">
                            <div style={{ whiteSpace: "pre-wrap" }}>
                                {task.description ? (
                                    task.description
                                ) : (
                                    <Text type="secondary">Sem descrição</Text>
                                )}
                            </div>
                        </Card>

                        {/* espaço para Comentários / Histórico etc. */}
                    </div>

                    {/* Coluna lateral */}
                    <div className="space-y-12">
                        <Card title="Detalhes" variant="borderless">
                            <Descriptions column={1} size="small" labelStyle={{ width: 140 }}>
                                <Descriptions.Item label="Código">
                                    {task.idTask}
                                </Descriptions.Item>
                                <Descriptions.Item label="Responsável">
                                    {fmt(task.assignee?.name)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Reporter">
                                    {fmt(task.reporter?.name)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Estimativa">
                                    {fmt(task.estimate)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Início">
                                    {fmt(task.startDate)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Prazo">
                                    {fmt(task.deadline)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Workspace">
                                    {task.workspace?.key}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card title="Ações" variant="borderless">
                            <Space wrap>
                                <Button type="primary" onClick={openOnBoard} icon={<MdOpenInNew />}>
                                    Ver no Board
                                </Button>
                                <Button onClick={openOnBacklog}>Ver no Backlog</Button>
                            </Space>

                            <Divider />
                            <Text type="secondary">
                                Dica: para editar rapidamente, abra no Board e clique na atividade.
                            </Text>
                        </Card>
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
};

export default TaskDetails;
