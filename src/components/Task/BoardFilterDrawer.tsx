import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Drawer, Form, Button, Select, Switch, App, Grid, Spin } from 'antd';
import { getMyWorkspaces, canAccessWorkspace } from '@/services/workspace.services';

type BaseValues = {
	workspaceId?: number;
	sprintId?: number | null;
	showClosed?: boolean;
};

type Props = {
	open: boolean;
	onClose: () => void;
	onApply: (values: BaseValues) => void;
	onClear: () => void;
	initialWorkspaceId?: number | null;
	showSprintSelector?: boolean;
	sprintOptions?: Array<{ label: string; value: number }>;
	initialSprintId?: number | null;
	showClosedToggle?: boolean;
	initialShowClosed?: boolean;
};

const { useBreakpoint } = Grid;

const BoardFilterDrawer: React.FC<Props> = ({
	open,
	onClose,
	onApply,
	onClear,
	initialWorkspaceId,
	showSprintSelector = false,
	sprintOptions = [],
	initialSprintId = null,
	showClosedToggle = false,
	initialShowClosed = false,
}) => {
	const { message } = App.useApp();
	const screens = useBreakpoint();
	const isMobile = !screens.md;

	const [form] = Form.useForm<BaseValues>();
	const [workspaces, setWorkspaces] = useState<Array<{ id: number; name: string }>>([]);
	const [loading, setLoading] = useState(false);
	const [applying, setApplying] = useState(false);

	const validatedRef = useRef<number | null | undefined>(undefined);

	useEffect(() => {
		let alive = true;
		(async () => {
			if (initialWorkspaceId == null) return;
			if (validatedRef.current === initialWorkspaceId) return;

			try {
				const { allowed } = await canAccessWorkspace(Number(initialWorkspaceId));
				if (!alive) return;

				validatedRef.current = initialWorkspaceId;
				if (!allowed) {
					onClear();
					message.info('Você não faz parte da equipe desse workspace. Filtro limpo.');
				}
			} catch (error: any) {
				if (alive) {
					console.error('Erro ao validar workspace:', error);
				}
			}
		})();
		return () => {
			alive = false;
		};
	}, [initialWorkspaceId, onClear, message]);

	useEffect(() => {
		let alive = true;
		(async () => {
			setLoading(true);
			try {
				const list = await getMyWorkspaces();
				if (!alive) return;
				setWorkspaces(list.map((w: any) => ({ id: Number(w.id), name: String(w.name) })));
			} catch (error: any) {
				if (alive) {
					message.error(error?.message || 'Erro ao carregar workspaces. Tente novamente.');
					console.error('Erro ao carregar workspaces:', error);
				}
			} finally {
				if (alive) setLoading(false);
			}
		})();
		return () => {
			alive = false;
		};
	}, [message]);

	useEffect(() => {
		if (!open) return;
		form.setFieldsValue({
			workspaceId: initialWorkspaceId ?? undefined,
			sprintId: initialSprintId ?? undefined,
			showClosed: initialShowClosed,
		});
	}, [open, initialWorkspaceId, initialSprintId, initialShowClosed, form]);

	const workspaceOptions = useMemo(
		() => workspaces.map((ws) => ({ label: ws.name, value: ws.id })),
		[workspaces]
	);

	const handleApply = async () => {
		setApplying(true);
		try {
			const values = await form.validateFields();
			onApply({
				workspaceId: values.workspaceId,
				sprintId: showSprintSelector ? values.sprintId ?? null : undefined,
				showClosed: showClosedToggle ? Boolean(values.showClosed) : undefined,
			});
		} catch (error: any) {
			console.error('Erro ao validar filtros:', error);
		} finally {
			setApplying(false);
		}
	};

	const handleClear = () => {
		form.resetFields();
		onClear();
	};

	return (
		<Drawer
			title="Filtros"
			open={open}
			onClose={onClose}
			placement={isMobile ? 'bottom' : 'right'}
			height={isMobile ? '70vh' : undefined}
			width={isMobile ? '100%' : 420}
			destroyOnHidden
			maskClosable={!applying}
			keyboard={!applying}
			footer={
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button onClick={handleClear} disabled={applying}>
						Limpar
					</Button>
					<div style={{ display: 'flex', gap: 8 }}>
						<Button onClick={onClose} disabled={applying}>
							Cancelar
						</Button>
						<Button type="primary" onClick={handleApply} loading={applying}>
							{applying ? 'Aplicando...' : 'Aplicar'}
						</Button>
					</div>
				</div>
			}
		>
			{loading ? (
				<div style={{ textAlign: 'center', padding: '40px 0' }}>
					<Spin size="large" tip="Carregando workspaces..." />
				</div>
			) : (
				<Form form={form} layout="vertical">
					<Form.Item label="Workspace" name="workspaceId">
						<Select
							size="large"
							placeholder="Selecione um Workspace"
							allowClear
							options={workspaceOptions}
							showSearch
							optionFilterProp="label"
							disabled={applying}
						/>
					</Form.Item>

					{showSprintSelector && sprintOptions.length > 0 && (
						<Form.Item
							label="Sprint ativa"
							name="sprintId"
							tooltip="Se o workspace mudar, a sprint selecionada pode ser ignorada."
						>
							<Select
								size="large"
								allowClear
								placeholder="Escolha a sprint ativa"
								options={sprintOptions}
								showSearch
								optionFilterProp="label"
								disabled={applying}
							/>
						</Form.Item>
					)}

					{showClosedToggle && (
						<Form.Item
							label="Mostrar sprints encerradas"
							name="showClosed"
							valuePropName="checked"
						>
							<Switch disabled={applying} />
						</Form.Item>
					)}
				</Form>
			)}
		</Drawer>
	);
};

export default BoardFilterDrawer;
