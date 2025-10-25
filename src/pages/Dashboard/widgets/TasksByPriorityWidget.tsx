import React from 'react';
import { List, Badge, Empty, Space, Tag, Typography } from 'antd';
import { FlagOutlined } from '@ant-design/icons';
import type { PriorityCount } from '../types';

const { Text } = Typography;

interface Props {
  data: PriorityCount[];
}

const TasksByPriorityWidget: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 h-full">
      <Space align="center" className="mb-2">
        <FlagOutlined className="text-orange-500 text-lg" />
        <Text strong>Por Prioridade</Text>
      </Space>
      <div className="mt-2">
        {data.length > 0 ? (
          <List
            dataSource={data}
            renderItem={(item) => (
              <List.Item className="px-0 hover:bg-white/5 rounded px-2 transition-colors">
                <div className="flex w-full items-center justify-between">
                  <Tag color={item.label || 'default'}>{item.name}</Tag>
                  <Badge count={item.count} showZero />
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sem tarefas" />
        )}
      </div>
    </div>
  );
};

export default TasksByPriorityWidget;