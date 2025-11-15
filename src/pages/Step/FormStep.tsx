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
    loading?: boolean;
}

const FormStep: React.FC<FormStepProps> = ({ form, onFinish, loading = false }) => (
    <Form form={form} name="step-form" layout="vertical" onFinish={onFinish}>
        <Form.Item<FieldType>
            label="Nome"
            name="name"
            rules={[
                { required: true, message: 'Nome é obrigatório' }
            ]}
        >
            <Input
                size="large"
                placeholder="Ex.: Backlog, Em Andamento, Concluído..."
                autoFocus
                disabled={loading}
                maxLength={50}
                showCount
            />
        </Form.Item>
    </Form>
);

export default FormStep;