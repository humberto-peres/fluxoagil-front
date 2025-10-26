import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import FormTaskType from '@/pages/TypeTask/FormTaskType';

const TestWrapper = ({ onFinish }: { onFinish?: any }) => {
	const [form] = Form.useForm();
	return <FormTaskType form={form} onFinish={onFinish || vi.fn()} />;
};

describe('FormTaskType', () => {
	it('deve renderizar campo de nome', () => {
		render(<TestWrapper />);
		expect(screen.getByLabelText('Nome')).toBeInTheDocument();
	});

	it('deve exibir placeholder', () => {
		render(<TestWrapper />);
		expect(screen.getByPlaceholderText(/Bug, Feature, Improvement/i)).toBeInTheDocument();
	});

	it('deve aceitar texto digitado', async () => {
		const TestComponent = () => {
			const [form] = Form.useForm();
			return <FormTaskType form={form} onFinish={vi.fn()} />;
		};

		render(<TestComponent />);
		
		const user = userEvent.setup();
		const input = screen.getByLabelText('Nome');
		
		await user.type(input, 'Bug Fix');
		
		expect(input).toHaveValue('Bug Fix');
	});
});