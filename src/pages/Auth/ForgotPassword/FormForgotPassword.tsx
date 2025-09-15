import React, { useState } from 'react';
import { Button, Flex, Form, Input, App } from 'antd';
import { FaUserAlt } from "react-icons/fa";

type FieldType = { email: string };

const FormForgotPassword: React.FC = () => {
    const { message } = App.useApp();
    const [form] = Form.useForm<FieldType>();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: FieldType) => {
        try {
            setLoading(true);
            // TODO: API real aqui
            // await api.forgotPassword(values.email)
            message.success('Se existir uma conta com esse e-mail, enviaremos um link de redefinição.');
            form.resetFields();
        } catch {
            message.error('Não foi possível processar sua solicitação agora.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item<FieldType>
                label="E-mail"
                name="email"
                rules={[
                    { required: true, message: 'E-mail não preenchido!' },
                    { type: 'email', message: 'Informe um e-mail válido.' },
                ]}
            >
                <Input
                    size="large"
                    placeholder="seu@email.com"
                    prefix={<FaUserAlt className="opacity-70 mr-1.5" />}
                    autoFocus
                />
            </Form.Item>

            <Form.Item noStyle>
                <Flex vertical gap={8}>
                    <Button type="primary" size="large" htmlType="submit" block loading={loading}>
                        Enviar link de redefinição
                    </Button>
                    <div className="text-center">
                        <span className="opacity-80">Lembrou a senha? </span>
                        <a href="/login">Voltar para o login</a>
                    </div>
                </Flex>
            </Form.Item>
        </Form>
    );
};

export default FormForgotPassword;
