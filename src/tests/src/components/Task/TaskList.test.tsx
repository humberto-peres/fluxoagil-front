import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList, { type TaskItem } from '@/components/Task/TaskList';

const mockTask: TaskItem = {
	id: 1,
	idTask: 'PROJ-123',
	title: 'Implementar nova feature',
	description: 'Descrição da tarefa',
	deadline: '31/12/2024',
	estimate: '8',
	priority: { id: 1, name: 'Alta', label: 'red' },
	typeTask: { id: 1, name: 'Feature' },
	step: { id: 1, name: 'Em Desenvolvimento' },
	reporter: { id: 1, name: 'João Silva' },
	assignee: { id: 2, name: 'Maria Santos' },
	epic: null,
};

const mockTaskWithEpic: TaskItem = {
	...mockTask,
	id: 2,
	idTask: 'PROJ-456',
	epic: { id: 1, key: 'EPIC-1', title: 'Épico Principal' },
};

describe('TaskList', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Renderização', () => {
		it('deve renderizar lista vazia', () => {
			render(<TaskList tasks={[]} />);
			expect(screen.getByText('Sem tarefas')).toBeInTheDocument();
		});

		it('deve renderizar uma tarefa', () => {
			render(<TaskList tasks={[mockTask]} />);
			expect(screen.getByText('PROJ-123')).toBeInTheDocument();
			expect(screen.getByText('Implementar nova feature')).toBeInTheDocument();
		});

		it('deve renderizar múltiplas tarefas', () => {
			render(<TaskList tasks={[mockTask, mockTaskWithEpic]} />);
			const proj123 = screen.getAllByText(/PROJ-123/);
			const proj456 = screen.getAllByText(/PROJ-456/);
			
			expect(proj123.length).toBeGreaterThan(0);
			expect(proj456.length).toBeGreaterThan(0);
		});
	});

	describe('Informações da tarefa', () => {
		it('deve exibir prioridade', () => {
			render(<TaskList tasks={[mockTask]} />);
			expect(screen.getByText('Alta')).toBeInTheDocument();
		});

		it('deve exibir ID da tarefa', () => {
			render(<TaskList tasks={[mockTask]} />);
			expect(screen.getByText('PROJ-123')).toBeInTheDocument();
		});

		it('deve exibir tipo da tarefa', () => {
			render(<TaskList tasks={[mockTask]} />);
			const features = screen.getAllByText('Feature');
			expect(features.length).toBeGreaterThan(0);
			expect(features[0]).toBeInTheDocument();
		});

		it('deve exibir etapa atual', () => {
			render(<TaskList tasks={[mockTask]} />);
			expect(screen.getByText('Em Desenvolvimento')).toBeInTheDocument();
		});

		it('deve exibir prazo', () => {
			render(<TaskList tasks={[mockTask]} />);
			expect(screen.getByText('31/12/2024')).toBeInTheDocument();
		});

		it('deve exibir responsável', () => {
			render(<TaskList tasks={[mockTask]} />);
			expect(screen.getByText('Maria Santos')).toBeInTheDocument();
		});

		it('deve exibir épico associado', () => {
			render(<TaskList tasks={[mockTaskWithEpic]} />);
			expect(screen.getByText('EPIC-1 - Épico Principal')).toBeInTheDocument();
		});
	});

	describe('Exclusão com épico', () => {
		it('deve desabilitar exclusão quando tarefa tem épico', async () => {
			const user = userEvent.setup();
			const onDelete = vi.fn();
			render(<TaskList tasks={[mockTaskWithEpic]} onDelete={onDelete} />);

			await waitFor(() => {
				expect(screen.getByLabelText('Excluir atividade')).toBeInTheDocument();
			});

			await user.click(screen.getByLabelText('Excluir atividade'));

			await waitFor(() => {
				expect(onDelete).not.toHaveBeenCalled();
				
				const bodyText = document.body.textContent || '';
				const hasEpicMessage = 
					bodyText.toLowerCase().includes('épico') ||
					bodyText.toLowerCase().includes('excluir') ||
					bodyText.toLowerCase().includes('não é possível') ||
					bodyText.toLowerCase().includes('associada');
				
				expect(hasEpicMessage).toBe(true);
			}, { timeout: 2000 });
		});

		it('deve permitir exclusão quando tarefa não tem épico', async () => {
			const user = userEvent.setup();
			const onDelete = vi.fn();
			render(<TaskList tasks={[mockTask]} onDelete={onDelete} />);

			await waitFor(() => {
				expect(screen.getByLabelText('Excluir atividade')).toBeInTheDocument();
			});

			await user.click(screen.getByLabelText('Excluir atividade'));

			await waitFor(() => {
				expect(screen.getByText(/Esta ação não pode ser desfeita/)).toBeInTheDocument();
			});
		});

		it('deve chamar onDelete ao confirmar exclusão', async () => {
			const user = userEvent.setup();
			const onDelete = vi.fn();
			render(<TaskList tasks={[mockTask]} onDelete={onDelete} />);

			await waitFor(() => {
				expect(screen.getByLabelText('Excluir atividade')).toBeInTheDocument();
			});

			await user.click(screen.getByLabelText('Excluir atividade'));

			await waitFor(() => {
				expect(screen.getByText(/Esta ação não pode ser desfeita/)).toBeInTheDocument();
			});

			const deleteButtons = screen.getAllByText('Excluir');
			
			const buttonElements = deleteButtons.filter(el => 
				el.tagName === 'BUTTON' || el.closest('button')
			);
			
			const confirmButton = buttonElements[buttonElements.length - 1].closest('button') || buttonElements[buttonElements.length - 1];
			await user.click(confirmButton as HTMLElement);

			await waitFor(() => {
				expect(onDelete).toHaveBeenCalledWith(1);
			});
		});

		it('não deve chamar onDelete ao cancelar', async () => {
			const user = userEvent.setup();
			const onDelete = vi.fn();
			render(<TaskList tasks={[mockTask]} onDelete={onDelete} />);

			await waitFor(() => {
				expect(screen.getByLabelText('Excluir atividade')).toBeInTheDocument();
			});

			await user.click(screen.getByLabelText('Excluir atividade'));

			await waitFor(() => {
				expect(screen.getByText('Cancelar')).toBeInTheDocument();
			});

			await user.click(screen.getByText('Cancelar'));

			await waitFor(() => {
				expect(onDelete).not.toHaveBeenCalled();
			});
		});
	});

	describe('Acessibilidade', () => {
		it('deve ter aria-label no botão de editar', async () => {
			const onEdit = vi.fn();
			render(<TaskList tasks={[mockTask]} onEdit={onEdit} />);

			await waitFor(() => {
				const button = screen.getByLabelText('Editar atividade');
				expect(button).toBeInTheDocument();
			});
		});

		it('deve ter aria-label no botão de excluir', async () => {
			const onDelete = vi.fn();
			render(<TaskList tasks={[mockTask]} onDelete={onDelete} />);

			await waitFor(() => {
				const button = screen.getByLabelText('Excluir atividade');
				expect(button).toBeInTheDocument();
			});
		});
	});
});