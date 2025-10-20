import { render, screen, within, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import React from 'react'

const mockNavigate = vi.fn()
const mockUseLocation = vi.fn().mockReturnValue({ pathname: '/dashboard' })

vi.mock('react-router-dom', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(),
  }
})

const useAuthMock = vi.fn().mockReturnValue({
  user: { name: 'Humberto', role: 'user' },
})
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}))

import DefaultSidebar from '@/components/Layout/Sidebar'

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  vi.clearAllMocks()
  mockUseLocation.mockReturnValue({ pathname: '/dashboard' })
  useAuthMock.mockReturnValue({ user: { name: 'Humberto', role: 'user' } })
})

const renderSidebar = (props?: Partial<React.ComponentProps<typeof DefaultSidebar>>) => {
  return render(
    <DefaultSidebar
      collapsed={false}
      onCollapse={() => { }}
      onBreakpoint={() => { }}
      width={250}
      {...props}
    />
  )
}

describe('DefaultSidebar', () => {
  it('navega ao clicar em um item do menu', async () => {
    renderSidebar()

    await screen.findByRole('menuitem', { name: /dashboard/i })
    const menu = screen.getByRole('menu')
    const backlogItem = within(menu).getByRole('menuitem', { name: /backlog/i })

    await userEvent.click(backlogItem)
    expect(mockNavigate).toHaveBeenCalledWith('/backlog')
  })

  it('navega para /about ao clicar na área do logo', async () => {
    renderSidebar()

    const logoBtn = screen.getByRole('button')
    await userEvent.click(logoBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/about')
  })

  it('mostra grupo Administração e item Usuários quando role é admin', async () => {
    useAuthMock.mockReturnValueOnce({ user: { name: 'Admin', role: 'admin' } })

    renderSidebar()
    await screen.findByRole('menuitem', { name: /dashboard/i })

    const menu = screen.getByRole('menu')
    const { getByText, getByRole } = within(menu)

    expect(getByText('Administração')).toBeInTheDocument()
    expect(getByRole('menuitem', { name: /usuários/i })).toBeInTheDocument()
    expect(screen.getByText('👑 Administrador')).toBeInTheDocument()
  })

  it('aplica classe de colapso quando collapsed=true', async () => {
    const { container, rerender } = renderSidebar({ collapsed: false })
    await screen.findByRole('menuitem', { name: /dashboard/i })

    const sider = container.querySelector('.ant-layout-sider') as HTMLElement
    expect(sider).not.toHaveClass('ant-layout-sider-collapsed')

    rerender(
      <DefaultSidebar
        collapsed
        onCollapse={() => { }}
        onBreakpoint={() => { }}
        width={250}
      />
    )

    await waitFor(() => {
      const s2 = container.querySelector('.ant-layout-sider') as HTMLElement
      expect(s2).toHaveClass('ant-layout-sider-collapsed')
    })
  })

  it('marca item conforme URL atual (ex: /epic)', async () => {
    mockUseLocation.mockReturnValueOnce({ pathname: '/epic' })

    renderSidebar()
    await screen.findByRole('menuitem', { name: /dashboard/i })

    const menu = screen.getByRole('menu')
    const epicItem = within(menu).getByRole('menuitem', { name: /épicos/i })
    expect(epicItem).toHaveClass('ant-menu-item-selected')
  })
})
