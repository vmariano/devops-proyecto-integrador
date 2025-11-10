import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShopPage from '@/app/shop/page'
import { products } from '@/lib/products'
import { describe, it, expect, vi, beforeEach } from 'vitest'

function mockLoggedIn() {
  vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('true')
}

describe('ShopPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('muestra todos los productos cuando está logueado', async () => {
    mockLoggedIn()
    render(<ShopPage />)

    expect(await screen.findByText(/nuestros productos/i)).toBeInTheDocument()
    const addButtons = await screen.findAllByRole('button', { name: /agregar al carrito/i })
    expect(addButtons).toHaveLength(products.length)
  })

  it('filtra por categoría y búsqueda, y actualiza el contador', async () => {
    mockLoggedIn()
    render(<ShopPage />)

    // Filtrar por categoría Electrónica
    await userEvent.click(screen.getByRole('button', { name: /electrónica/i }))

    // Buscar "smart"
    const search = screen.getByPlaceholderText(/buscar/i)
    await userEvent.clear(search)
    await userEvent.type(search, 'smart')

    // Calcular esperado
    const expected = products.filter(p => p.category === 'electronics').filter(p => p.name.toLowerCase().includes('smart'))

    // Verificar contador
    const countLabel = await screen.findByText(/productos? encontrados/i)
    expect(countLabel.textContent).toContain(String(expected.length))

    // Verificar cantidad de tarjetas renderizadas (por botones de agregar)
    const addButtons = await screen.findAllByRole('button', { name: /agregar al carrito/i })
    expect(addButtons).toHaveLength(expected.length)
  })

  it('logout elimina sesión y navega a /login (push mockeado)', async () => {
    mockLoggedIn()
    const push = vi.fn()
    vi.doMock('next/navigation', async () => {
      const actual: any = await vi.importActual('next/navigation')
      return { ...actual, useRouter: () => ({ push }) }
    })

    // re-importar componente con el mock de arriba aplicado
    const { default: Shop } = await import('@/app/shop/page')
    render(<Shop />)

    const logoutBtn = await screen.findByRole('button', { name: /cerrar sesión/i })
    await userEvent.click(logoutBtn)

    expect(push).toHaveBeenCalledWith('/login')
  })
})
