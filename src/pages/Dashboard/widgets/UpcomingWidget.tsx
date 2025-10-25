import React from 'react';
import { Statistic, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Props {
  count: number;
}

const UpcomingWidget: React.FC<Props> = ({ count }) => {
  return (
    <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm border border-orange-500/30 rounded-xl p-4 h-full">
      <Statistic
        title="Próximos 7 Dias"
        value={count}
        prefix={<CalendarOutlined className="text-orange-500" />}
      />
      <Text type="secondary" className="text-xs mt-1 block">
        Prazos se aproximam
      </Text>
    </div>
  );
};

export default UpcomingWidget;