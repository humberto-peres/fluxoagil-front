import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from 'antd';
import DrawerTeamMembers from '@/pages/Team/DrawerTeamMembers';
import * as teamServices from '@/services/team.services';

vi.mock('@/services/team.services');

const AppWrapper = ({ children }: { children: React.ReactNode }) => (
	<App>{children}</App>
);

const mockMembers = [
	{ user: { id: 1, name: 'João Silva' } },
	{ user: { id: 2, name: 'Maria Santos' } },
];

const mockAvailableUsers = [
	{ id: 3, name: 'Pedro Oliveira' },
	{ id: 4, name: 'Ana Costa' },
];

describe('DrawerTeamMembers', () => {
	const mockOnClose = vi.fn();
	const mockOnMembersChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(teamServices.getTeamMembers).mockResolvedValue(mockMembers);
		vi.mocked(teamServices.getAvailableUsers).mockResolvedValue(mockAvailableUsers);
		vi.mocked(teamServices.addTeamMembers).mockResolvedValue(undefined);
		vi.mocked(teamServices.removeTeamMember).mockResolvedValue(undefined);
	});

	describe('Renderização', () => {
		it('deve renderizar quando aberto', async () => {
			render(
				<AppWrapper>
					<DrawerTeamMembers
						teamId={1}
						isOpen={true}
						onClose={mockOnClose}
					/>
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Gerenciar Membros')).toBeInTheDocument();
			});
		});

		it('não deve renderizar quando fechado', () => {
			render(
				<AppWrapper>
					<DrawerTeamMembers
						teamId={1}
						isOpen={false}
						onClose={mockOnClose}
					/>
				</AppWrapper>
			);

			expect(screen.queryByText('Gerenciar Membros')).not.toBeInTheDocument();
		});

		it('deve renderizar seções', async () => {
			render(
				<AppWrapper>
					<DrawerTeamMembers
						teamId={1}
						isOpen={true}
						onClose={mockOnClose}
					/>
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Adicionar membros')).toBeInTheDocument();
			});

			expect(screen.getByText(/^Membros da equipe/)).toBeInTheDocument();
		});
	});

	describe('Carregamento de dados', () => {
		it('deve carregar membros', async () => {
			render(
				<AppWrapper>
					<DrawerTeamMembers
						teamId={1}
						isOpen={true}
						onClose={mockOnClose}
					/>
				</AppWrapper>
			);

			await waitFor(() => {
				expect(teamServices.getTeamMembers).toHaveBeenCalledWith(1);
			});

			expect(screen.getByText('João Silva')).toBeInTheDocument();
			expect(screen.getByText('Maria Santos')).toBeInTheDocument();
		});

		it('deve carregar usuários disponíveis', async () => {
			render(
				<AppWrapper>
					<DrawerTeamMembers
						teamId={1}
						isOpen={true}
						onClose={mockOnClose}
					/>
				</AppWrapper>
			);

			await waitFor(() => {
				expect(teamServices.getAvailableUsers).toHaveBeenCalledWith(1);
			});
		});

		it('não deve carregar quando teamId é null', () => {
			render(
				<AppWrapper>
					<DrawerTeamMembers
						teamId={null}
						isOpen={true}
						onClose={mockOnClose}
					/>
				</AppWrapper>
			);

			expect(teamServices.getTeamMembers).not.toHaveBeenCalled();
		});
	});

	describe('Adicionar membros', () => {
		it('deve exibir botão adicionar desabilitado inicialmente', async () => {
			render(
				<AppWrapper>
					<DrawerTeamMembers
						teamId={1}
						isOpen={true}
						onClose={mockOnClose}
					/>
				</AppWrapper>
			);

			await waitFor(() => {
				const button = screen.getByRole('button', { name: /adicionar/i });
				expect(button).toBeDisabled();
			});
		});
	});

	describe('Remover membros', () => {
		it('deve exibir botões de remover', async () => {
			render(
				<AppWrapper>
					<DrawerTeamMembers
						teamId={1}
						isOpen={true}
						onClose={mockOnClose}
					/>
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getAllByText('Remover').length).toBeGreaterThan(0);
			});
		});

		it('deve remover membro ao clicar', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<DrawerTeamMembers
						teamId={1}
						isOpen={true}
						onClose={mockOnClose}
						onMembersChange={mockOnMembersChange}
					/>
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('João Silva')).toBeInTheDocument();
			});

			const removeButtons = screen.getAllByText('Remover');
			await user.click(removeButtons[0]);

			await waitFor(() => {
				expect(teamServices.removeTeamMember).toHaveBeenCalledWith(1, 1);
			});

			expect(mockOnMembersChange).toHaveBeenCalled();
		});
	});

	describe('Lista vazia', () => {
		it('deve exibir mensagem quando sem membros', async () => {
			vi.mocked(teamServices.getTeamMembers).mockResolvedValue([]);

			render(
				<AppWrapper>
					<DrawerTeamMembers
						teamId={1}
						isOpen={true}
						onClose={mockOnClose}
					/>
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Nenhum membro nesta equipe')).toBeInTheDocument();
			});
		});
	});

	describe('Erros', () => {
		it('deve lidar com erro ao carregar membros', async () => {
			vi.mocked(teamServices.getTeamMembers).mockRejectedValue(new Error('Erro'));

			render(
				<AppWrapper>
					<DrawerTeamMembers
						teamId={1}
						isOpen={true}
						onClose={mockOnClose}
					/>
				</AppWrapper>
			);

			await waitFor(() => {
				expect(teamServices.getTeamMembers).toHaveBeenCalled();
			});
		});

		it('deve lidar com erro ao carregar usuários disponíveis', async () => {
			vi.mocked(teamServices.getAvailableUsers).mockRejectedValue(new Error('Erro'));

			render(
				<AppWrapper>
					<DrawerTeamMembers
						teamId={1}
						isOpen={true}
						onClose={mockOnClose}
					/>
				</AppWrapper>
			);

			await waitFor(() => {
				expect(teamServices.getAvailableUsers).toHaveBeenCalled();
			});
		});
	});

	describe('Callback', () => {
		it('deve chamar onMembersChange após remover', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<DrawerTeamMembers
						teamId={1}
						isOpen={true}
						onClose={mockOnClose}
						onMembersChange={mockOnMembersChange}
					/>
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('João Silva')).toBeInTheDocument();
			});

			const removeButtons = screen.getAllByText('Remover');
			await user.click(removeButtons[0]);

			await waitFor(() => {
				expect(mockOnMembersChange).toHaveBeenCalled();
			});
		});
	});
});