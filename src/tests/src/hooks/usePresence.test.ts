import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePresence, formatAgo } from '@/hooks/usePresence';

describe('usePresence', () => {
  it('deve iniciar com status online', () => {
    const { result } = renderHook(() => usePresence());

    expect(result.current.presence).toBe('online');
    expect(result.current.lastActiveAt).toBeDefined();
  });

  it('deve atualizar lastActiveAt ao detectar atividade', () => {
    const { result } = renderHook(() => usePresence());

    const initialTime = result.current.lastActiveAt;

    act(() => {
      window.dispatchEvent(new Event('mousemove'));
    });

    expect(result.current.lastActiveAt).toBeGreaterThanOrEqual(initialTime);
  });

  it('deve voltar para online ao detectar keydown', () => {
    const { result } = renderHook(() => usePresence());

    act(() => {
      window.dispatchEvent(new Event('keydown'));
    });

    expect(result.current.presence).toBe('online');
  });
});

describe('formatAgo', () => {
  it('deve formatar segundos', () => {
    const now = Date.now();
    expect(formatAgo(now - 5000)).toBe('5s');
    expect(formatAgo(now - 30000)).toBe('30s');
  });

  it('deve formatar minutos', () => {
    const now = Date.now();
    expect(formatAgo(now - 60000)).toBe('1m');
    expect(formatAgo(now - 120000)).toBe('2m');
    expect(formatAgo(now - 3540000)).toBe('59m');
  });

  it('deve formatar horas', () => {
    const now = Date.now();
    expect(formatAgo(now - 3600000)).toBe('1h');
    expect(formatAgo(now - 7200000)).toBe('2h');
    expect(formatAgo(now - 86400000)).toBe('24h');
  });

  it('deve retornar 0s para tempo futuro', () => {
    const now = Date.now();
    expect(formatAgo(now + 1000)).toBe('0s');
  });
});