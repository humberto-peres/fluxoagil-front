import { describe, it, expect, vi } from 'vitest';
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DefaultLayout from '@/components/Layout/DefaultLayout'

vi.mock('@/components/Layout/Sidebar', () => ({
  default: ({ onCollapse, onBreakpoint }: any) => (
    <div>
      <button aria-label="collapse" onClick={() => onCollapse(true)}>
        Collapse
      </button>
      <button aria-label="breakpoint" onClick={() => onBreakpoint(true)}>
        Breakpoint
      </button>
    </div>
  ),
}))

vi.mock('@/components/Layout/Header', () => ({
  default: ({ onToggleSidebar }: any) => (
    <button aria-label="toggle" onClick={onToggleSidebar}>
      Toggle
    </button>
  ),
}))

vi.mock('@/components/UI/SubHeader', () => ({
  default: ({
    title,
    subtitle,
    addButton,
    textButton,
    onAddClick,
  }: any) => (
    <div>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {addButton && (
        <button onClick={onAddClick}>{textButton || 'Adicionar'}</button>
      )}
    </div>
  ),
}))

describe('DefaultLayout', () => {
  it('renderiza título e botão de adicionar', () => {
    const onAddClick = vi.fn()
    render(
      <DefaultLayout
        title="Dashboard"
        subtitle="Resumo geral"
        addButton
        textButton="Novo item"
        onAddClick={onAddClick}
      >
        <p>Conteúdo de teste</p>
      </DefaultLayout>,
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Resumo geral')).toBeInTheDocument()
    expect(screen.getByText('Novo item')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo de teste')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Novo item'))
    expect(onAddClick).toHaveBeenCalled()
  })

  it('colapsa e expande sidebar corretamente', () => {
    render(<DefaultLayout title="Test" />)

    fireEvent.click(screen.getByLabelText('collapse'))

    fireEvent.click(screen.getByLabelText('breakpoint'))

    fireEvent.click(screen.getByLabelText('toggle'))

    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
