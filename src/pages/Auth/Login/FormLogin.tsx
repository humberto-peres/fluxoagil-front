import React from 'react';
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

    const onFinish = async (values: FieldType) => {
        try {
            await signIn(values);
            message.success(`Bem-vindo, ${values.username}!`);
            navigate("/");
        } catch {
            message.error('Usuário/senha inválidos');
        }
    };

    return (
        <Form form={form} initialValues={{ remember: true }} onFinish={onFinish} autoComplete="off">
            <Form.Item<FieldType>
                name="username"
                rules={[{ required: true, message: 'Username não preenchido!' }]}
            >
                <Input size='large' placeholder='Username' prefix={<FaUserAlt color='var(--text)' style={{ marginRight: 5 }} />} />
            </Form.Item>

            <Form.Item<FieldType>
                name="password"
                rules={[{ required: true, message: 'Senha não preenchida!' }]}
            >
                <Input.Password size='large' placeholder='Senha' prefix={<FaLock color='var(--text)' style={{ marginRight: 5 }} />} />
            </Form.Item>

            <Form.Item>
                <Flex align='center' justify='space-between' vertical>
                    <Button type="primary" size='large' htmlType="submit" block style={{ marginBottom: 8 }}>
                        Entrar
                    </Button>
                    <a href='/forgot-password'>Esqueci minha senha</a>
                </Flex>
            </Form.Item>
        </Form>
    );
};

export default FormLogin;
