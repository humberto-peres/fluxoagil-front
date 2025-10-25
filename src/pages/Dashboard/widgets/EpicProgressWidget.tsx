import React from 'react';
import { Space, Progress, Typography, Empty } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import type { EpicProgress } from '../types';

const { Text } = Typography;

interface Props {
  epics: EpicProgress[];
}

const EpicProgressWidget: React.FC<Props> = ({ epics }) => {
  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 h-full">
      <Space align="center" className="mb-2">
        <RocketOutlined className="text-purple-500 text-lg" />
        <Text strong>Progresso dos Épicos</Text>
      </Space>
      {epics.length > 0 ? (
        <Space direction="vertical" className="w-full" size="large">
          {epics.slice(0, 6).map((epic) => (
            <div key={epic.id} className="hover:bg-white/5 rounded p-2 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <Text strong className="block truncate">{epic.title}</Text>
                  <Text type="secondary" className="text-xs">{epic.key}</Text>
                </div>
                <Text type="secondary" className="ml-2">{epic.pct}%</Text>
              </div>
              <Progress
                percent={epic.pct}
                strokeColor={{
                  '0%': '#8b5cf6',
                  '100%': '#6366f1',
                }}
                showInfo={false}
                strokeWidth={8}
              />
              <Text type="secondary" className="text-xs block mt-1">
                {epic.done} de {epic.total} tarefas concluídas
              </Text>
            </div>
          ))}
        </Space>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sem épicos" />
      )}
    </div>
  );
};

export default EpicProgressWidget;