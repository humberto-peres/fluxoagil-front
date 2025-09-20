import React from 'react';
import { Spin, Typography } from 'antd';

type PageLoaderProps = {
    text?: string;
};

const PageLoader: React.FC<PageLoaderProps> = ({ text = 'Carregando…' }) => {
    return (
        <div
            className="
        min-h-[60vh] grid place-items-center p-6
      "
            role="status"
            aria-live="polite"
        >
            <div className="flex flex-col items-center gap-3">
                <Spin size="large" />
                <Typography.Text type="secondary" className="!mt-1">
                    {text}
                </Typography.Text>
            </div>
        </div>
    );
};

export default PageLoader;
