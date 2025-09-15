import React, { useEffect, useMemo, useState } from 'react';
import { Drawer, Form, Button, Select, App } from 'antd';
import { getMyWorkspaces } from '@/services/workspace.services';

type Props = {
	open: boolean;
	onClose: () => void;
	onApply: (values: { workspaceId?: number }) => void;
	onClear: () => void;
	initialWorkspaceId?: number | null;
};

const BoardFilterDrawer: React.FC<Props> = ({
	open,
	onClose,
	onApply,
	onClear,
	initialWorkspaceId,
}) => {
	const { message } = App.useApp();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [workspaces, setWorkspaces] = useState<Array<{ id: number; name: string }>>([]);

	useEffect(() => {
		let alive = true;
		(async () => {
			setLoading(true);
			try {
				const list = await getMyWorkspaces();
				if (!alive) return;
				setWorkspaces(list.map(w => ({ id: w.id, name: w.name })));

				if (initialWorkspaceId && !list.some(w => w.id === initialWorkspaceId)) {
					onClear();
					message.info('Você não faz parte da equipe desse workspace. Filtro limpo.');
				}
			} catch {
				if (initialWorkspaceId != null) onClear();
			} finally {
				if (alive) setLoading(false);
			}
		})();
		return () => { alive = false; };
	}, [initialWorkspaceId, onClear, message]);

	useEffect(() => {
		if (!open) return;
		form.setFieldsValue({
			workspaceId: workspaces.some(w => w.id === initialWorkspaceId!)
				? initialWorkspaceId
				: undefined,
		});
	}, [open, initialWorkspaceId, workspaces, form]);

	const options = useMemo(
		() => workspaces.map(ws => ({ label: ws.name, value: ws.id })),
		[workspaces]
	);

	const handleApply = async () => {
		const values = await form.validateFields();
		onApply(values);
	};

	const handleClear = () => {
		form.resetFields();
		onClear();
	};

	return (
		<Drawer
			title="Filtros do Board"
			open={open}
			onClose={onClose}
			destroyOnClose
			footer={
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button onClick={handleClear}>Limpar</Button>
					<div style={{ display: 'flex', gap: 8 }}>
						<Button onClick={onClose}>Cancelar</Button>
						<Button type="primary" onClick={handleApply} loading={loading}>
							Aplicar
						</Button>
					</div>
				</div>
			}
		>
			<Form form={form} layout="vertical">
				<Form.Item label="Workspace" name="workspaceId">
					<Select
						size="large"
						placeholder="Selecione um Workspace"
						allowClear
						options={options}
						showSearch
						optionFilterProp="label"
						loading={loading}
					/>
				</Form.Item>
			</Form>
		</Drawer>
	);
};

export default BoardFilterDrawer;
