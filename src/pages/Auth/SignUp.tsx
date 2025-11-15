import React, { useState } from "react";
import { Layout, Card, Form, Input, Button, Row, Col, Typography, App, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import PublicHeader from "@/components/Layout/PublicHeader";
import { registerUser } from "@/services/auth.services";
import cepUtils from "@/utils/cepUtils";

const { Content } = Layout;
const { Title, Text } = Typography;

type FieldType = {
    name: string;
    username: string;
    email: string;
    password: string;
    confirm: string;
    cep?: string;
    state?: string;
    city?: string;
    street?: string;
    neighborhood?: string;
    number?: number;
};

const SignUp: React.FC = () => {
    const [form] = Form.useForm<FieldType>();
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [addressDisabled, setAddressDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [searchingCep, setSearchingCep] = useState(false);

    const onSearchCep = async (value?: string) => {
        if (!value) return;

        setSearchingCep(true);
        try {
            const a = await cepUtils.fetchAddress(value);
            form.setFieldsValue({
                city: a.city,
                state: a.state,
                neighborhood: a.neighborhood,
                street: a.street,
            });
            setAddressDisabled(false);
            message.success("CEP encontrado com sucesso!");
        } catch {
            setAddressDisabled(true);
            form.setFieldsValue({
                city: undefined,
                state: undefined,
                neighborhood: undefined,
                street: undefined,
            });
            message.error("CEP não encontrado. Verifique e tente novamente.");
        } finally {
            setSearchingCep(false);
        }
    };

    const onFinish = async (values: FieldType) => {
        const payload = {
            name: values.name,
            username: values.username,
            email: values.email,
            password: values.password,
            address: values.cep
                ? {
                    zipCode: values.cep,
                    street: values.street,
                    city: values.city,
                    state: values.state,
                    neighborhood: values.neighborhood,
                    number: values.number,
                }
                : undefined,
        };

        setLoading(true);
        try {
            await registerUser(payload);
            message.success("Conta criada com sucesso! Você já pode entrar.");
            navigate("/login");
        } catch (e: any) {
            message.error(e?.message || "Falha ao cadastrar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900/20 to-slate-900">
            <PublicHeader />
            <Content className="px-4 md:px-6 py-10">
                <Card
                    variant='borderless'
                    className="max-w-3xl mx-auto bg-white/5 border border-white/10 backdrop-blur"
                    title={<Title level={3} className="!mb-0">Criar conta</Title>}
                >
                    <Spin spinning={loading} tip="Criando sua conta...">
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Row gutter={[16, 0]}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="name" label="Nome" rules={[{ required: true, message: "Nome é obrigatório" }]}>
                                        <Input size="large" placeholder="Seu nome completo" disabled={loading} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="username" label="Username" rules={[{ required: true, message: "Username é obrigatório" }]}>
                                        <Input size="large" placeholder="Escolha um username" disabled={loading} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={[16, 0]}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            { required: true, message: "Email é obrigatório" },
                                            { type: "email", message: "Email inválido" }
                                        ]}
                                    >
                                        <Input size="large" placeholder="seu@email.com" disabled={loading} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="password"
                                        label="Senha"
                                        rules={[
                                            { required: true, message: "Senha é obrigatória" },
                                            { min: 6, message: "Senha deve ter no mínimo 6 caracteres" }
                                        ]}
                                        hasFeedback
                                    >
                                        <Input.Password size="large" placeholder="Mínimo 6 caracteres" disabled={loading} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={[16, 0]}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="confirm"
                                        label="Confirmar senha"
                                        dependencies={["password"]}
                                        hasFeedback
                                        rules={[
                                            { required: true, message: "Confirme a senha" },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue("password") === value) return Promise.resolve();
                                                    return Promise.reject(new Error("As senhas não coincidem"));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password size="large" placeholder="Digite a senha novamente" disabled={loading} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={[16, 0]}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="cep" label="CEP" rules={[{ required: true, message: "CEP é obrigatório" }]}>
                                        <Input.Search
                                            size="large"
                                            placeholder="Ex.: 01001-000"
                                            onSearch={onSearchCep}
                                            loading={searchingCep}
                                            disabled={loading}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="state" label="Estado" rules={[{ required: true, message: "Estado é obrigatório" }]}>
                                        <Input size="large" disabled={addressDisabled || loading} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={[16, 0]}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="city" label="Cidade" rules={[{ required: true, message: "Cidade é obrigatória" }]}>
                                        <Input size="large" disabled={addressDisabled || loading} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="street" label="Rua" rules={[{ required: true, message: "Rua é obrigatória" }]}>
                                        <Input size="large" disabled={addressDisabled || loading} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={[16, 0]}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="neighborhood" label="Bairro" rules={[{ required: true, message: "Bairro é obrigatório" }]}>
                                        <Input size="large" disabled={addressDisabled || loading} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="number" label="Número" rules={[{ required: true, message: "Número é obrigatório" }]}>
                                        <Input size="large" type="number" disabled={addressDisabled || loading} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div className="flex items-center justify-between mt-2">
                                <Text type="secondary">Ao continuar você concorda com nossos termos de uso.</Text>
                                <Button type="primary" size="large" htmlType="submit" loading={loading}>
                                    Cadastrar
                                </Button>
                            </div>
                        </Form>
                    </Spin>
                </Card>
            </Content>
        </Layout>
    );
};

export default SignUp;
