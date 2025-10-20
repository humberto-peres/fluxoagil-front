import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useOpenEpic } from '@/hooks/useOpenEpic';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('useOpenEpic', () => {
  it('deve navegar com ID numérico', () => {
    const { result } = renderHook(() => useOpenEpic(), {
      wrapper: MemoryRouter,
    });

    result.current(10);

    expect(mockNavigate).toHaveBeenCalledWith('/epic/10', { state: { from: undefined } });
  });

  it('deve navegar com objeto contendo ID', () => {
    const { result } = renderHook(() => useOpenEpic(), {
      wrapper: MemoryRouter,
    });

    result.current({ id: 20 });

    expect(mockNavigate).toHaveBeenCalledWith('/epic/20', { state: { from: undefined } });
  });

  it('deve navegar com opção from', () => {
    const { result } = renderHook(() => useOpenEpic(), {
      wrapper: MemoryRouter,
    });

    result.current(30, { from: '/board' });

    expect(mockNavigate).toHaveBeenCalledWith('/epic/30', { state: { from: '/board' } });
  });

  it('deve navegar com objeto e opção from', () => {
    const { result } = renderHook(() => useOpenEpic(), {
      wrapper: MemoryRouter,
    });

    result.current({ id: 40 }, { from: '/dashboard' });

    expect(mockNavigate).toHaveBeenCalledWith('/epic/40', { state: { from: '/dashboard' } });
  });
});