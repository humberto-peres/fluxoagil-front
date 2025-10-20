import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '@/pages/NotFound';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/pagina-inexistente' }),
}));

const Wrapper = ({ children }: any) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('NotFound', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar página 404', () => {
    render(<NotFound />, { wrapper: Wrapper });

    expect(screen.getByText('Página não encontrada')).toBeInTheDocument();
  });

  it('deve exibir o pathname atual', () => {
    render(<NotFound />, { wrapper: Wrapper });

    expect(screen.getByText('/pagina-inexistente')).toBeInTheDocument();
  });

  it('deve ter botão para voltar', () => {
    render(<NotFound />, { wrapper: Wrapper });

    const backButton = screen.getByRole('button', { name: /voltar/i });
    expect(backButton).toBeInTheDocument();
  });

  it('deve navegar para trás ao clicar em voltar', async () => {
    const user = userEvent.setup();
    render(<NotFound />, { wrapper: Wrapper });

    const backButton = screen.getByRole('button', { name: /voltar/i });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('deve ter botão para ir ao início', () => {
    render(<NotFound />, { wrapper: Wrapper });

    const homeButton = screen.getByRole('button', { name: /ir para o início/i });
    expect(homeButton).toBeInTheDocument();
  });

  it('deve navegar para home ao clicar em início', async () => {
    const user = userEvent.setup();
    render(<NotFound />, { wrapper: Wrapper });

    const homeButton = screen.getByRole('button', { name: /ir para o início/i });
    await user.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('deve exibir footer com copyright', () => {
    render(<NotFound />, { wrapper: Wrapper });

    expect(screen.getByText('Fluxo Ágil ©2025')).toBeInTheDocument();
  });
});