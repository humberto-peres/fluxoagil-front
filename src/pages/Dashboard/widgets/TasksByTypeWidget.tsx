import React from 'react';
import { List, Badge, Empty, Space, Typography } from 'antd';
import { TagsOutlined } from '@ant-design/icons';
import type { TypeCount } from '../types';

const { Text } = Typography;

interface Props {
  data: TypeCount[];
}

const TasksByTypeWidget: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 h-full">
      <Space align="center" className="mb-2">
        <TagsOutlined className="text-purple-500 text-lg" />
        <Text strong>Por tipo</Text>
      </Space>
      <div className="mt-2">
        {data.length > 0 ? (
          <List
            dataSource={data}
            renderItem={(item) => (
              <List.Item className="px-0 hover:bg-white/5 rounded px-2 transition-colors">
                <div className="flex w-full items-center justify-between">
                  <span className="truncate">{item.name}</span>
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

export default TasksByTypeWidget;