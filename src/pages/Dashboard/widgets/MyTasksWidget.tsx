import React from 'react';
import { List, Empty, Space, Tag, Tooltip, Typography } from 'antd';
import { FireOutlined } from '@ant-design/icons';
import type { MyTask } from '../types';

const { Text } = Typography;

interface Props {
  tasks: MyTask[];
}

const MyTasksWidget: React.FC<Props> = ({ tasks }) => {
  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return 'Sem prazo';
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`;
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    return `${diffDays} dias`;
  };

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 h-full">
      <Space align="center" className="mb-2">
        <FireOutlined className="text-red-500 text-lg" />
        <Text strong>Minhas Tarefas</Text>
      </Space>
      <div className="mt-2">
        {tasks.length > 0 ? (
          <List
            dataSource={tasks}
            renderItem={(task) => {
              const overdue = isOverdue(task.deadline);
              return (
                <List.Item className="!py-2 px-0 hover:bg-white/5 rounded px-2 transition-colors">
                  <div className="flex flex-col w-full gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <Text className="block truncate">{task.title}</Text>
                        <Text type="secondary" className="text-xs">
                          {task.idTask} • {task.status}
                        </Text>
                      </div>
                      <Space size="small">
                        {task.priority && (
                          <Tag color={task.priority.label || 'default'} className="m-0">
                            {task.priority.name}
                          </Tag>
                        )}
                        <Tooltip title={task.deadline ? new Date(task.deadline).toLocaleDateString('pt-BR') : 'Sem prazo'}>
                          <Tag color={overdue ? 'red' : 'default'} className="m-0">
                            {formatDeadline(task.deadline)}
                          </Tag>
                        </Tooltip>
                      </Space>
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sem tarefas atribuídas" />
        )}
      </div>
    </div>
  );
};

export default MyTasksWidget;