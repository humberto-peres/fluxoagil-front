import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import React from 'react';

const FormPriority = ({ form, onFinish }: any) => (
  <Form
    form={form}
    name="priority-form"
    layout="vertical"
    onFinish={onFinish}
    initialValues={{ label: '#000000' }}
  >
    <Form.Item
      label="Cor"
      name="label"
      rules={[{ required: true, message: 'Escolha uma cor!' }]}
    >
      <input type="text" />
    </Form.Item>

    <Form.Item
      label="Nome"
      name="name"
      rules={[{ required: true, message: 'Nome não preenchido!' }]}
    >
      <input placeholder="Ex.: Alta, Média, Baixa..." />
    </Form.Item>
  </Form>
);

describe('FormPriority', () => {
  const mockOnFinish = vi.fn();

  const TestWrapper = () => {
    const [form] = Form.useForm();
    return <FormPriority form={form} onFinish={mockOnFinish} />;
  };

  it('deve renderizar formulário com layout vertical', () => {
    render(<TestWrapper />);
    
    const form = document.querySelector('.ant-form-vertical');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar campo nome com placeholder', () => {
    render(<TestWrapper />);
    
    const input = screen.getByPlaceholderText(/alta, média, baixa/i);
    expect(input).toBeInTheDocument();
  });

  it('deve permitir digitar no campo nome', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    const input = screen.getByPlaceholderText(/alta, média, baixa/i) as HTMLInputElement;
    await user.type(input, 'Urgente');
    
    expect(input.value).toBe('Urgente');
  });

  it('deve ter campo de cor', () => {
    render(<TestWrapper />);
    
    expect(screen.getByLabelText('Cor')).toBeInTheDocument();
  });

  it('deve renderizar formulário corretamente', () => {
    render(<TestWrapper />);
    
    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass('ant-form');
  });
});