import { describe, it, expect, vi } from 'vitest';
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Form } from 'antd'
import FormEpic from '@/components/Epic/FormEpic'

vi.mock('@/services/priority.services', () => ({
  getPriorities: vi.fn().mockResolvedValue([
    { id: 1, name: 'Alta', label: 'red' },
    { id: 2, name: 'Média', label: 'orange' },
  ])
}))

type WrapperProps = {
  onFinish: (values: unknown) => void;
  disabled?: boolean;
}

function Wrapper({ onFinish, disabled = false }: WrapperProps) {
  const [form] = Form.useForm()
  return <FormEpic form={form} onFinish={onFinish} disabled={disabled} />
}

describe('FormEpic', () => {
  it('envia com título preenchido', async () => {
    const onFinish = vi.fn()
    render(<Wrapper onFinish={onFinish} />)

    const input = await screen.findByPlaceholderText('Digite o título do épico')
    fireEvent.change(input, { target: { value: 'Novo épico' } })

    fireEvent.submit(input.closest('form')!)

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalled()
    })
    expect(onFinish.mock.calls[0][0]).toEqual(
      expect.objectContaining({ title: 'Novo épico' })
    )
  })
})
