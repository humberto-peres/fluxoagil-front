import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Divider, Typography } from 'antd';
import TaskCard  from './TaskCard';
import type { Task } from './TaskCard';

export type Column = { id: string; title: string };

type ColumnProps = {
	column: Column;
	tasks: Task[];
	onEditTask?: (id: string) => void;
};

export function Column({ column, tasks, onEditTask }: ColumnProps) {
	const { setNodeRef, isOver } = useDroppable({ id: column.id });

	return (
		<div
			className="
        snap-start
        min-w-[92vw] sm:min-w-[80vw] md:min-w-[340px] md:w-[340px]
        min-h-[calc(100vh-320px)] md:min_h-[calc(100vh-387px)]
        flex flex-col p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur
      "
		>
			<div>
				<Typography.Title level={4} ellipsis={{ rows: 1, tooltip: column.title }}>
					{column.title}
				</Typography.Title>
				<p className="text-[11px] text-gray-300">
					{tasks.length} {tasks.length > 1 ? 'Atividades' : 'Atividade'} na etapa
				</p>
				<Divider style={{ borderWidth: 2, margin: '16px 0' }} />
			</div>

			<div
				ref={setNodeRef}
				className={[
					'flex-1 flex flex-col gap-4 p-2 rounded-lg transition-[background,box-shadow] duration-200',
					isOver
						? 'bg-purple-500/20 ring-2 ring-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]'
						: 'bg-transparent',
				].join(' ')}
			>
				{tasks.map((task) => (
					<TaskCard key={task.id} task={task} onEdit={onEditTask} />
				))}
			</div>
		</div>
	);
}

export default Column;
