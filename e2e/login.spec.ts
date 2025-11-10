import { test, expect } from '@playwright/test'

// Nota: para ejecutar este e2e debes tener la app corriendo en :3000
// npm run dev & npx playwright test

test('login -> shop -> logout', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Usuario').fill('admin')
  await page.getByLabel('Contraseña').fill('admin')
  await page.getByRole('button', { name: /iniciar sesión/i }).click()
  await expect(page).toHaveURL(/.*\/shop$/)

  await page.getByRole('button', { name: /cerrar sesión/i }).click()
  await expect(page).toHaveURL(/.*\/login$/)
})
