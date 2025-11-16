import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'


// Mock next/image to a plain img to avoid Next.js internals in tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock('next/image', () => {
  return {
    default: (props: any) => {
      const { src, alt, ...rest } = props || {}
      return React.createElement('img', { src, alt, ...rest })
    },
  }
})

// Basic mock for next/navigation's useRouter when not explicitly mocked per-test
vi.mock('next/navigation', async () => {
  const actual: any = await vi.importActual('next/navigation')
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  }
})
