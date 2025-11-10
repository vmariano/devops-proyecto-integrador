import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/page'
import { describe, it, expect, vi, beforeEach } from 'vitest'

function setLocalStorageMock() {
  const store: Record<string, string> = {}
    // @ts-ignore
  vi.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((k: string) => store[k] ?? null)
    // @ts-ignore
    vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation((k: string, v: string) => {
    store[k] = v
  })
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('loguea con credenciales válidas y setea localStorage', async () => {
    setLocalStorageMock()
    vi.useFakeTimers()
    render(<LoginPage />)

    await userEvent.type(screen.getByLabelText(/usuario/i), 'admin')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'admin')
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await vi.advanceTimersByTimeAsync(600)
    expect(localStorage.getItem('isLoggedIn')).toBe('true')
    vi.useRealTimers()
  })

  it('muestra error con credenciales inválidas', async () => {
    setLocalStorageMock()
    vi.useFakeTimers()
    render(<LoginPage />)

    await userEvent.type(screen.getByLabelText(/usuario/i), 'bad')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'creds')
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await vi.advanceTimersByTimeAsync(600)
    expect(screen.getByText(/usuario o contraseña incorrectos/i)).toBeInTheDocument()
    vi.useRealTimers()
  })
})
