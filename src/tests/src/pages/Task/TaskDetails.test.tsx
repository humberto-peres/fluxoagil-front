import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { App } from 'antd';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskDetails from '@/pages/Task/TaskDetails';
import * as taskServices from '@/services/task.services';

vi.mock('@/services/task.services');
vi.mock('@/hooks/useOpenEpic', () => ({
	useOpenEpic: () => vi.fn(),
}));
vi.mock('@/components/Layout/DefaultLayout', () => ({
	default: ({ children, title, subtitle, extra }: any) => (
		<div>
			<h1>{title}</h1>
			{subtitle && <div>{subtitle}</div>}
			{extra}
			{children}
		</div>
	),
}));

const AppWrapper = ({ children }: { children: React.ReactNode }) => (
	<App>
		<MemoryRouter initialEntries={['/task/1']}>
			<Routes>
				<Route path="/task/:id" element={children} />
			</Routes>
		</MemoryRouter>
	</App>
);

const mockTask = {
	id: 1,
	idTask: 'PROJ-123',
	title: 'Implementar feature',
	description: 'Descrição detalhada da tarefa',
	typeTask: { id: 1, name: 'Feature' },
	priority: { id: 1, name: 'Alta' },
	step: { id: 1, name: 'Em Andamento' },
	assignee: { id: 1, name: 'João Silva' },
	reporter: { id: 2, name: 'Maria Santos' },
	estimate: '8h',
	startDate: '01/12/2024',
	deadline: '31/12/2024',
	workspace: { id: 1, key: 'PROJ', name: 'Projeto' },
	sprint: { id: 1, name: 'Sprint 1' },
	epic: null,
};

describe('TaskDetails', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(taskServices.getTaskById).mockResolvedValue(mockTask);
	});

	describe('Carregamento', () => {
		it('deve exibir skeleton durante carregamento', () => {
			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			expect(screen.getByText('Atividade')).toBeInTheDocument();
		});

		it('deve carregar e exibir tarefa', async () => {
			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(taskServices.getTaskById).toHaveBeenCalledWith(1);
			});

			await waitFor(() => {
				expect(screen.getByText(/PROJ-123 — Implementar feature/)).toBeInTheDocument();
			});
		});
	});

	describe('Informações da tarefa', () => {
		it('deve exibir tipo da tarefa', async () => {
			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Tipo de atividade:')).toBeInTheDocument();
			});
		});

		it('deve exibir etapa', async () => {
			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Em Andamento')).toBeInTheDocument();
			});
		});

		it('deve exibir prioridade', async () => {
			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Alta')).toBeInTheDocument();
			});
		});

		it('deve exibir descrição', async () => {
			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Descrição detalhada da tarefa')).toBeInTheDocument();
			});
		});

		it('deve exibir sprint', async () => {
			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText(/Sprint 1/)).toBeInTheDocument();
			});
		});
	});

	describe('Detalhes', () => {
		it('deve exibir código da tarefa', async () => {
			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getAllByText('PROJ-123').length).toBeGreaterThan(0);
			});
		});

		it('deve exibir responsável', async () => {
			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('João Silva')).toBeInTheDocument();
			});
		});

		it('deve exibir reporter', async () => {
			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Maria Santos')).toBeInTheDocument();
			});
		});

		it('deve exibir estimativa', async () => {
			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('8h')).toBeInTheDocument();
			});
		});

		it('deve exibir prazos', async () => {
			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('01/12/2024')).toBeInTheDocument();
			});

			expect(screen.getByText('31/12/2024')).toBeInTheDocument();
		});
	});

	describe('Campos vazios', () => {
		it('deve exibir placeholder para descrição vazia', async () => {
			vi.mocked(taskServices.getTaskById).mockResolvedValue({
				...mockTask,
				description: null,
			});

			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Sem descrição')).toBeInTheDocument();
			});
		});

		it('deve exibir placeholder para campos não preenchidos', async () => {
			vi.mocked(taskServices.getTaskById).mockResolvedValue({
				...mockTask,
				assignee: null,
			});

			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Não preenchido')).toBeInTheDocument();
			});
		});
	});

	describe('Erro 404', () => {
		it('deve exibir mensagem de erro quando tarefa não existe', async () => {
			vi.mocked(taskServices.getTaskById).mockRejectedValue(new Error('Not found'));

			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Atividade não encontrada')).toBeInTheDocument();
			});
		});
	});

	describe('Ações', () => {
		it('deve exibir botões de ação', async () => {
			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Ver no Board')).toBeInTheDocument();
			});

			expect(screen.getByText('Ver no Backlog')).toBeInTheDocument();
		});
	});

	describe('Épico', () => {
		it('deve exibir épico quando vinculado', async () => {
			vi.mocked(taskServices.getTaskById).mockResolvedValue({
				...mockTask,
				epic: { id: 1, key: 'EPIC-1', title: 'Épico Principal' },
			});

			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText(/EPIC-1 — Épico Principal/)).toBeInTheDocument();
			});
		});

		it('deve exibir mensagem quando sem épico', async () => {
			render(
				<AppWrapper>
					<TaskDetails />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Sem épico vinculado')).toBeInTheDocument();
			});
		});
	});
});