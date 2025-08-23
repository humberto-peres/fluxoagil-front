import { ConfigProvider } from 'antd';
import React from 'react';
import type { ReactNode } from "react";

interface ConfigurationProviderProps {
  children: ReactNode;
}

const ConfigurationProvider: React.FC<ConfigurationProviderProps> = ({ children }) => {
  return (
    <ConfigProvider>
      {children}
    </ConfigProvider>
  );
};

export default ConfigurationProvider;
