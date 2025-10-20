import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Protected } from '@/routes/Protected';
import * as authContext from '@/context/AuthContext';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('AppRouter', () => {
  it('deve renderizar rota protegida quando autenticado', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: { id: 1, name: 'Test', role: 'user' } as any,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<Protected><div>Dashboard</div></Protected>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('deve redirecionar para /about quando não autenticado', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<Protected><div>Dashboard</div></Protected>} />
          <Route path="/about" element={<div>About Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('About Page')).toBeInTheDocument();
  });

  it('deve bloquear rota admin para usuário comum', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: { id: 1, name: 'User', role: 'user' } as any,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/user']}>
        <Routes>
          <Route path="/user" element={<Protected roles={['admin']}><div>Admin Page</div></Protected>} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('deve permitir rota admin para usuário admin', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: { id: 1, name: 'Admin', role: 'admin' } as any,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/user']}>
        <Routes>
          <Route path="/user" element={<Protected roles={['admin']}><div>Admin Page</div></Protected>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Page')).toBeInTheDocument();
  });
});