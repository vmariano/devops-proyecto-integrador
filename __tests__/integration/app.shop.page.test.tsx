import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { products } from '@/lib/products'
import { describe, it, expect, vi, beforeEach } from 'vitest'


let push = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({push}),
}))

import ShopPage from '@/app/shop/page'

function mockLoggedIn() {
  vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('true')
}

describe('ShopPage', () => {
  beforeEach(() => {
      vi.clearAllMocks()
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
    const countLabel = await screen.findByText(/producto? encontrado/i)
    expect(countLabel.textContent).toContain(String(expected.length))

    // Verificar cantidad de tarjetas renderizadas (por botones de agregar)
    const addButtons = await screen.findAllByRole('button', { name: /agregar al carrito/i })
    expect(addButtons).toHaveLength(expected.length)
  })

  it('logout elimina sesión y navega a / (push mockeado)', async () => {
    mockLoggedIn()

    // re-importar componente con el mock de arriba aplicado
    const { default: ShopPage } = await import('@/app/shop/page')
    render(<ShopPage />)

    const logoutBtn = await screen.findByRole('button', { name: /Cerrar sesión/i })
    await userEvent.click(logoutBtn);
    expect(push).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/');
  })
})
