import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import FormStep from '@/pages/Step/FormStep';

const TestWrapper = ({ onFinish }: { onFinish?: any }) => {
	const [form] = Form.useForm();
	return <FormStep form={form} onFinish={onFinish || vi.fn()} />;
};

describe('FormStep', () => {
	it('deve renderizar campo de nome', () => {
		render(<TestWrapper />);
		expect(screen.getByLabelText('Nome')).toBeInTheDocument();
	});

	it('deve exibir placeholder', () => {
		render(<TestWrapper />);
		expect(screen.getByPlaceholderText(/Backlog/i)).toBeInTheDocument();
	});

	it('deve aceitar texto digitado', async () => {
		const TestComponent = () => {
			const [form] = Form.useForm();
			return <FormStep form={form} onFinish={vi.fn()} />;
		};

		render(<TestComponent />);
		
		const user = userEvent.setup();
		const input = screen.getByLabelText('Nome');
		
		await user.type(input, 'Em Andamento');
		
		expect(input).toHaveValue('Em Andamento');
	});
});