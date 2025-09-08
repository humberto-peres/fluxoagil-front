import React, { useEffect } from 'react';
import { Drawer, Form, Button, Select } from 'antd';

type Workspace = { id: number; name: string };

type Props = {
	open: boolean;
	onClose: () => void;
	onApply: (values: { workspaceId?: number }) => void;
	onClear: () => void;
	workspaces: Workspace[];
	initialWorkspaceId?: number | null;
};

const BoardFilterDrawer: React.FC<Props> = ({
	open,
	onClose,
	onApply,
	onClear,
	workspaces,
	initialWorkspaceId,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (open) {
			form.setFieldsValue({
				workspaceId: initialWorkspaceId ?? undefined,
			});
		}
	}, [open, initialWorkspaceId, form]);

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
			destroyOnHidden
			footer={
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button onClick={handleClear}>Limpar</Button>
					<div style={{ display: 'flex', gap: 8 }}>
						<Button onClick={onClose}>Cancelar</Button>
						<Button type="primary" onClick={handleApply}>
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
						options={workspaces.map((ws) => ({ label: ws.name, value: ws.id }))}
						showSearch
						optionFilterProp="label"
					/>
				</Form.Item>
			</Form>
		</Drawer>
	);
};

export default BoardFilterDrawer;
