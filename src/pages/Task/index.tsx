import React, { useCallback, useEffect, useState } from 'react';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import { App, Avatar, List, Space, Tooltip } from 'antd';
import { getAllTasks, type TaskDTO } from '@/services/task.services';
import { MdOpenInNew } from "react-icons/md";
import { useOpenTask } from '@/hooks/useOpenTask';

function Task() {
	const [tasks, setTasks] = useState<TaskDTO[]>([]);
	const { message } = App.useApp();
	const openTask = useOpenTask();

	const loadTasks = useCallback(async () => {
		try {
			const apiTasks: TaskDTO[] = await getAllTasks();
			setTasks(apiTasks || []);
		} catch (error) {
			message.error('Erro ao buscar as tarefas');
			setTasks([]);
		}
	}, [message]);

	useEffect(() => {
		loadTasks();
	}, [loadTasks]);

	return (
		<DefaultLayout title="Atividades">
			<List
				itemLayout="vertical"
				size="large"
				pagination={{ pageSize: 20 }}
				dataSource={tasks}
				renderItem={(item, index) => (
					<List.Item
						key={item.id}
						extra={
							<Tooltip title={'Abrir dados'} placement='left'>
								<MdOpenInNew
									size={20}
									className='cursor-pointer'
									onClick={() => openTask(item.id, { from: 'tasks-list' })}
								/>
							</Tooltip>
						}
					>
						<List.Item.Meta
							avatar={
								<Avatar className="bg-[#e85d04] text-white shadow-lg">
									{index + 1}
								</Avatar>
							}
							title={`${item.idTask} - ${item.title}`}
							description={
								<Space size={'large'}>
									<p>Tipo da tarefa: {item.typeTask?.name}</p>
									{item.estimate && <p>Estimativa: {item.estimate}</p>}
									{item.deadline && <p>Prazo: {item.deadline}</p>}
									{item.assignee?.name && <p>Responsável: {item.assignee?.name}</p>}
								</Space>
							}
						/>
					</List.Item>
				)}
			/>
		</DefaultLayout>
	);
}

export default Task;
