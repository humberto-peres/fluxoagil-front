import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'

vi.mock('antd', async (orig) => {
  const mod = await orig()
  return {
    ...mod,
    App: {
      ...mod.App,
      useApp: () => ({ message: { success: vi.fn(), error: vi.fn() } }),
    },
    Popconfirm: ({ onConfirm, children }: any) => {
      const childWithClick = React.cloneElement(children, {
        onClick: () => onConfirm?.(),
      })
      return childWithClick
    },
  }
})

vi.mock('@/services/epic.services', () => ({
  getEpicById: vi.fn(),
}))

vi.mock('@/services/task.services', () => ({
  getTasks: vi.fn(),
  updateTask: vi.fn(),
}))

const { getEpicById } = await import('@/services/epic.services')
const { getTasks, updateTask } = await import('@/services/task.services')

const { default: EpicTaskDrawer } = await import('@/components/Epic/EpicTaskDrawer')

describe('EpicTaskDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('carrega dados e exibe lista de atividades', async () => {
    getEpicById.mockResolvedValue({
      id: 10, key: 'E-10', title: 'Épico 10',
      tasks: [{ id: 101, title: 'Task A', step: { name: 'ToDo' }, priority: { name: 'Alta' } }],
    })
    getTasks.mockResolvedValue([{ id: 201, idTask: 'T-201', title: 'Livre' }])

    render(<EpicTaskDrawer open epicId={10} workspaceId={1} onClose={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText(/Épico 10/)).toBeInTheDocument()
      expect(screen.getByText('Task A')).toBeInTheDocument()
    })
  })

  it('remove atividade do épico via Popconfirm', async () => {
    getEpicById.mockResolvedValue({
      id: 10, key: 'E-10', title: 'Épico 10',
      tasks: [{ id: 101, title: 'Task A' }],
    })
    getTasks.mockResolvedValue([])
    updateTask.mockResolvedValue({})

    render(<EpicTaskDrawer open epicId={10} workspaceId={1} onClose={() => {}} />)

    const removerBtn = await screen.findByRole('button', { name: 'Remover' })
    fireEvent.click(removerBtn)

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith(101, { epicId: null })
    })
  })
})