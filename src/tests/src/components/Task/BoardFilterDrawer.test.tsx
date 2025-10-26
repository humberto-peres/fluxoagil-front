import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from 'antd';
import BoardFilterDrawer from '@/components/Task/BoardFilterDrawer';
import * as workspaceServices from '@/services/workspace.services';

vi.mock('@/services/workspace.services', () => ({
	getMyWorkspaces: vi.fn(),
	canAccessWorkspace: vi.fn(),
}));

const AppWrapper = ({ children }: { children: React.ReactNode }) => (
	<App>{children}</App>
);

describe('BoardFilterDrawer', () => {
	const mockOnClose = vi.fn();
	const mockOnApply = vi.fn();
	const mockOnClear = vi.fn();

	const mockWorkspaces = [
		{ id: 1, name: 'Workspace 1' },
		{ id: 2, name: 'Workspace 2' },
	];

	const mockSprintOptions = [
		{ label: 'Sprint 1', value: 1 },
		{ label: 'Sprint 2', value: 2 },
	];

	const defaultProps = {
		open: true,
		onClose: mockOnClose,
		onApply: mockOnApply,
		onClear: mockOnClear,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(workspaceServices.getMyWorkspaces).mockResolvedValue(mockWorkspaces);
		vi.mocked(workspaceServices.canAccessWorkspace).mockResolvedValue({ allowed: true });
	});

	describe('Renderização', () => {
		it('deve renderizar quando aberto', async () => {
			render(
				<AppWrapper>
					<BoardFilterDrawer {...defaultProps} />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Filtros')).toBeInTheDocument();
			});
			
			expect(screen.getByText('Workspace')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /aplicar/i })).toBeInTheDocument();
		});

		it('não deve renderizar quando fechado', async () => {
			render(
				<AppWrapper>
					<BoardFilterDrawer {...defaultProps} open={false} />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.queryByText('Workspace')).not.toBeInTheDocument();
			});
		});
	});

	describe('Carregamento', () => {
		it('deve carregar workspaces', async () => {
			render(
				<AppWrapper>
					<BoardFilterDrawer {...defaultProps} />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(workspaceServices.getMyWorkspaces).toHaveBeenCalled();
			});
		});

		it('deve lidar com erro', async () => {
			vi.mocked(workspaceServices.getMyWorkspaces).mockRejectedValue(new Error('Erro'));

			render(
				<AppWrapper>
					<BoardFilterDrawer {...defaultProps} />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(workspaceServices.getMyWorkspaces).toHaveBeenCalled();
			});
		});
	});

	describe('Campos opcionais', () => {
		it('deve exibir seletor de sprint quando habilitado', async () => {
			render(
				<AppWrapper>
					<BoardFilterDrawer
						{...defaultProps}
						showSprintSelector={true}
						sprintOptions={mockSprintOptions}
					/>
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Sprint ativa')).toBeInTheDocument();
			});
		});

		it('não deve exibir seletor de sprint quando desabilitado', async () => {
			render(
				<AppWrapper>
					<BoardFilterDrawer {...defaultProps} showSprintSelector={false} />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.queryByText('Sprint ativa')).not.toBeInTheDocument();
			});
		});

		it('deve exibir toggle quando habilitado', async () => {
			render(
				<AppWrapper>
					<BoardFilterDrawer {...defaultProps} showClosedToggle={true} />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByText('Mostrar sprints encerradas')).toBeInTheDocument();
			});
		});
	});

	describe('Validação de acesso', () => {
		it('deve validar workspace inicial', async () => {
			render(
				<AppWrapper>
					<BoardFilterDrawer {...defaultProps} initialWorkspaceId={1} />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(workspaceServices.canAccessWorkspace).toHaveBeenCalledWith(1);
			});
		});

		it('deve limpar quando sem acesso', async () => {
			vi.mocked(workspaceServices.canAccessWorkspace).mockResolvedValue({
				allowed: false,
			});

			render(
				<AppWrapper>
					<BoardFilterDrawer {...defaultProps} initialWorkspaceId={1} />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(mockOnClear).toHaveBeenCalled();
			});
		});

		it('não deve validar quando workspace é null', async () => {
			render(
				<AppWrapper>
					<BoardFilterDrawer {...defaultProps} initialWorkspaceId={null} />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(workspaceServices.getMyWorkspaces).toHaveBeenCalled();
			});

			expect(workspaceServices.canAccessWorkspace).not.toHaveBeenCalled();
		});
	});

	describe('Ações', () => {
		it('deve chamar onClose ao cancelar', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<BoardFilterDrawer {...defaultProps} />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
			});

			await user.click(screen.getByRole('button', { name: /cancelar/i }));
			expect(mockOnClose).toHaveBeenCalled();
		});

		it('deve chamar onApply ao aplicar', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<BoardFilterDrawer {...defaultProps} />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByRole('button', { name: /aplicar/i })).toBeInTheDocument();
			});

			await user.click(screen.getByRole('button', { name: /aplicar/i }));

			await waitFor(() => {
				expect(mockOnApply).toHaveBeenCalled();
			});
		});

		it('deve chamar onClear ao limpar', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<BoardFilterDrawer {...defaultProps} />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
			});

			await user.click(screen.getByRole('button', { name: /limpar/i }));
			expect(mockOnClear).toHaveBeenCalled();
		});
	});

	describe('Aplicação de filtros', () => {
		it('deve aplicar com workspace inicial', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<BoardFilterDrawer {...defaultProps} initialWorkspaceId={1} />
				</AppWrapper>
			);

			await waitFor(() => {
				expect(workspaceServices.getMyWorkspaces).toHaveBeenCalled();
			});

			await waitFor(() => {
				expect(workspaceServices.canAccessWorkspace).toHaveBeenCalledWith(1);
			});

			const applyButton = screen.getByRole('button', { name: /aplicar/i });

			expect(applyButton).not.toBeDisabled();

			await user.click(applyButton);

			await waitFor(() => {
				expect(mockOnApply).toHaveBeenCalledWith({
					workspaceId: 1,
					sprintId: undefined,
					showClosed: undefined,
				});
			}, { timeout: 3000 });
		});

		it('deve incluir sprint quando habilitado', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<BoardFilterDrawer
						{...defaultProps}
						showSprintSelector={true}
						sprintOptions={mockSprintOptions}
						initialSprintId={1}
					/>
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByRole('button', { name: /aplicar/i })).toBeInTheDocument();
			});

			await user.click(screen.getByRole('button', { name: /aplicar/i }));

			await waitFor(() => {
				expect(mockOnApply).toHaveBeenCalledWith({
					workspaceId: undefined,
					sprintId: 1,
					showClosed: undefined,
				});
			});
		});

		it('deve incluir showClosed quando habilitado', async () => {
			const user = userEvent.setup();
			render(
				<AppWrapper>
					<BoardFilterDrawer
						{...defaultProps}
						showClosedToggle={true}
						initialShowClosed={true}
					/>
				</AppWrapper>
			);

			await waitFor(() => {
				expect(screen.getByRole('button', { name: /aplicar/i })).toBeInTheDocument();
			});

			await user.click(screen.getByRole('button', { name: /aplicar/i }));

			await waitFor(() => {
				expect(mockOnApply).toHaveBeenCalledWith({
					workspaceId: undefined,
					sprintId: undefined,
					showClosed: true,
				});
			});
		});
	});
});