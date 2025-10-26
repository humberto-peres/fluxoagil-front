import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import FormTeam from '@/pages/Team/FormTeam';

const TestWrapper = ({ onFinish }: { onFinish?: any }) => {
	const [form] = Form.useForm();
	return <FormTeam form={form} onFinish={onFinish || vi.fn()} />;
};

describe('FormTeam', () => {
	it('deve renderizar campo de nome', () => {
		render(<TestWrapper />);
		expect(screen.getByLabelText('Nome da Equipe')).toBeInTheDocument();
	});

	it('deve exibir placeholder', () => {
		render(<TestWrapper />);
		expect(screen.getByPlaceholderText(/Backend, Mobile, Produto/i)).toBeInTheDocument();
	});

	it('deve aceitar texto digitado', async () => {
		const TestComponent = () => {
			const [form] = Form.useForm();
			return <FormTeam form={form} onFinish={vi.fn()} />;
		};

		render(<TestComponent />);
		
		const user = userEvent.setup();
		const input = screen.getByLabelText('Nome da Equipe');
		
		await user.type(input, 'Equipe Frontend');
		
		expect(input).toHaveValue('Equipe Frontend');
	});
});