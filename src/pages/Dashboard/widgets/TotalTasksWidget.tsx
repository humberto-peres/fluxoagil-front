import React from 'react';
import { Statistic, Typography } from 'antd';
import { ApartmentOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Props {
  total: number;
  completed: number;
}

const TotalTasksWidget: React.FC<Props> = ({ total, completed }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 h-full">
      <Statistic 
        title="Total de Tarefas" 
        value={total} 
        prefix={<ApartmentOutlined className="text-blue-500" />}
      />
      <Text type="secondary" className="text-xs mt-1 block">
        {completed} concluídas ({total > 0 ? Math.round((completed / total) * 100) : 0}%)
      </Text>
    </div>
  );
};

export default TotalTasksWidget;