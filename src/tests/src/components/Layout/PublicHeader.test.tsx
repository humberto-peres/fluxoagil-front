import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import PublicHeader from '@/components/Layout/PublicHeader'

const navigateSpy = vi.fn()

vi.mock('react-router-dom', async (orig) => {
  const mod = await orig()
  return { ...mod, useNavigate: () => navigateSpy }
})
vi.mock('@/context/AuthContext', () => ({
  __esModule: true,
  useAuth: () => ({ user: null }),
}))

describe('PublicHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logo navega para /login quando não autenticado', () => {
    render(
      <MemoryRouter>
        <PublicHeader />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByLabelText('Ir para a página inicial'))
    expect(navigateSpy).toHaveBeenCalledWith('/login')
  })

  it('botões navegam para login e signup', () => {
    render(
      <MemoryRouter>
        <PublicHeader />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Entrar'))
    fireEvent.click(screen.getByText('Cadastrar-se'))

    expect(navigateSpy).toHaveBeenCalledWith('/login')
    expect(navigateSpy).toHaveBeenCalledWith('/signup')
  })
})
