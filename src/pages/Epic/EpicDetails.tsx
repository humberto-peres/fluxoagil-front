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
import { getEpicById, type EpicDTO } from "@/services/epic.services";
import EpicTaskDrawer from "@/components/Epic/EpicTaskDrawer";
import { BiArrowBack } from "react-icons/bi";
import { HiOutlineClipboardCopy } from "react-icons/hi";

const { Text } = Typography;

const fmt = (x?: string | null) =>
    x?.trim() ? x : <span className="text-[#94a3b8]">Não preenchido</span>;

const EpicDetails: React.FC = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();

    const [loading, setLoading] = useState<boolean>(true);
    const [epic, setEpic] = useState<EpicDTO | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const epicId = Number(params.id);

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            try {
                const data = await getEpicById(epicId);
                if (!alive) return;
                setEpic(data ?? null);
            } catch {
                if (alive) setEpic(null);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [epicId]);

    const pageTitle = useMemo(() => {
        if (!epic) return "Épico";
        const prefix = epic.key ? `${epic.key} — ` : "";
        return `${prefix}${epic.title}`;
    }, [epic]);

    const goBack = () => {
        if (window.history.length > 1) navigate(-1);
        else navigate("/epic");
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            message.success("Link copiado!");
        } catch {
            message.error("Não foi possível copiar o link");
        }
    };

    const openTasks = () => setDrawerOpen(true);

    return (
        <DefaultLayout
            title={pageTitle}
            subtitle={epic?.status ? `Status: ${epic.status}` : undefined}
            extra={
                <Space>
                    <Tooltip title="Voltar">
                        <Button onClick={goBack} icon={<BiArrowBack />} />
                    </Tooltip>
                    <Tooltip title="Copiar link">
                        <Button onClick={copyLink} icon={<HiOutlineClipboardCopy />} />
                    </Tooltip>
                    {epic && (
                        <Button type="primary" onClick={openTasks}>
                            Ver tarefas do épico
                        </Button>
                    )}
                </Space>
            }
            breadcrumbItems={[
                { title: "Épicos", href: "/epic" },
                { title: epic?.key ?? "Detalhes" },
            ]}
        >
            {(() => {
                if (loading) {
                    return (
                        <Card>
                            <Skeleton active paragraph={{ rows: 6 }} />
                        </Card>
                    );
                }
                if (!epic) {
                    return (
                        <Result
                            status="404"
                            title="Épico não encontrado"
                            subTitle="Verifique se o link está correto ou se você tem acesso a esse épico."
                            extra={
                                <Button type="primary" onClick={() => navigate("/epic")}>
                                    Ir para a lista de Épicos
                                </Button>
                            }
                        />
                    );
                }
                return (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                    <div className="xl:col-span-2 space-y-12">
                        <div>
                            <Space direction="vertical">
                                <Space>
                                    <Text type="secondary">Prioridade:</Text>
                                    <Text>{epic.priority?.name || "—"}</Text>
                                </Space>
                                <Space>
                                    <Text type="secondary">Status:</Text>
                                    <Text>{epic.status || "—"}</Text>
                                </Space>
                                <Space>
                                    <Text type="secondary">Início:</Text>
                                    <Text>{fmt(epic.startDate as any)}</Text>
                                </Space>
                                <Space>
                                    <Text type="secondary">Meta:</Text>
                                    <Text>{fmt(epic.targetDate as any)}</Text>
                                </Space>
                            </Space>
                        </div>

                        <Card title="Descrição" variant="borderless">
                            <div style={{ whiteSpace: "pre-wrap" }}>
                                {epic.description ? (
                                    epic.description
                                ) : (
                                    <Text type="secondary">Sem descrição</Text>
                                )}
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-12">
                        <Card title="Detalhes" variant="borderless">
                            <Descriptions column={1} size="small" style={{ width: 140 }}>
                                <Descriptions.Item label="Chave">{epic.key || "—"}</Descriptions.Item>
                                <Descriptions.Item label="Prioridade">
                                    {fmt(epic.priority?.name)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Status">{fmt(epic.status)}</Descriptions.Item>
                                <Descriptions.Item label="Início">
                                    {fmt(epic.startDate as any)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Meta">
                                    {fmt(epic.targetDate as any)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Criado em">
                                    {fmt(epic.createdAt as any)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Atualizado em">
                                    {fmt(epic.updatedAt as any)}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card title="Ações" variant="borderless">
                            <Space wrap>
                                <Button onClick={() => navigate("/epic")}>Gerenciar épicos</Button>
                                <Button type="primary" onClick={openTasks}>
                                    Ver tarefas do épico
                                </Button>
                            </Space>

                            <Divider />
                            <Text type="secondary">
                                Dica: você pode abrir as tarefas do épico e navegar até o Board/Backlog a partir delas.
                            </Text>
                        </Card>
                    </div>
                </div>
                );
            })()}

            <EpicTaskDrawer
                open={drawerOpen}
                epicId={epic?.id ?? null}
                workspaceId={epic?.workspaceId ?? null}
                onClose={() => setDrawerOpen(false)}
            />
        </DefaultLayout>
    );
};

export default EpicDetails;
