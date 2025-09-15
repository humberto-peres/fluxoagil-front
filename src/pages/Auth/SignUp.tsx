import React, { useState } from "react";
import { Layout, Card, Form, Input, Button, Row, Col, Typography, App } from "antd";
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

    const onSearchCep = async (value?: string) => {
        if (!value) return;
        try {
            const a = await cepUtils.fetchAddress(value);
            form.setFieldsValue({
                city: a.city,
                state: a.state,
                neighborhood: a.neighborhood,
                street: a.street,
            });
            setAddressDisabled(false);
        } catch {
            setAddressDisabled(true);
            message.error("CEP não encontrado");
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

        try {
            await registerUser(payload);
            message.success("Conta criada! Você já pode entrar.");
            navigate("/login");
        } catch (e: any) {
            message.error(e?.message || "Falha ao cadastrar");
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
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Row gutter={[16, 0]}>
                            <Col xs={24} md={12}>
                                <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 0]}>
                            <Col xs={24} md={12}>
                                <Form.Item name="email" label="Email" rules={[{ required: true }, { type: "email" }]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="password"
                                    label="Senha"
                                    rules={[{ required: true, min: 6 }]}
                                    hasFeedback
                                >
                                    <Input.Password size="large" />
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
                                    <Input.Password size="large" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 0]}>
                            <Col xs={24} md={12}>
                                <Form.Item name="cep" label="CEP">
                                    <Input.Search size="large" placeholder="Ex.: 01001-000" onSearch={onSearchCep} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="state" label="Estado">
                                    <Input size="large" disabled={addressDisabled} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 0]}>
                            <Col xs={24} md={12}>
                                <Form.Item name="city" label="Cidade">
                                    <Input size="large" disabled={addressDisabled} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="street" label="Rua">
                                    <Input size="large" disabled={addressDisabled} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 0]}>
                            <Col xs={24} md={12}>
                                <Form.Item name="neighborhood" label="Bairro">
                                    <Input size="large" disabled={addressDisabled} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="number" label="Número">
                                    <Input size="large" type="number" disabled={addressDisabled} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <div className="flex items-center justify-between mt-2">
                            <Text type="secondary">Ao continuar você concorda com nossos termos de uso.</Text>
                            <Button type="primary" size="large" htmlType="submit">
                                Cadastrar
                            </Button>
                        </div>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
};

export default SignUp;
