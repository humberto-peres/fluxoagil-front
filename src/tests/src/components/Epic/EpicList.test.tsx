import { describe, it, expect, vi } from 'vitest';
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EpicList from '@/components/Epic/EpicList'

vi.mock('@/hooks/useOpenEpic', () => ({
  useOpenEpic: () => vi.fn(),
}))

vi.mock('antd', async (orig) => {
  const mod = await orig()
  return {
    ...mod,
    Popconfirm: ({ okButtonProps, children }: any) => (
      <div data-ok-disabled={okButtonProps?.disabled ?? false}>{children}</div>
    ),
  }
})

describe('EpicList', () => {
  const epics = [
    {
      id: 1,
      key: 'E-1',
      title: 'Primeiro épico',
      priority: { name: 'Alta', label: 'red' },
      _count: { tasks: 0 }
    },
    {
      id: 2,
      key: 'E-2',
      title: 'Com tarefas',
      priority: { name: 'Média', label: 'orange' },
      _count: { tasks: 3 }
    }
  ] as any[]

  it('renderiza épicos e aciona callbacks', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    const openDrawer = vi.fn()

    render(
      <EpicList
        epics={epics}
        loading={false}
        onEdit={onEdit}
        onDelete={onDelete}
        openDrawer={openDrawer}
        deletingId={null}
      />
    )

    expect(screen.getByText('E-1')).toBeInTheDocument()
    expect(screen.getByText('Primeiro épico')).toBeInTheDocument()
    expect(screen.getByText('E-2')).toBeInTheDocument()

    // Clica no primeiro botão de editar (índice 0) que corresponde ao épico com id: 1
    const editButtons = screen.getAllByLabelText('Editar épico')
    fireEvent.click(editButtons[0])
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }))

    const vinculosBtns = screen.getAllByLabelText('Vínculos do épico')
    fireEvent.click(vinculosBtns[0])
    expect(openDrawer).toHaveBeenCalledWith(1)
  })

  it('marca Popconfirm como desabilitado quando há tarefas vinculadas', () => {
    const { container } = render(
      <EpicList
        epics={epics}
        loading={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        openDrawer={vi.fn()}
        deletingId={null}
      />
    )

    const wrappers = container.querySelectorAll('[data-ok-disabled]')
    expect(wrappers[0].getAttribute('data-ok-disabled')).toBe('false')
    expect(wrappers[1].getAttribute('data-ok-disabled')).toBe('true')
  })
})
