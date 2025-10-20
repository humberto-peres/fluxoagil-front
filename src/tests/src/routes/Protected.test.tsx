import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Protected } from '@/routes/Protected';
import * as authContext from '@/context/AuthContext';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Protected', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar children quando autenticado', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: { id: 1, name: 'Test User', role: 'user' } as any,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<Protected><div>Protected Content</div></Protected>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
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
          <Route path="/dashboard" element={<Protected><div>Protected Content</div></Protected>} />
          <Route path="/about" element={<div>About Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('About Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('deve retornar null enquanto loading', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: null,
      loading: true,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    const { container } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<Protected><div>Protected Content</div></Protected>} />
        </Routes>
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('deve redirecionar para /dashboard quando usuário não tem role necessária', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: { id: 1, name: 'Regular User', role: 'user' } as any,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<Protected roles={['admin']}><div>Admin Content</div></Protected>} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('deve permitir acesso quando usuário tem role necessária', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: { id: 1, name: 'Admin User', role: 'admin' } as any,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<Protected roles={['admin']}><div>Admin Content</div></Protected>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('deve permitir acesso quando roles não é especificado', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: { id: 1, name: 'Any User', role: 'user' } as any,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/page']}>
        <Routes>
          <Route path="/page" element={<Protected><div>Any User Content</div></Protected>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Any User Content')).toBeInTheDocument();
  });

  it('deve preservar location no state ao redirecionar', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    const TestComponent = () => {
      const location = window.location;
      return <div>Location: {location.pathname}</div>;
    };

    render(
      <MemoryRouter initialEntries={['/protected-page']}>
        <Routes>
          <Route path="/protected-page" element={<Protected><div>Protected</div></Protected>} />
          <Route path="/about" element={<TestComponent />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Location:/)).toBeInTheDocument();
  });
});