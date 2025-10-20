import React from 'react'
import { describe, it, expect, vi } from 'vitest';
import { render, waitFor, act } from '@testing-library/react'
import { App, Form } from 'antd'
import dayjs from 'dayjs'
import FormSprint from '@/components/Sprint/FormSprint'

/**
 * Helper para renderizar o componente com um Form externo,
 * permitindo usar form.setFieldsValue() e form.submit() nos testes.
 */
const renderWithForm = (ui: (form: any) => React.ReactElement) => {
  const Wrapper: React.FC = () => {
    const [form] = Form.useForm()
    return <App>{ui(form)}</App>
  }
  return render(<Wrapper />)
}

describe('FormSprint', () => {
  it('dispara onFinish com valores válidos', async () => {
    const onFinish = vi.fn()

    let formRef: any
    renderWithForm((form) => {
      formRef = form
      return <FormSprint form={form} onFinish={onFinish} />
    })

    await act(async () => {
      formRef.setFieldsValue({
        name: 'Sprint 1',
        startDate: dayjs('2024-01-01'),
        endDate: dayjs('2024-01-10'),
      })
    })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      formRef.submit()
    })

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledTimes(1)
    })

    const payload = onFinish.mock.calls[0][0]
    expect(payload.name).toBe('Sprint 1')
    expect(dayjs(payload.startDate).isSame(dayjs('2024-01-01'), 'day')).toBe(true)
    expect(dayjs(payload.endDate).isSame(dayjs('2024-01-10'), 'day')).toBe(true)
  })
})