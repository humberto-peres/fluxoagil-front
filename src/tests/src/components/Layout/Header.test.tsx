import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DefaultHeader from '@/components/Layout/Header'
import { App } from 'antd'

const signOutMock = vi.fn().mockResolvedValue(undefined)
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    signOut: signOutMock,
    user: { name: 'Humberto' },
  }),
}))

vi.mock('@/hooks/useOpenTask', () => ({
  useOpenTask: () => vi.fn(),
}))
vi.mock('@/hooks/useOpenEpic', () => ({
  useOpenEpic: () => vi.fn(),
}))
vi.mock('@/hooks/usePresence', () => ({
  usePresence: () => ({ presence: 'online', lastActiveAt: new Date() }),
  formatAgo: () => 'agora pouco',
}))

vi.mock('@/services/search.services', () => ({
  searchAll: vi.fn().mockResolvedValue([]),
  searchAllFallback: vi.fn().mockResolvedValue([]),
}))

const navigateMock = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('antd', async () => {
  const actual = await vi.importActual<any>('antd')
  return {
    ...actual,
    Popconfirm: ({ children, onConfirm }: any) => (
      <span onClick={() => onConfirm?.()}>{children}</span>
    ),
  }
})

const infoMock = vi.fn()
const successMock = vi.fn()
const errorMock = vi.fn()
vi.spyOn(App, 'useApp').mockReturnValue({
  message: { info: infoMock, success: successMock, error: errorMock },
} as any)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('DefaultHeader', () => {
  it('renderiza avatar e ícones principais', () => {
    render(<DefaultHeader />)
    expect(screen.getByText('H')).toBeInTheDocument()
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
  })

  it('executa signOut e navega no "logout"', async () => {
    render(<DefaultHeader />)
    fireEvent.click(screen.getByTestId('logout-icon'))
    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalledTimes(1)
      expect(successMock).toHaveBeenCalledWith('Sessão encerrada com sucesso')
      expect(navigateMock).toHaveBeenCalledWith('/login')
    })
  })
})
