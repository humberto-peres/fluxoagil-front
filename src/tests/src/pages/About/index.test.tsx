import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from 'antd';
import About from '@/pages/About';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderAbout = () => {
  return render(
    <MemoryRouter>
      <App>
        <About />
      </App>
    </MemoryRouter>
  );
};

describe('About', () => {
  it('deve renderizar título principal', () => {
    renderAbout();
    const titles = screen.getAllByText('Fluxo Ágil');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('deve renderizar features principais', () => {
    renderAbout();
    
    expect(screen.getByText('Board Kanban & Sprints')).toBeInTheDocument();
    expect(screen.getByText('Backlog & Épicos')).toBeInTheDocument();
    expect(screen.getByText('Integrações')).toBeInTheDocument();
    expect(screen.getByText('Criação Rápida')).toBeInTheDocument();
  });

  it('deve renderizar tags de tecnologia', () => {
    renderAbout();
    
    expect(screen.getByText('Kanban & Scrum')).toBeInTheDocument();
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByText('GitHub Integration')).toBeInTheDocument();
    expect(screen.getByText('Real-time')).toBeInTheDocument();
  });

  it('deve navegar para login ao clicar em "Começar Gratuitamente"', async () => {
    const user = userEvent.setup();
    renderAbout();
    
    const button = screen.getByText('🚀 Começar Gratuitamente');
    await user.click(button);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('deve exibir seção de FAQ', () => {
    renderAbout();
    
    expect(screen.getByText(/Perguntas frequentes/i)).toBeInTheDocument();
  });

  it('deve renderizar timeline de como funciona', () => {
    renderAbout();
    
    expect(screen.getByText('🏗️ Configure seu Workspace')).toBeInTheDocument();
    expect(screen.getByText('📋 Organize estrategicamente')).toBeInTheDocument();
    expect(screen.getByText('🚀 Execute com excelência')).toBeInTheDocument();
  });

  it('deve renderizar dicas de uso', () => {
    renderAbout();
    
    expect(screen.getByText(/Use atalhos para criar tarefas/i)).toBeInTheDocument();
    expect(screen.getByText(/Relacione tarefas a épicos/i)).toBeInTheDocument();
  });
});