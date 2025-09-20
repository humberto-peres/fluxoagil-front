import React, { useState } from 'react';
import { Button, Flex, Form, Input, App } from 'antd';
import { FaLock, FaUserAlt } from "react-icons/fa";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

type FieldType = { username: string; password: string };

const FormLogin: React.FC = () => {
    const { signIn } = useAuth();
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: FieldType) => {
        try {
            setLoading(true);
            await signIn(values);
            message.success(`Bem-vindo, ${values.username}!`);
            navigate("/dashboard");
        } catch {
            message.error('Usuário/senha inválidos');
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
            initialValues={{ remember: true }}
        >
            <Form.Item<FieldType>
                name="username"
                label="Usuário"
                rules={[{ required: true, message: 'Username não preenchido!' }]}
            >
                <Input
                    size="large"
                    placeholder="Username"
                    prefix={<FaUserAlt className="opacity-70 mr-1.5" />}
                    autoFocus
                />
            </Form.Item>

            <Form.Item<FieldType>
                name="password"
                label="Senha"
                rules={[{ required: true, message: 'Senha não preenchida!' }]}
            >
                <Input.Password
                    size="large"
                    placeholder="Senha"
                    prefix={<FaLock className="opacity-70 mr-1.5" />}
                />
            </Form.Item>

            <Form.Item noStyle>
                <Flex vertical gap={8}>
                    <Button type="primary" size="large" htmlType="submit" block loading={loading}>
                        Entrar
                    </Button>
                    <a href="/forgot-password" className="text-center opacity-90 hover:opacity-100">
                        Esqueci minha senha
                    </a>
                </Flex>
            </Form.Item>
        </Form>
    );
};

export default FormLogin;
