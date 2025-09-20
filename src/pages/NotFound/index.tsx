import React from 'react';
import { Layout, Result, Button, Space, Typography } from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Content, Footer } = Layout;

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <Layout className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(138,43,226,0.12),_transparent_60%)]">
            <Content className="flex items-center justify-center px-4">
                <Result
                    status="404"
                    title="Página não encontrada"
                    subTitle={
                        <Typography.Paragraph className="!text-base !mt-2">
                            Não encontramos <Typography.Text code>{pathname}</Typography.Text>.
                            Verifique o endereço ou volte para um lugar conhecido.
                        </Typography.Paragraph>
                    }
                    extra={
                        <Space wrap>
                            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                                Voltar
                            </Button>
                            <Button type="primary" icon={<HomeOutlined />} onClick={() => navigate('/')}>
                                Ir para o início
                            </Button>
                        </Space>
                    }
                />
            </Content>

            <Footer className="text-center text-xs opacity-70">
                Fluxo Ágil ©2025
            </Footer>
        </Layout>
    );
};

export default NotFound;
