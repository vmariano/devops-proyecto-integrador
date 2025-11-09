import handler from '@/pages/api/metrics'
import { createMocks } from 'node-mocks-http'
import { register } from 'prom-client'

describe('/api/metrics', () => {
  it('devuelve 200, content-type correcto y contiene prefijo TechStore_', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    await handler(req as any, res as any)
    expect(res._getStatusCode()).toBe(200)
    expect(res.getHeader('Content-Type')).toBe(register.contentType)
    const body = res._getData() as string
    expect(body).toContain('TechStore_')
  })

  it('es idempotente al llamar múltiples veces', async () => {
    const first = createMocks({ method: 'GET' })
    await handler(first.req as any, first.res as any)
    expect(first.res._getStatusCode()).toBe(200)

    const second = createMocks({ method: 'GET' })
    await handler(second.req as any, second.res as any)
    expect(second.res._getStatusCode()).toBe(200)
  })
})
