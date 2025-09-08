import React from 'react';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import { Form, Typography } from 'antd';
import FormUser from '@/pages/Auth/User/FormUser';

const Configuration: React.FC = () => {
    const [form] = Form.useForm();

    const handleFormSubmit = (values: any) => {
    };

    return (
        <DefaultLayout
            title="Configurações de usuário"
        >
            <div className="p-[20px]">
                <span id="user-data">
                    <Typography.Title level={3}>Dados de Usuário</Typography.Title>
                </span>
                <div className="mt-[20px]">
                    <FormUser form={form} onFinish={handleFormSubmit} addressFieldsDisabled={false} />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Configuration;
