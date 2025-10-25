import React from 'react';
import { Statistic, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Props {
  count: number;
}

const OverdueWidget: React.FC<Props> = ({ count }) => {
  return (
    <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 h-full">
      <Statistic
        title="Atrasadas"
        value={count}
        prefix={<ExclamationCircleOutlined className="text-red-500" />}
        valueStyle={{ color: count > 0 ? '#ff4d4f' : undefined }}
      />
      <Text type="secondary" className="text-xs mt-1 block">
        Prazos vencidos
      </Text>
    </div>
  );
};

export default OverdueWidget;