import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import styles from './Column.module.css';
import { Divider } from 'antd';

export type Task = { id: string; status: string; title: string; description: string };
export type Column = { id: string; title: string };

type ColumnProps = {
	column: Column;
	tasks: Task[];
	onEditTask?: (id: string) => void;
};

export function Column({ column, tasks, onEditTask }: ColumnProps) {
	const { setNodeRef, isOver } = useDroppable({ id: column.id });

	return (
		<div className={styles.column}>
			<div>
				<h3 className={styles.title}>{column.title}</h3>
				<p className={styles.subTitle}>
					{tasks.length} {tasks.length > 1 ? 'Atividades' : 'Atividade'} na etapa
				</p>
				<Divider style={{ borderWidth: '2px', margin: '16px 0' }} />
			</div>
			<div ref={setNodeRef} className={`${styles.dropZone} ${isOver ? styles.isOver : ''}`}>
				{tasks.map((task) => (
					<TaskCard key={task.id} task={task} onEdit={onEditTask} />
				))}
			</div>
		</div>
	);
}
