import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from 'antd';
import TaskType from '@/pages/TypeTask';
import * as taskTypeServices from '@/services/taskType.services';

vi.mock('@/services/taskType.services');
vi.mock('@/components/Layout/DefaultLayout', () => ({
	default: ({ children, title, addButton, textButton, onAddClick }: any) => (
		<div>
			<h1>{title}</h1>
			{addButton && (
				<button onClick={onAddClick}>{textButton}</button>
			)}
			{children}
		</div>
	),
}));

const AppWrapper = ({ children }: { children: React.ReactNode }) => (
	<App>{children}</App>
);

const mockTaskTypes = [
	{ id: 1, name: 'Bug' },
	{ id: 2, name: 'Feature' },
	{ id: 3, name: 'Improvement' },
];

describe('TaskType', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(taskTypeServices.getTaskTypes).mockResolvedValue(mockTaskTypes);
		vi.mocked(taskTypeServices.createTaskType).mockResolvedValue({ id: 4, name: 'New' });
		vi.mocked(taskTypeServices.updateTaskType).mockResolvedValue(undefined);
		vi.mocked(taskTypeServices.deleteTaskTypes).mockResolvedValue(undefined);
	});

	describe('Renderização', () => {
		it('deve renderizar título', async () => {
			render(
				<AppWrapper>
					<TaskType />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Tipo de Atividade')).toBeInTheDocument();
			});
		});

		it('deve carregar tipos de atividade', async () => {
			render(
				<AppWrapper>
					<TaskType />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(taskTypeServices.getTaskTypes).toHaveBeenCalled();
			});

			expect(screen.getByText('Bug')).toBeInTheDocument();
			expect(screen.getByText('Feature')).toBeInTheDocument();
			expect(screen.getByText('Improvement')).toBeInTheDocument();
		});
	});

	describe('Modal', () => {
		it('deve abrir modal ao criar', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<TaskType />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Criar Tipo')).toBeInTheDocument();
			});

			await user.click(screen.getByText('Criar Tipo'));

			await waitFor(() => {
				expect(screen.getByText('Criar Tipo de Atividade')).toBeInTheDocument();
			});
		});

		it('deve fechar modal ao cancelar', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<TaskType />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Criar Tipo')).toBeInTheDocument();
			});

			await user.click(screen.getByText('Criar Tipo'));

			await waitFor(() => {
				expect(screen.getByText('Cancelar')).toBeInTheDocument();
			});

			await user.click(screen.getByText('Cancelar'));

			await waitFor(() => {
				expect(screen.queryByText('Salvar')).not.toBeInTheDocument();
			});
		});
	});

	describe('Edição', () => {
		it('deve abrir modal de edição', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<TaskType />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Bug')).toBeInTheDocument();
			});

			const editButton = screen.getByLabelText('Editar Bug');
			await user.click(editButton);

			await waitFor(() => {
				expect(screen.getByText('Editar Tipo de Atividade')).toBeInTheDocument();
			});
		});
	});

	describe('Exclusão', () => {
		it('deve exibir confirmação', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<TaskType />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Bug')).toBeInTheDocument();
			});

			const deleteButton = screen.getByLabelText('Excluir Bug');
			await user.click(deleteButton);

			await waitFor(() => {
				expect(screen.getByText('Excluir tipo de atividade?')).toBeInTheDocument();
			});
		});
	});

	describe('Erros', () => {
		it('deve lidar com erro ao carregar', async () => {
			vi.mocked(taskTypeServices.getTaskTypes).mockRejectedValue(new Error('Erro'));

			render(
				<AppWrapper>
					<TaskType />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(taskTypeServices.getTaskTypes).toHaveBeenCalled();
			});
		});
	});
});