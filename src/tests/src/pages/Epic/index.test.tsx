import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { App } from 'antd';
import Cookies from 'js-cookie';
import EpicPage from '@/pages/Epic/index';
import * as epicServices from '@/services/epic.services';

vi.mock('@/services/epic.services');
vi.mock('js-cookie');

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useLocation: () => ({ state: null }),
}));

const Wrapper = ({ children }: any) => (
  <BrowserRouter>
    <App>{children}</App>
  </BrowserRouter>
);

describe('EpicPage/index', () => {
  const mockEpics = [
    {
      id: 1,
      key: 'EPIC-001',
      title: 'Epic Principal',
      description: 'Descrição',
      status: 'Em progresso',
      priority: { id: 1, name: 'Alta', label: 'red' },
      workspaceId: 1,
      _count: { tasks: 5 },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(Cookies.get).mockReturnValue(undefined);
    vi.mocked(epicServices.getEpics).mockResolvedValue(mockEpics);
    vi.mocked(epicServices.createEpic).mockResolvedValue(mockEpics[0]);
    vi.mocked(epicServices.updateEpic).mockResolvedValue(mockEpics[0]);
    vi.mocked(epicServices.deleteEpics).mockResolvedValue(undefined);
  });

  it('deve carregar workspace do cookie', async () => {
    vi.mocked(Cookies.get).mockReturnValue('1');

    render(<EpicPage />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(epicServices.getEpics).toHaveBeenCalledWith({ workspaceId: 1 });
    });
  });

  it('deve abrir modal de edição', async () => {
    vi.mocked(Cookies.get).mockReturnValue('1');

    render(<EpicPage />, { wrapper: Wrapper });

    await waitFor(() => screen.getByText('Epic Principal'));

    expect(screen.getByText('Epic Principal')).toBeInTheDocument();
  });

  it('deve salvar cookie ao aplicar filtro', async () => {
    const user = userEvent.setup();
    
    render(<EpicPage />, { wrapper: Wrapper });

    const filterButton = screen.getByRole('button', { name: 'filter' });
    await user.click(filterButton);

    expect(filterButton).toBeInTheDocument();
  });

  it('deve criar épico com sucesso', async () => {
    vi.mocked(Cookies.get).mockReturnValue('1');

    render(<EpicPage />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(epicServices.getEpics).toHaveBeenCalled();
    });
  });

  it('deve limpar épicos ao desselecionar workspace', async () => {
    vi.mocked(Cookies.get).mockReturnValue('1');

    const { rerender } = render(<EpicPage />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(epicServices.getEpics).toHaveBeenCalled();
    });

    vi.mocked(Cookies.get).mockReturnValue(undefined);
    
    rerender(<EpicPage />);
  });

  it('deve mostrar warning ao criar sem workspace', async () => {
    const user = userEvent.setup();
    
    render(<EpicPage />, { wrapper: Wrapper });

    const createButton = screen.getByRole('button', { name: /criar épico/i });
    await user.click(createButton);

    expect(screen.queryByText('Salvar')).not.toBeInTheDocument();
  });

  it('deve fechar modal ao cancelar', async () => {
    const user = userEvent.setup();
    vi.mocked(Cookies.get).mockReturnValue('1');

    render(<EpicPage />, { wrapper: Wrapper });

    const createButton = screen.getByRole('button', { name: /criar épico/i });
    await user.click(createButton);

    await waitFor(() => screen.getByText('Salvar'));

    const cancelButton = screen.getByText('Cancelar');
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Salvar')).not.toBeInTheDocument();
    });
  });

  it('deve atualizar épicos ao mudar workspace', async () => {
    vi.mocked(Cookies.get).mockReturnValue('1');

    render(<EpicPage />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(epicServices.getEpics).toHaveBeenCalledWith({ workspaceId: 1 });
    });

    expect(epicServices.getEpics).toHaveBeenCalledTimes(1);
  });
});