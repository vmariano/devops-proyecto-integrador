import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/product-card'
import { describe, it, expect } from 'vitest'

const product = {
  id: 1,
  name: 'Auriculares Inalámbricos',
  description: 'Desc',
  price: 89.99,
  image: '/wireless-headphones.png',
  category: 'electronics',
}

describe('ProductCard', () => {
  it('renderiza datos y precio formateado', () => {
    render(<ProductCard product={product} />)
    expect(screen.getByText(product.name)).toBeInTheDocument()
    expect(screen.getByText('$89.99')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: product.name })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /agregar al carrito/i })).toBeEnabled()
  })
})
