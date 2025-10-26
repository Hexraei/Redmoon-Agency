import { test, expect } from '@playwright/test'

test.describe('Product Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as brand user
    await page.goto('/login')
    // Add login steps here
  })

  test('should create a new product', async ({ page }) => {
    await page.goto('/dashboard/products/new')

    await page.fill('input[label="Title"]', 'Test Product')
    await page.fill('textarea', 'This is a test product description')
    await page.fill('input[label="Minimum Budget ($)"]', '100')
    await page.fill('input[label="Maximum Budget ($)"]', '500')

    await page.click('button[type="submit"]')

    // Should redirect to product detail page
    await page.waitForTimeout(2000)
    await expect(page.locator('h1')).toContainText('Test Product')
  })

  test('should list products', async ({ page }) => {
    await page.goto('/dashboard/products')

    // Should show products list
    await expect(page.locator('h2')).toContainText('Products')
  })
})
