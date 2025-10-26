import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from 'antd';
import Workspace from '@/pages/Workspace';
import * as workspaceServices from '@/services/workspace.services';

vi.mock('@/services/workspace.services');
vi.mock('@/services/step.services', () => ({
	getSteps: vi.fn().mockResolvedValue([]),
}));
vi.mock('@/services/team.services', () => ({
	getTeams: vi.fn().mockResolvedValue([]),
}));
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

const mockWorkspaces = [
	{
		id: 1,
		name: 'Projeto Alpha',
		key: 'ALPHA',
		methodology: 'Scrum',
		teamName: 'Backend',
		teamId: 1,
		steps: [
			{ stepId: 1, name: 'Backlog' },
			{ stepId: 2, name: 'Em Andamento' },
			{ stepId: 3, name: 'Concluído' },
		],
		members: ['João', 'Maria'],
	},
	{
		id: 2,
		name: 'Projeto Beta',
		key: 'BETA',
		methodology: 'Kanban',
		teamName: 'Frontend',
		teamId: 2,
		steps: [],
		members: [],
	},
];

describe('Workspace', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(workspaceServices.getWorkspaces).mockResolvedValue(mockWorkspaces);
		vi.mocked(workspaceServices.createWorkspace).mockResolvedValue({ id: 3, name: 'New' });
		vi.mocked(workspaceServices.updateWorkspace).mockResolvedValue(undefined);
		vi.mocked(workspaceServices.deleteWorkspaces).mockResolvedValue(undefined);
	});

	describe('Renderização', () => {
		it('deve renderizar título', async () => {
			render(
				<AppWrapper>
					<Workspace />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Workspace')).toBeInTheDocument();
			});
		});

		it('deve carregar workspaces', async () => {
			render(
				<AppWrapper>
					<Workspace />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(workspaceServices.getWorkspaces).toHaveBeenCalled();
			});

			expect(screen.getByText('Projeto Alpha')).toBeInTheDocument();
			expect(screen.getByText('Projeto Beta')).toBeInTheDocument();
		});
	});

	describe('Tabela', () => {
		it('deve exibir colunas', async () => {
			render(
				<AppWrapper>
					<Workspace />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Nome')).toBeInTheDocument();
			});

			expect(screen.getByText('Ações')).toBeInTheDocument();
		});
	});

	describe('Modal', () => {
		it('deve abrir modal ao criar', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<Workspace />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Criar Workspace')).toBeInTheDocument();
			});

			await user.click(screen.getByText('Criar Workspace'));

			await waitFor(() => {
				expect(screen.getByText('Salvar')).toBeInTheDocument();
			});
		});
	});

	describe('Edição', () => {
		it('deve abrir modal de edição', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<Workspace />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Projeto Alpha')).toBeInTheDocument();
			});

			const editButton = screen.getByLabelText('Editar Projeto Alpha');
			await user.click(editButton);

			await waitFor(() => {
				expect(screen.getByText('Editar Workspace')).toBeInTheDocument();
			});
		});
	});

	describe('Exclusão', () => {
		it('deve exibir confirmação', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<Workspace />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Projeto Alpha')).toBeInTheDocument();
			});

			const deleteButton = screen.getByLabelText('Excluir Projeto Alpha');
			await user.click(deleteButton);

			await waitFor(() => {
				expect(screen.getByText('Excluir workspace?')).toBeInTheDocument();
			});
		});
	});
});