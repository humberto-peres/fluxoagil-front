import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from 'antd';
import Team from '@/pages/Team';
import * as teamServices from '@/services/team.services';

vi.mock('@/services/team.services');
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

const mockTeams = [
	{
		id: 1,
		name: 'Backend',
		members: [
			{ user: { id: 1, name: 'João Silva' } },
			{ user: { id: 2, name: 'Maria Santos' } },
		],
	},
	{
		id: 2,
		name: 'Frontend',
		members: [
			{ user: { id: 3, name: 'Pedro Oliveira' } },
		],
	},
	{
		id: 3,
		name: 'Mobile',
		members: [],
	},
];

describe('Team', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(teamServices.getTeams).mockResolvedValue(mockTeams);
		vi.mocked(teamServices.getTeamById).mockResolvedValue(mockTeams[0]);
		vi.mocked(teamServices.createTeam).mockResolvedValue({ id: 4, name: 'Nova' });
		vi.mocked(teamServices.updateTeam).mockResolvedValue(undefined);
		vi.mocked(teamServices.deleteTeams).mockResolvedValue(undefined);
	});

	describe('Renderização', () => {
		it('deve renderizar título', async () => {
			render(
				<AppWrapper>
					<Team />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Equipes')).toBeInTheDocument();
			});
		});

		it('deve carregar equipes', async () => {
			render(
				<AppWrapper>
					<Team />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(teamServices.getTeams).toHaveBeenCalled();
			});

			expect(screen.getByText('Backend')).toBeInTheDocument();
			expect(screen.getByText('Frontend')).toBeInTheDocument();
			expect(screen.getByText('Mobile')).toBeInTheDocument();
		});
	});

	describe('Modal', () => {
		it('deve abrir modal ao criar', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<Team />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Criar Equipe')).toBeInTheDocument();
			});

			await user.click(screen.getByText('Criar Equipe'));

			await waitFor(() => {
				expect(screen.getByText('Salvar')).toBeInTheDocument();
			});
		});

		it('deve fechar modal ao cancelar', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<Team />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Criar Equipe')).toBeInTheDocument();
			});

			await user.click(screen.getByText('Criar Equipe'));

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
					<Team />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Backend')).toBeInTheDocument();
			});

			const editButton = screen.getByLabelText('Editar Backend');
			await user.click(editButton);

			await waitFor(() => {
				expect(teamServices.getTeamById).toHaveBeenCalledWith(1);
			});
		});
	});

	describe('Exclusão', () => {
		it('deve exibir confirmação', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<Team />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Backend')).toBeInTheDocument();
			});

			const deleteButton = screen.getByLabelText('Excluir Backend');
			await user.click(deleteButton);

			await waitFor(() => {
				expect(screen.getByText('Excluir equipe?')).toBeInTheDocument();
			});
		});
	});

	describe('Membros', () => {
		it('deve exibir equipes com membros', async () => {
			render(
				<AppWrapper>
					<Team />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Backend')).toBeInTheDocument();
				expect(screen.getByText('Frontend')).toBeInTheDocument();
				expect(screen.getByText('Mobile')).toBeInTheDocument();
			});
		});
	});

	describe('Erros', () => {
		it('deve lidar com erro ao carregar', async () => {
			vi.mocked(teamServices.getTeams).mockRejectedValue(new Error('Erro'));

			render(
				<AppWrapper>
					<Team />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(teamServices.getTeams).toHaveBeenCalled();
			});
		});

		it('deve lidar com erro ao editar', async () => {
			vi.mocked(teamServices.getTeamById).mockRejectedValue(new Error('Erro'));
			const user = userEvent.setup();

			render(
				<AppWrapper>
					<Team />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Backend')).toBeInTheDocument();
			});

			const editButton = screen.getByLabelText('Editar Backend');
			await user.click(editButton);

			await waitFor(() => {
				expect(teamServices.getTeamById).toHaveBeenCalled();
			});
		});
	});
});