import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from 'antd';
import DrawerUser from '@/pages/Auth/User/DrawerUser';

describe('DrawerUser', () => {
  const mockSetCollapsedUser = vi.fn();
  const mockOnProfileClick = vi.fn();
  const mockOnLogoutClick = vi.fn();

  const defaultProps = {
    setCollapsedUser: mockSetCollapsedUser,
    collapsedUser: true,
    onProfileClick: mockOnProfileClick,
    onLogoutClick: mockOnLogoutClick,
  };

  const renderDrawer = (props = {}) => {
    return render(
      <MemoryRouter>
        <App>
          <DrawerUser {...defaultProps} {...props} />
        </App>
      </MemoryRouter>
    );
  };

  it('deve renderizar quando aberto', async () => {
    renderDrawer();

    await waitFor(() => {
      expect(screen.getByText('Conta')).toBeInTheDocument();
    });

    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('não deve renderizar quando fechado', () => {
    renderDrawer({ collapsedUser: false });

    expect(screen.queryByText('Conta')).not.toBeInTheDocument();
  });

  it('deve chamar onProfileClick ao clicar em "Abrir"', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await waitFor(() => {
      expect(screen.getByText('Abrir')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Abrir'));

    expect(mockOnProfileClick).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onLogoutClick ao clicar em "Encerrar sessão"', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await waitFor(() => {
      expect(screen.getByText('Encerrar sessão')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Encerrar sessão'));

    expect(mockOnLogoutClick).toHaveBeenCalledTimes(1);
  });
});