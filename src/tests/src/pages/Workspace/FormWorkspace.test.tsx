import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import FormWorkspace from '@/pages/Workspace/FormWorkspace';
import * as stepServices from '@/services/step.services';
import * as teamServices from '@/services/team.services';

vi.mock('@/services/step.services');
vi.mock('@/services/team.services');

const mockSteps = [
	{ id: 1, name: 'Backlog' },
	{ id: 2, name: 'Em Andamento' },
	{ id: 3, name: 'Concluído' },
];

const mockTeams = [
	{ id: 1, name: 'Backend' },
	{ id: 2, name: 'Frontend' },
];

const TestWrapper = ({ onFinish, isEditing }: { onFinish?: any; isEditing?: boolean }) => {
	const [form] = Form.useForm();
	return <FormWorkspace form={form} onFinish={onFinish || vi.fn()} isEditing={isEditing} />;
};

describe('FormWorkspace', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(stepServices.getSteps).mockResolvedValue(mockSteps);
		vi.mocked(teamServices.getTeams).mockResolvedValue(mockTeams);
	});

	describe('Renderização', () => {
		it('deve renderizar campos básicos', async () => {
			render(<TestWrapper />);

			await waitFor(() => {
				expect(screen.getByText('Nome do Workspace')).toBeInTheDocument();
			});

			expect(screen.getByText('Identificador')).toBeInTheDocument();
			expect(screen.getByText('Metodologia')).toBeInTheDocument();
			expect(screen.getByText('Equipe Responsável')).toBeInTheDocument();
		});

		it('deve renderizar alert de fluxo', async () => {
			render(<TestWrapper />);

			await waitFor(() => {
				expect(screen.getByText('Fluxo das etapas')).toBeInTheDocument();
			});
		});

		it('deve renderizar card de etapas', async () => {
			render(<TestWrapper />);

			await waitFor(() => {
				expect(screen.getByText('Ordem das Etapas')).toBeInTheDocument();
			});
		});
	});

	describe('Carregamento de dados', () => {
		it('deve carregar steps', async () => {
			render(<TestWrapper />);

			await waitFor(() => {
				expect(stepServices.getSteps).toHaveBeenCalled();
			});
		});

		it('deve carregar teams', async () => {
			render(<TestWrapper />);

			await waitFor(() => {
				expect(teamServices.getTeams).toHaveBeenCalled();
			});
		});
	});

	describe('Campo Identificador', () => {
		it('deve aceitar apenas letras', async () => {
			const TestComponent = () => {
				const [form] = Form.useForm();
				return <FormWorkspace form={form} onFinish={vi.fn()} />;
			};

			render(<TestComponent />);

			await waitFor(() => {
				expect(screen.getByPlaceholderText('Ex.: WOR')).toBeInTheDocument();
			});

			const user = userEvent.setup();
			const input = screen.getByPlaceholderText('Ex.: WOR');
			
			await user.type(input, 'ABC123');
			
			expect(input).toHaveValue('ABC');
		});

		it('deve converter para maiúsculas', async () => {
			const TestComponent = () => {
				const [form] = Form.useForm();
				return <FormWorkspace form={form} onFinish={vi.fn()} />;
			};

			render(<TestComponent />);

			await waitFor(() => {
				expect(screen.getByPlaceholderText('Ex.: WOR')).toBeInTheDocument();
			});

			const user = userEvent.setup();
			const input = screen.getByPlaceholderText('Ex.: WOR');
			
			await user.type(input, 'abc');
			
			expect(input).toHaveValue('ABC');
		});

		it('deve limitar a 5 caracteres', async () => {
			const TestComponent = () => {
				const [form] = Form.useForm();
				return <FormWorkspace form={form} onFinish={vi.fn()} />;
			};

			render(<TestComponent />);

			await waitFor(() => {
				expect(screen.getByPlaceholderText('Ex.: WOR')).toBeInTheDocument();
			});

			const input = screen.getByPlaceholderText('Ex.: WOR');
			expect(input).toHaveAttribute('maxlength', '5');
		});
	});

	describe('Modo de edição', () => {
		it('não deve exibir botão adicionar no modo edição', async () => {
			render(<TestWrapper isEditing={true} />);

			await waitFor(() => {
				expect(screen.getByText('Ordem das Etapas')).toBeInTheDocument();
			});

			expect(screen.queryByText('Adicionar')).not.toBeInTheDocument();
		});

		it('deve exibir botão adicionar no modo criação', async () => {
			render(<TestWrapper isEditing={false} />);

			await waitFor(() => {
				expect(screen.getByText('Adicionar')).toBeInTheDocument();
			});
		});
	});

	describe('Metodologia', () => {
		it('deve exibir opções de metodologia', async () => {
			render(<TestWrapper />);

			await waitFor(() => {
				expect(screen.getByText('Metodologia')).toBeInTheDocument();
			});
		});
	});
});