import React, { useEffect, useMemo, useState } from 'react';
import { Drawer, Form, Button, Select, Input, Divider, Switch, App, Space } from 'antd';
import { getMyWorkspaces, getWorkspaceById } from '@/services/workspace.services';
import {
    getGithubIntegration,
    upsertGithubIntegration,
    listGithubRules,
    createGithubRule,
    updateGithubRule,
    deleteGithubRule,
} from '@/services/integrationsGithub.services';

type Props = {
    open: boolean;
    onClose: () => void;
};

const GithubIntegrationDrawer: React.FC<Props> = ({ open, onClose }) => {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [wsOptions, setWsOptions] = useState<Array<{ id: number; name: string }>>([]);
    const [stepOptions, setStepOptions] = useState<Array<{ label: string; value: number }>>([]);
    const [loading, setLoading] = useState(false);
    const [rules, setRules] = useState<any[]>([]);
    const [integrationId, setIntegrationId] = useState<number | null>(null);

    const selectedWorkspaceId = Form.useWatch('workspaceId', form);

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                const list = await getMyWorkspaces();
                setWsOptions(list.map((w: any) => ({ id: Number(w.id), name: String(w.name) })));
            } catch {
                message.error('Não foi possível carregar seus workspaces');
            }
        })();
    }, [open, message]);

    useEffect(() => {
        if (!selectedWorkspaceId) return;
        (async () => {
            setLoading(true);
            try {
                const ws = await getWorkspaceById(Number(selectedWorkspaceId));
                const steps = (ws.steps || []).map((s: any) => ({
                    label: s.step?.name ?? s.name ?? `Step ${s.stepId}`,
                    value: Number(s.stepId),
                }));
                setStepOptions(steps);

                const integ = await getGithubIntegration(Number(selectedWorkspaceId));
                form.setFieldsValue({
                    repoFullName: integ?.repoFullName,
                    secret: integ?.secret,
                });
                setIntegrationId(integ?.id ?? null);

                const r = integ ? await listGithubRules(integ.id) : [];
                setRules(r || []);
            } catch {
            } finally {
                setLoading(false);
            }
        })();
    }, [selectedWorkspaceId]);

    const wsSelectOptions = useMemo(
        () => wsOptions.map(w => ({ label: w.name, value: w.id })),
        [wsOptions]
    );

    async function handleSaveIntegration() {
        try {
            const values = await form.validateFields(['workspaceId', 'repoFullName', 'secret']);
            const saved = await upsertGithubIntegration({
                workspaceId: Number(values.workspaceId),
                repoFullName: values.repoFullName,
                secret: values.secret,
            });
            setIntegrationId(saved.id);
            message.success('Integração salva');
        } catch (e: any) {
            message.error(e?.message || 'Erro ao salvar integração');
        }
    }

    async function handleCreateRule() {
        try {
            if (!integrationId) {
                message.warning('Salve a integração antes de criar regras.');
                return;
            }
            const rule = await createGithubRule(integrationId, {
                event: 'pull_request',
                conditionsJson: { state: 'closed', merged: true, base: 'main' },
                actionJson: { moveToStepId: stepOptions[0]?.value },
                active: true,
            });
            setRules(prev => [rule, ...prev]);
            message.success('Regra criada');
        } catch {
            message.error('Erro ao criar regra');
        }
    }

    async function handleUpdateRule(ruleId: number, patch: any) {
        try {
            const upd = await updateGithubRule(ruleId, patch);
            setRules(prev => prev.map(r => (r.id === ruleId ? upd : r)));
        } catch {
            message.error('Erro ao atualizar regra');
        }
    }

    async function handleDeleteRule(ruleId: number) {
        try {
            await deleteGithubRule(ruleId);
            setRules(prev => prev.filter(r => r.id !== ruleId));
            message.success('Regra removida');
        } catch {
            message.error('Erro ao remover regra');
        }
    }

    return (
        <Drawer
            title="Integrações • GitHub"
            open={open}
            onClose={onClose}
            width={560}
            destroyOnHidden
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Workspace" name="workspaceId" rules={[{ required: true }]}>
                    <Select
                        placeholder="Selecione o workspace"
                        options={wsSelectOptions}
                        showSearch
                        optionFilterProp="label"
                    />
                </Form.Item>

                <Form.Item label="Repositório (org/repo)" name="repoFullName" rules={[{ required: true }]}>
                    <Input placeholder="ex.: minha-org/meu-repo" />
                </Form.Item>

                <Form.Item
                    label="Webhook Secret"
                    name="secret"
                    tooltip="Usado para validar a assinatura do webhook (X-Hub-Signature-256)"
                    rules={[{ required: true }]}
                >
                    <Input.Password placeholder="segredo-do-webhook" />
                </Form.Item>

                <Space>
                    <Button type="primary" onClick={handleSaveIntegration} loading={loading}>
                        Salvar integração
                    </Button>
                    <Button
                        onClick={() =>
                            navigator.clipboard.writeText(
                                `${import.meta.env.VITE_API_URL}/integrations/github/webhook`
                            )
                        }
                    >
                        Copiar URL do webhook
                    </Button>
                </Space>

                <Divider />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Regras (GitHub ➜ Board)</h4>
                    <Button onClick={handleCreateRule} disabled={!integrationId}>
                        Nova regra
                    </Button>
                </div>

                <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
                    {rules.map((r) => (
                        <div key={r.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
                            <Space wrap>
                                <Select
                                    value={r.event}
                                    style={{ width: 160 }}
                                    onChange={(v) => handleUpdateRule(r.id, { event: v })}
                                    options={[
                                        { label: 'pull_request', value: 'pull_request' },
                                        { label: 'push', value: 'push' },
                                        { label: 'check_suite', value: 'check_suite' },
                                        { label: 'workflow_run', value: 'workflow_run' },
                                    ]}
                                />
                                {r.event === 'pull_request' && (
                                    <>
                                        <Select
                                            value={r.conditionsJson?.state ?? 'closed'}
                                            style={{ width: 140 }}
                                            onChange={(v) =>
                                                handleUpdateRule(r.id, { conditionsJson: { ...r.conditionsJson, state: v } })
                                            }
                                            options={[
                                                { label: 'state: open', value: 'open' },
                                                { label: 'state: closed', value: 'closed' },
                                            ]}
                                        />
                                        <Select
                                            value={r.conditionsJson?.base ?? 'main'}
                                            style={{ width: 140 }}
                                            onChange={(v) =>
                                                handleUpdateRule(r.id, { conditionsJson: { ...r.conditionsJson, base: v } })
                                            }
                                            options={[
                                                { label: 'base: main', value: 'main' },
                                                { label: 'base: develop', value: 'develop' },
                                            ]}
                                        />
                                        <Select
                                            value={r.conditionsJson?.merged ?? true}
                                            style={{ width: 160 }}
                                            onChange={(v) =>
                                                handleUpdateRule(r.id, {
                                                    conditionsJson: { ...r.conditionsJson, merged: v },
                                                })
                                            }
                                            options={[
                                                { label: 'merged: true', value: true },
                                                { label: 'merged: false', value: false },
                                            ]}
                                        />
                                    </>
                                )}
                                <Select
                                    style={{ width: 220 }}
                                    value={r.actionJson?.moveToStepId}
                                    onChange={(v) =>
                                        handleUpdateRule(r.id, { actionJson: { ...r.actionJson, moveToStepId: v } })
                                    }
                                    options={stepOptions}
                                    placeholder="Mover para etapa"
                                />
                                <Switch
                                    checked={r.active}
                                    onChange={(checked) => handleUpdateRule(r.id, { active: checked })}
                                />
                                <Button danger onClick={() => handleDeleteRule(r.id)}>
                                    Remover
                                </Button>
                            </Space>
                        </div>
                    ))}
                    {rules.length === 0 && <div>Nenhuma regra ainda.</div>}
                </div>
            </Form>
        </Drawer>
    );
};

export default GithubIntegrationDrawer;
