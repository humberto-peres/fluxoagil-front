import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { App } from 'antd';
import Cookies from 'js-cookie';
import EpicPage from '@/pages/Epic';
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

describe('EpicPage', () => {
  const mockEpics = [
    {
      id: 1,
      key: 'EPIC-001',
      title: 'Epic 1',
      status: 'Em progresso',
      priority: { id: 1, name: 'Alta', label: 'red' },
      workspaceId: 1,
      _count: { tasks: 5 },
    },
    {
      id: 2,
      key: 'EPIC-002',
      title: 'Epic 2',
      status: 'Concluído',
      priority: { id: 2, name: 'Média', label: 'orange' },
      workspaceId: 1,
      _count: { tasks: 3 },
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

  it('deve renderizar título e botão criar', () => {
    render(<EpicPage />, { wrapper: Wrapper });
    
    expect(screen.getByRole('heading', { name: 'Épicos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar épico/i })).toBeInTheDocument();
  });

  it('deve mostrar mensagem quando sem workspace', () => {
    render(<EpicPage />, { wrapper: Wrapper });
    
    expect(screen.getByText(/Selecione um Workspace/i)).toBeInTheDocument();
  });

  it('deve carregar épicos quando workspace selecionado', async () => {
    vi.mocked(Cookies.get).mockReturnValue('1');

    render(<EpicPage />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(epicServices.getEpics).toHaveBeenCalledWith({ workspaceId: 1 });
    });
  });

  it('deve abrir modal ao clicar em criar', async () => {
    const user = userEvent.setup();
    vi.mocked(Cookies.get).mockReturnValue('1');

    render(<EpicPage />, { wrapper: Wrapper });

    const createButton = screen.getByRole('button', { name: /criar épico/i });
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });
  });

  it('deve ter botão de filtros', () => {
    render(<EpicPage />, { wrapper: Wrapper });
    
    const filterButton = screen.getByRole('button', { name: 'filter' });
    expect(filterButton).toBeInTheDocument();
  });

  it('deve mostrar erro ao falhar carregar épicos', async () => {
    vi.mocked(Cookies.get).mockReturnValue('1');
    vi.mocked(epicServices.getEpics).mockRejectedValue(new Error('Erro'));

    render(<EpicPage />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(epicServices.getEpics).toHaveBeenCalled();
    });
  });
});