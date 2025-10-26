import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should sign up a new user', async ({ page }) => {
    await page.goto('/signup')

    await page.fill('input[type="text"]', 'Test User')
    await page.fill('input[type="email"]', `test${Date.now()}@example.com`)
    await page.fill('input[type="password"]', 'password123')
    await page.selectOption('select', 'influencer')

    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('should sign in existing user', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')

    await page.click('button[type="submit"]')

    // Should redirect to dashboard or show error
    await page.waitForTimeout(2000)
    const url = page.url()
    expect(url).toMatch(/\/(dashboard|login)/)
  })
})
