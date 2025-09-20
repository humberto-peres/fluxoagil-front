import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Avatar, Card, Flex, Tag, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';

export type Task = {
	typeTask: { name: string };
	idTask: string;
	deadline: string;
	deadlineInfo: { type?: 'secondary' | 'success' | 'warning' | 'danger' | 'warning' | undefined; label: string };
	estimate: string;
	priority: { name: string; label: string };
	id: string;
	status: string;
	title: string;
	description: string;
};

type TaskCardProps = {
	task: Task;
	onEdit?: (id: string) => void;
	overlay?: boolean;
	overlaySize?: { width: number; height: number };
};

export function TaskCard({ task, onEdit, overlay, overlaySize }: TaskCardProps) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: task.id,
		data: { task },
	});

	const dragging = !!transform && !overlay;

	const style: React.CSSProperties = {
		transform: dragging ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
		transition: 'box-shadow 0.2s',
		zIndex: overlay ? 9999 : dragging ? 1000 : 'auto',
		position: dragging ? 'relative' : undefined,
		pointerEvents: overlay || dragging ? 'none' : 'auto',
		touchAction: 'none',
		width: overlay ? overlaySize?.width : '100%',
		height: overlay ? overlaySize?.height : undefined,
		maxWidth: overlay ? '92vw' : undefined,
		boxSizing: 'border-box',
	};

	const stop = (e: React.PointerEvent) => e.stopPropagation();

	const actions: React.ReactNode[] = [
		<EditOutlined
			key="edit"
			onPointerDown={stop}
			onClick={() => onEdit?.(task.id)}
			className="mr-2.5 cursor-pointer hover:opacity-80"
		/>,
	];

	const user = 'U';
	const { deadlineInfo } = task;

	const wrapperProps = overlay ? {} : { ...listeners, ...attributes };
	const refProp = overlay ? undefined : (setNodeRef as any);

	return (
		<div ref={refProp} {...wrapperProps} style={style} className="w-full" data-task-id={task.id}>
			<Card variant="borderless" style={{ borderRadius: 6 }} className="w-full">
				<Flex justify="space-between" style={{ marginBottom: 15 }}>
					<div className="flex flex-wrap gap-1.5">
						<Tag color="purple">{task.idTask}</Tag>
						<Tag color={task.priority.label}>{task.priority.name}</Tag>
						<Tag color="magenta">{task.typeTask.name}</Tag>
					</div>
					<div>{actions}</div>
				</Flex>

				<Typography.Title level={5} ellipsis={{ rows: 3, tooltip: task.title }} className="!mb-0">
					{task.title}
				</Typography.Title>

				<Flex justify="space-between" style={{ marginTop: 15 }}>
					<Flex vertical justify="center">
						<Typography.Text>{task.deadline}</Typography.Text>
						<Typography.Text type={deadlineInfo.type} className="text-xs">
							{deadlineInfo.label}
						</Typography.Text>
					</Flex>
					<div className="flex items-center">
						<Typography.Text className="mr-2.5">{task.estimate}</Typography.Text>
						<Avatar className="bg-[#fde3cf] text-[#f56a00]">{user}</Avatar>
					</div>
				</Flex>
			</Card>
		</div>
	);
}

export default TaskCard;
