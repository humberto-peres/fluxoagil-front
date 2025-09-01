import React from 'react';
import type { FormInstance } from 'antd';
import { Form, Input } from 'antd';

type FieldType = {
    name?: string;
    description?: string;
};

interface FormStepProps {
    form: FormInstance;
    onFinish: (values: FieldType) => void;
}

const FormStep: React.FC<FormStepProps> = ({ form, onFinish }) => (
    <Form form={form} name="step-form" layout="vertical" onFinish={onFinish}>
        <Form.Item<FieldType>
            label="Nome"
            name="name"
            rules={[{ required: true, message: 'Nome não preenchido!' }]}
        >
            <Input size='large' />
        </Form.Item>
    </Form>
);

export default FormStep;
