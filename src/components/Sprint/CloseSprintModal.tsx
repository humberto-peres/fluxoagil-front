import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Select, Space, Typography, App } from 'antd';
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
    confirmLoading,
    onConfirm,
    onCancel,
}) => {
    const { message } = App.useApp();
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [availableSprints, setAvailableSprints] = useState<SprintDTO[]>([]);
    const [value, setValue] = useState<'backlog' | string>('backlog');

    useEffect(() => {
        let alive = true;
        (async () => {
            if (!open || !workspaceId || !sprint) return;
            setOptionsLoading(true);
            try {
                const list = await getSprints({ workspaceId, state: 'open' as SprintState });
                if (!alive) return;
                setAvailableSprints(list.filter(s => s.id !== sprint.id));
            } catch {
                if (alive) message.error('Não foi possível carregar sprints de destino');
            } finally {
                if (alive) setOptionsLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [open, workspaceId, sprint, message]);

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

    return (
        <Modal
            open={open}
            title="Encerrar sprint"
            okText="Encerrar"
            cancelText="Cancelar"
            onOk={handleOk}
            onCancel={onCancel}
            confirmLoading={!!confirmLoading}
        >
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
                        value={value}
                        onChange={setValue}
                        options={selectOptions}
                        loading={optionsLoading}
                        showSearch
                        optionFilterProp="label"
                    />
                </div>
            </Space>
        </Modal>
    );
};

export default CloseSprintModal;
