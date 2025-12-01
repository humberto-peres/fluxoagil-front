import React, { useEffect, useState } from 'react';
import { Button, Flex, Form, Input, App, Typography, Spin } from 'antd';
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

        setSubmitting(true);
        try {
            await signIn(values);
            message.success(`Bem-vindo, ${values.username}!`);
            navigate('/dashboard', { replace: true });
        } catch (error: any) {
            const errorMessage = error?.message || 'Usuário ou senha inválidos. Tente novamente.';
            message.error(errorMessage);

            // Limpa apenas a senha em caso de erro
            form.setFieldsValue({ password: '' });
        } finally {
            setSubmitting(false);
        }
    };

    const isBusy = authLoading || submitting || !!user;

    if (authLoading) {
        return (
            <div className="py-12 flex justify-center items-center">
                <Spin size="large" tip="Verificando autenticação..." />
            </div>
        );
    }

    if (user) {
        return (
            <div className="py-12 text-center">
                <Typography.Text className="text-lg opacity-90">
                    Redirecionando para o dashboard...
                </Typography.Text>
            </div>
        );
    }

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
                rules={[
                    { required: true, message: 'Por favor, insira seu usuário' }
                ]}
            >
                <Input
                    size="large"
                    placeholder="Digite seu usuário"
                    prefix={<FaUserAlt className="opacity-70 mr-1.5" />}
                    autoFocus
                    disabled={isBusy}
                />
            </Form.Item>

            <Form.Item<FieldType>
                name="password"
                label="Senha"
                rules={[
                    { required: true, message: 'Por favor, insira sua senha' },
                    { min: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
                ]}
            >
                <Input.Password
                    size="large"
                    placeholder="Digite sua senha"
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
                        loading={submitting}
                        disabled={isBusy}
                    >
                        {submitting ? 'Entrando...' : 'Entrar'}
                    </Button>

                    <Typography.Text className="text-center opacity-90">
                        Não tem uma conta?{' '}
                        <Link
                            to="/signup"
                            className="font-medium hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                if (isBusy) {
                                    e.preventDefault();
                                }
                            }}
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
