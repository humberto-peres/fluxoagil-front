import React, { useEffect, useState } from 'react';
import { Button, Flex, Form, Input, App, Typography } from 'antd';
import { FaLock, FaUserAlt } from "react-icons/fa";
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

type FieldType = { username: string; password: string };

const FormLogin: React.FC = () => {
    const { user, loading: authLoading, signIn } = useAuth();
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [form] = Form.useForm<FieldType>();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && user) {
            navigate('/dashboard', { replace: true });
        }
    }, [authLoading, user, navigate]);

    const onFinish = async (values: FieldType) => {
        if (user) {
            message.info('Você já está autenticado.');
            return;
        }

        try {
            setSubmitting(true);
            await signIn(values);
            message.success(`Bem-vindo, ${values.username}!`);
            navigate('/dashboard', { replace: true });
        } catch {
            message.error('Usuário/senha inválidos');
        } finally {
            setSubmitting(false);
        }
    };

    const isBusy = authLoading || submitting || !!user;

    return (
        <Form<FieldType>
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
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
                    disabled={isBusy}
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
                    disabled={isBusy}
                />
            </Form.Item>

            <Form.Item noStyle>
                <Flex vertical gap={8}>
                    <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        block
                        loading={authLoading || submitting}
                        disabled={!!user}
                    >
                        Entrar
                    </Button>

                    <Typography.Text className="text-center opacity-90">
                        Não tem uma conta?{' '}
                        <Link
                            to="/signup"
                            className="font-medium hover:opacity-100 transition-opacity"
                        >
                            Criar conta
                        </Link>
                    </Typography.Text>
                </Flex>
            </Form.Item>
        </Form>
    );
};

export default FormLogin;
