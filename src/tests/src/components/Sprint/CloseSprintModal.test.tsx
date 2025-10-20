import { describe, it, expect, afterEach } from 'vitest';
import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { vi } from 'vitest'
import { App } from 'antd'

vi.mock('@/services/sprint.services', async () => {
  const actual = await vi.importActual<any>('@/services/sprint.services')
  return {
    ...actual,
    getSprints: vi.fn(),
  }
})

import { getSprints } from '@/services/sprint.services'
import CloseSprintModal from '@/components/Sprint/CloseSprintModal'

const getSprintsMock = getSprints as unknown as ReturnType<typeof vi.fn>

const baseSprint = { id: 10, name: 'Sprint Atual' }

const renderWithProviders = (ui: React.ReactElement) =>
  render(<App>{ui}</App>)

describe('CloseSprintModal', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza corretamente com sprint e texto explicativo', () => {
    renderWithProviders(
      <CloseSprintModal
        open
        sprint={baseSprint as any}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )

    expect(screen.getByText(/encerrar sprint/i)).toBeInTheDocument()
    expect(screen.getByText(/Sprint Atual/)).toBeInTheDocument()
  })

  it('carrega sprints abertas e NÃO inclui a sprint atual na lista', async () => {
    getSprintsMock.mockResolvedValue([
      { id: 10, name: 'Sprint Atual' },
      { id: 11, name: 'Sprint 11' },
      { id: 12, name: 'Sprint 12' },
    ])

    renderWithProviders(
      <CloseSprintModal
        open
        sprint={baseSprint as any}
        workspaceId={1}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )

    const combobox = await screen.findByRole('combobox')
    fireEvent.mouseDown(combobox)

    const dropdown = document.body.querySelector(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden)'
    ) as HTMLElement

    expect(within(dropdown).getByText('Backlog')).toBeInTheDocument()
    expect(within(dropdown).getByText('Sprint 11')).toBeInTheDocument()
    expect(within(dropdown).getByText('Sprint 12')).toBeInTheDocument()
    expect(within(dropdown).queryByText('Sprint Atual')).not.toBeInTheDocument()
  })

  it('chama onConfirm corretamente para backlog e sprint específica', async () => {
    const onConfirm = vi.fn()
    getSprintsMock.mockResolvedValue([
      { id: 20, name: 'Sprint 20' },
    ])

    renderWithProviders(
      <CloseSprintModal
        open
        sprint={baseSprint as any}
        workspaceId={1}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    )

    const okButton = screen.getByRole('button', { name: /encerrar/i })
    fireEvent.click(okButton)

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith({ to: 'backlog' })
    })

    const combobox = await screen.findByRole('combobox')
    fireEvent.mouseDown(combobox)
    const dropdown = document.body.querySelector(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden)'
    ) as HTMLElement
    fireEvent.click(within(dropdown).getByText('Sprint 20'))

    fireEvent.click(okButton)

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith({ to: 'sprint', sprintId: 20 })
    })
  })

  it('reseta o valor para "Backlog" ao reabrir o modal', async () => {
    getSprintsMock.mockResolvedValue([
      { id: 30, name: 'Sprint 30' },
    ])

    const { rerender } = renderWithProviders(
      <CloseSprintModal
        open
        sprint={baseSprint as any}
        workspaceId={1}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )

    const combobox = await screen.findByRole('combobox')
    fireEvent.mouseDown(combobox)
    const dropdown = document.body.querySelector(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden)'
    ) as HTMLElement
    fireEvent.click(within(dropdown).getByText('Sprint 30'))

    rerender(
      <App>
        <CloseSprintModal
          open={false}
          sprint={baseSprint as any}
          workspaceId={1}
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />
      </App>
    )

    rerender(
      <App>
        <CloseSprintModal
          open
          sprint={baseSprint as any}
          workspaceId={1}
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />
      </App>
    )

    const selectWrapper = (await screen.findByRole('combobox')).closest('.ant-select') as HTMLElement
    expect(within(selectWrapper).getByText('Backlog')).toBeInTheDocument()
  })
})
