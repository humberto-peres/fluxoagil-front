import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { App } from 'antd';
import Task from '@/pages/Task';
import * as taskServices from '@/services/task.services';

vi.mock('@/services/task.services');
vi.mock('@/hooks/useOpenTask', () => ({
	useOpenTask: () => vi.fn(),
}));
vi.mock('@/components/Layout/DefaultLayout', () => ({
	default: ({ children, title }: any) => (
		<div>
			<h1>{title}</h1>
			{children}
		</div>
	),
}));

const AppWrapper = ({ children }: { children: React.ReactNode }) => (
	<App>{children}</App>
);

const mockTasks = [
	{
		id: 1,
		idTask: 'PROJ-123',
		title: 'Implementar feature',
		typeTask: { id: 1, name: 'Feature' },
		estimate: '8h',
		deadline: '31/12/2024',
		assignee: { id: 1, name: 'João Silva' },
	},
	{
		id: 2,
		idTask: 'PROJ-124',
		title: 'Corrigir bug',
		typeTask: { id: 2, name: 'Bug' },
		estimate: '2h',
		deadline: null,
		assignee: null,
	},
];

describe('Task', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(taskServices.getAllTasks).mockResolvedValue(mockTasks);
	});

	describe('Renderização', () => {
		it('deve renderizar título', async () => {
			render(
				<AppWrapper>
					<Task />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Atividades')).toBeInTheDocument();
			});
		});

		it('deve carregar e exibir tarefas', async () => {
			render(
				<AppWrapper>
					<Task />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(taskServices.getAllTasks).toHaveBeenCalled();
			});

			expect(screen.getByText(/PROJ-123 - Implementar feature/)).toBeInTheDocument();
			expect(screen.getByText(/PROJ-124 - Corrigir bug/)).toBeInTheDocument();
		});
	});

	describe('Informações da tarefa', () => {
		it('deve exibir tipo da tarefa', async () => {
			render(
				<AppWrapper>
					<Task />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Tipo da tarefa: Feature')).toBeInTheDocument();
			});

			expect(screen.getByText('Tipo da tarefa: Bug')).toBeInTheDocument();
		});

		it('deve exibir estimativa', async () => {
			render(
				<AppWrapper>
					<Task />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Estimativa: 8h')).toBeInTheDocument();
			});
		});

		it('deve exibir prazo', async () => {
			render(
				<AppWrapper>
					<Task />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Prazo: 31/12/2024')).toBeInTheDocument();
			});
		});

		it('deve exibir responsável', async () => {
			render(
				<AppWrapper>
					<Task />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Responsável: João Silva')).toBeInTheDocument();
			});
		});
	});

	describe('Lista vazia', () => {
		it('deve lidar com lista vazia', async () => {
			vi.mocked(taskServices.getAllTasks).mockResolvedValue([]);

			render(
				<AppWrapper>
					<Task />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(taskServices.getAllTasks).toHaveBeenCalled();
			});
		});
	});

	describe('Erros', () => {
		it('deve lidar com erro ao carregar', async () => {
			vi.mocked(taskServices.getAllTasks).mockRejectedValue(new Error('Erro'));

			render(
				<AppWrapper>
					<Task />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(taskServices.getAllTasks).toHaveBeenCalled();
			});
		});
	});

	describe('Ícone de abrir', () => {
		it('deve exibir ícone de abrir tarefa', async () => {
			const { container } = render(
				<AppWrapper>
					<Task />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText(/PROJ-123/)).toBeInTheDocument();
			});

			const icons = container.querySelectorAll('.cursor-pointer');
			expect(icons.length).toBeGreaterThan(0);
		});
	});

	describe('Avatar', () => {
		it('deve exibir números nos avatares', async () => {
			render(
				<AppWrapper>
					<Task />
				</AppWrapper>
			);

			await waitFor(() => {
				const avatarOnes = screen.getAllByText('1');
				expect(avatarOnes.length).toBeGreaterThanOrEqual(1);

				const avatarTwos = screen.getAllByText('2');
				expect(avatarTwos.length).toBeGreaterThanOrEqual(1);
			});
		});
	});
});