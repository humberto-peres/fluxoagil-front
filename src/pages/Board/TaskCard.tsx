import { useDraggable } from '@dnd-kit/core';
import { Avatar, Card, Flex, Tag, Typography } from 'antd';
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons';

export type Task = {
	idTask: any;
	deadline: any;
	deadlineInfo: any;
	estimate: any;
	priority: any; id: string; status: string; title: string; description: string
};

type TaskCardProps = {
	task: Task;
	onEdit?: (id: string) => void;
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });

	const style = {
		transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
		transition: 'box-shadow 0.2s',
	} as React.CSSProperties;

	const stop = (e: React.PointerEvent) => e.stopPropagation();

	const actions: React.ReactNode[] = [
		<EditOutlined key="edit" onPointerDown={stop} onClick={() => onEdit?.(task.id)} className='!mr-[10px] !hover:cursor-pointer' />,
		<EllipsisOutlined key="ellipsis" onPointerDown={stop} onClick={() => onEdit?.(task.id)} className='!hover:cursor-pointer' />,
	];

	const user = "U";

	const {
		deadlineInfo
	} = task;

	return (
		<div ref={setNodeRef} {...listeners} {...attributes} style={style}>
			<Card variant="borderless" style={{ borderRadius: 4 }}>
				<Flex justify="space-between" className="!mb-[15px]">
					<div>
						<Tag color={task.priority.label}>{task.priority.name}</Tag>
						<Tag color="purple">{task.idTask}</Tag>
					</div>
					<div>
						{actions}
					</div>
				</Flex>
				<Typography.Title level={5} ellipsis={{ rows: 3, tooltip: task.title }}>{task.title}</Typography.Title>
				<Flex justify="space-between" className='!mt-[15px]'>
					<Flex vertical justify="center">
						<Typography.Text>{task.deadline}</Typography.Text>
						<Typography.Text type={deadlineInfo.type} className='!text-xs'>{deadlineInfo.label}</Typography.Text>
					</Flex>
					<div>
						<Typography.Text className='!mr-[10px]'>{task.estimate}</Typography.Text>
						<Avatar className='!bg-[#fde3cf] !text-[#f56a00]'>
							{user}
						</Avatar>
					</div>
				</Flex>
			</Card>
		</div>
	);
}
