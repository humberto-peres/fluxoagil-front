
import cep from '@/utils/cepUtils'
import { afterAll, describe, expect, it, vi } from 'vitest'

describe('cepUtils.fetchAddress', () => {
  const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  afterAll(() => {
    errSpy.mockRestore()
  })

  it('returns address when CEP is valid', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        logradouro: 'Av. Paulista',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP',
        erro: undefined,
      }),
    })

    const data = await cep.fetchAddress('01311000')
    expect(data).toEqual({
      street: 'Av. Paulista',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
    })
  })

  it('throws on invalid CEP', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ erro: true }),
    })

    await expect(cep.fetchAddress('00000000')).rejects.toThrow('CEP inválido!')
  })
})
