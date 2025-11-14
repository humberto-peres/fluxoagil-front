import React from 'react';
import { Empty, Space, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import type { StatusCount } from '../types';
const { Text } = Typography;

interface Props {
  data: StatusCount[];
}

const TasksByStatusWidget: React.FC<Props> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 h-full">
      <Space align="center" className="mb-2">
        <CheckCircleOutlined className="text-green-500 text-lg" />
        <Text strong>Por Status</Text>
      </Space>
      <div className="mt-2">
        {data.length > 0 ? (
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {data.map((item, i) => {
                  const prevSum = data.slice(0, i).reduce((s, d) => s + d.count, 0);
                  const offset = (prevSum / total) * 100;
                  const percent = (item.count / total) * 100;
                  return (
                    <circle
                      key={`${item.name}-${i}`}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={colors[i % colors.length]}
                      strokeWidth="20"
                      strokeDasharray={`${percent * 2.51} ${251}`}
                      strokeDashoffset={-offset * 2.51}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Text className="text-white text-2xl font-bold block">{total}</Text>
                  <Text className="text-gray-400 text-xs">tarefas</Text>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {data.slice(0, 5).map((item, i) => (
                <div key={`${item.name}-${item.count}-${i}`} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                  <Text className="text-white text-sm">{item.name}</Text>
                  <Text className="text-gray-400 text-sm ml-auto">{item.count}</Text>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sem tarefas" />
        )}
      </div>
    </div>
  );
};

export default TasksByStatusWidget;