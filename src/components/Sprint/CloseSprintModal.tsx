import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Select, Space, Typography, App, Spin } from 'antd';
import type { SprintDTO, SprintState } from '@/services/sprint.services';
import { getSprints } from '@/services/sprint.services';

type MoveTarget = { to: 'backlog' } | { to: 'sprint'; sprintId: number };

type Props = {
    open: boolean;
    sprint: SprintDTO | null;
    workspaceId?: number | null;
    confirmLoading?: boolean;
    onConfirm: (move: MoveTarget) => void | Promise<void>;
    onCancel: () => void;
};

const CloseSprintModal: React.FC<Props> = ({
    open,
    sprint,
    workspaceId,
    confirmLoading = false,
    onConfirm,
    onCancel,
}) => {
    const { message } = App.useApp();

    const [availableSprints, setAvailableSprints] = useState<SprintDTO[]>([]);
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [value, setValue] = useState<'backlog' | string>('backlog');

    const loadSprints = useCallback(async () => {
        if (!open || !workspaceId || !sprint) return;

        setOptionsLoading(true);
        try {
            const list = await getSprints({ workspaceId, state: 'open' as SprintState });
            setAvailableSprints(list.filter(s => s.id !== sprint.id));
        } catch (error: any) {
            message.error(error?.message || 'Não foi possível carregar sprints de destino. Tente novamente.');
            console.error('Erro ao carregar sprints:', error);
        } finally {
            setOptionsLoading(false);
        }
    }, [open, workspaceId, sprint, message]);

    useEffect(() => {
        loadSprints();
    }, [loadSprints]);

    useEffect(() => {
        if (open) setValue('backlog');
    }, [open]);

    const selectOptions = useMemo(
        () => [
            { label: 'Backlog', value: 'backlog' },
            ...availableSprints.map(s => ({ label: s.name, value: String(s.id) })),
        ],
        [availableSprints]
    );

    const handleOk = async () => {
        if (!sprint) return;
        const move: MoveTarget = value === 'backlog'
            ? { to: 'backlog' }
            : { to: 'sprint', sprintId: Number(value) };
        await onConfirm(move);
    };

    const isDisabled = confirmLoading || optionsLoading;

    return (
        <Modal
            open={open}
            title="Encerrar sprint"
            okText={confirmLoading ? 'Encerrando...' : 'Encerrar'}
            cancelText="Cancelar"
            onOk={handleOk}
            onCancel={onCancel}
            confirmLoading={confirmLoading}
            cancelButtonProps={{ disabled: confirmLoading }}
            maskClosable={!confirmLoading}
            keyboard={!confirmLoading}
            destroyOnHidden
        >
            {optionsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" tip="Carregando sprints..." />
                </div>
            ) : (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Typography.Paragraph>
                        Ao encerrar <strong>{sprint?.name}</strong>, as atividades que <em>não</em> estiverem na{' '}
                        <strong>última etapa</strong> serão movidas para o destino abaixo.
                        As que estiverem na última etapa permanecerão vinculadas à sprint encerrada.
                    </Typography.Paragraph>

                    <div>
                        <Typography.Text strong>Mover itens não concluídos para:</Typography.Text>
                        <Select
                            style={{ width: '100%', marginTop: 8 }}
                            size="large"
                            value={value}
                            onChange={setValue}
                            options={selectOptions}
                            showSearch
                            optionFilterProp="label"
                            disabled={isDisabled}
                        />
                    </div>
                </Space>
            )}
        </Modal>
    );
};

export default CloseSprintModal;
