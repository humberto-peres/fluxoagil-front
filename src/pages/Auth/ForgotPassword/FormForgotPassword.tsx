import React from 'react';
import { Button, Flex, Form, Input } from 'antd';
import { FaLock, FaUserAlt } from "react-icons/fa";

type FieldType = {
    email: string;
};

const FormForgotPassword: React.FC = () => (
    <Form
        initialValues={{ remember: true }}
        //onFinish={(values) => actions.signIn(values)}
        autoComplete="off"
    >
        <p style={{ textAlign: 'center', marginBottom: 20 }}>
            Esqueceu sua senha? Sem problemas. Basta informar seu endereço de e-mail e um link de redefinição de senha será enviado.
        </p>
        <Form.Item<FieldType>
            name="email"
            rules={[{ required: true, message: 'Email não preenchido!' }]}
        >
            <Input size='large' placeholder='Email' prefix={<FaUserAlt color='var(--text)' style={{ marginRight: 5 }} />} />
        </Form.Item>
        <Form.Item>
            <Flex align='center' justify='space-between' vertical>
                <Button type="primary" size='large' htmlType="submit" block style={{ marginBottom: 8 }}>
                    Redefinir Senha
                </Button>
                <p>Já possui uma conta?</p>
                <a href='/login'>Volte para a tela de login</a>
            </Flex>
        </Form.Item>
    </Form>
);

export default FormForgotPassword;