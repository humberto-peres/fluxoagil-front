import React from 'react';
import { Space, Typography } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import type { Sprint } from '../types';

const { Text } = Typography;

interface Props {
  sprint: Sprint | null;
}

const SprintInfoWidget: React.FC<Props> = ({ sprint }) => {
  return (
    <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/10 backdrop-blur-sm border border-violet-500/30 rounded-xl p-6 h-full">
      <Space align="center" className="mb-2">
        <ThunderboltOutlined className="text-violet-500 text-lg" />
        <Text strong>Sprint Ativa</Text>
      </Space>
      <div className="mt-2">
        {sprint ? (
          <Space direction="vertical" size={2}>
            <Text className="text-base">{sprint.name}</Text>
            {sprint.startDate && sprint.endDate && (
              <Text type="secondary" className="text-xs">
                {new Date(sprint.startDate).toLocaleDateString('pt-BR')} → {new Date(sprint.endDate).toLocaleDateString('pt-BR')}
              </Text>
            )}
          </Space>
        ) : (
          <Text type="secondary">Nenhuma sprint ativa</Text>
        )}
      </div>
    </div>
  );
};

export default SprintInfoWidget;