import React from 'react';
import { Timeline, Empty, Space, Tag, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import type { RecentActivity } from '../types';

const { Text } = Typography;

interface Props {
  activities: RecentActivity[];
}

const RecentActivityWidget: React.FC<Props> = ({ activities }) => {
  const formatTime = (date: string) => {
    const now = new Date();
    const updatedDate = new Date(date);
    const diffMs = now.getTime() - updatedDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return `${diffDays}d atrás`;
  };

  const MAX_HEIGHT_CLASS = "max-h-96";

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 h-full">
      <Space align="center" className="mb-2">
        <ClockCircleOutlined className="text-yellow-500 text-lg" />
        <Text strong>Atividade Recente</Text>
      </Space>
      <div className="mt-5">
        {activities.length > 0 ? (
          <div className={`${MAX_HEIGHT_CLASS} overflow-y-auto`}>
            <Timeline
              className='mt-2'
              items={activities.map((activity) => ({
                color: 'yellow',
                children: (
                  <div className="pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag color="yellow">{activity.idTask}</Tag>
                      <Text strong className="flex-1 min-w-0 truncate">
                        {activity.title}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Text type="secondary" className="text-xs">
                        {activity.status}
                      </Text>
                      {activity.assignee && (
                        <>
                          <Text type="secondary" className="text-xs">•</Text>
                          <Text type="secondary" className="text-xs">
                            {activity.assignee}
                          </Text>
                        </>
                      )}
                      <Text type="secondary" className="text-xs">•</Text>
                      <Text type="secondary" className="text-xs">
                        {formatTime(activity.updatedAt)}
                      </Text>
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sem atividades recentes" />
        )}
      </div>
    </div>
  );
};

export default RecentActivityWidget;