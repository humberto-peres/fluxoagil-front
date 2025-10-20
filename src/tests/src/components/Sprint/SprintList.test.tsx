import React from 'react'
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react'
import SprintList, { type SprintItem } from '@/components/Sprint/SprintList'

describe('SprintList (básico)', () => {
  const sprints: SprintItem[] = [
    {
      id: 1,
      name: 'Sprint 1',
      startDate: '01/01/2024',
      endDate: '10/01/2024',
      isActive: true,
      activatedAt: '01/01/2024',
      closedAt: null,
    },
    {
      id: 2,
      name: 'Sprint 2',
      startDate: null,
      endDate: null,
      isActive: false,
      activatedAt: null,
      closedAt: null,
    },
  ]

  it('renderiza itens (sprints + backlog) e marca ativos pelo CSS', () => {
    const { container } = render(
      <SprintList
        sprints={sprints}
        onEdit={vi.fn()}
        onActivate={vi.fn()}
        onClose={vi.fn()}
        onDelete={vi.fn()}
        backlogContent={<div />}
      />
    )

    const items = container.querySelectorAll('.ant-collapse-item')
    expect(items.length).toBe(sprints.length + 1)

    const active = container.querySelectorAll('.ant-collapse-item.ant-collapse-item-active')
    expect(active.length).toBeGreaterThan(0)
  })

  it('abre sprint ativa e a indicada por autoOpen (checa pela classe .ant-collapse-item-active)', () => {
    const { container } = render(
      <SprintList
        sprints={[...sprints, { id: 3, name: 'Sprint 3', startDate: null, endDate: null, isActive: false, activatedAt: null, closedAt: null }]}
        onEdit={vi.fn()}
        onActivate={vi.fn()}
        onClose={vi.fn()}
        autoOpenSprintId={3}
      />
    )

    const active = container.querySelectorAll('.ant-collapse-item.ant-collapse-item-active')
    expect(active.length).toBe(2)
  })

  it('aciona onClose / onEdit na sprint ativa (ícones por ordem: encerrar, editar, [deletar])', () => {
    const onClose = vi.fn()
    const onEdit = vi.fn()

    const { container } = render(
      <SprintList
        sprints={sprints}
        onEdit={onEdit}
        onActivate={vi.fn()}
        onClose={onClose}
        onDelete={vi.fn()}
      />
    )

    const firstItem = container.querySelectorAll('.ant-collapse-item')[0]
    const header = firstItem.querySelector('.ant-collapse-header')!
    const icons = header.querySelectorAll('svg:not([data-icon])')

    fireEvent.click(icons[0])
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onClose.mock.calls[0][0]).toMatchObject({ id: 1 })

    fireEvent.click(icons[1])
    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(onEdit.mock.calls[0][0]).toMatchObject({ id: 1 })
  })

  it('aciona onActivate na sprint inativa (ícones por ordem: ativar, editar, [deletar])', () => {
    const onActivate = vi.fn()

    const { container } = render(
      <SprintList
        sprints={sprints}
        onEdit={vi.fn()}
        onActivate={onActivate}
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    const secondItem = container.querySelectorAll('.ant-collapse-item')[1]
    const header = secondItem.querySelector('.ant-collapse-header')!
    const icons = header.querySelectorAll('svg:not([data-icon])')

    fireEvent.click(icons[0])
    expect(onActivate).toHaveBeenCalledTimes(1)
    expect(onActivate.mock.calls[0][0]).toMatchObject({ id: 2 })
  })
})
