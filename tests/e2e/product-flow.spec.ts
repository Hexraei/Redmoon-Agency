import { test, expect } from '@playwright/test'

test.describe('Product Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as brand user
    await page.goto('/login')
    // Add login steps here
  })

  test('should create a new product', async ({ page }) => {
    await page.goto('/products/new')

    await page.getByLabel('Title').fill('Test Product')
    await page.fill('textarea', 'This is a test product description')
    await page.getByLabel('Minimum Budget ($)').fill('100')
    await page.getByLabel('Maximum Budget ($)').fill('500')

    await page.click('button[type="submit"]')

    // Should redirect to product detail page
    await page.waitForTimeout(2000)
    await expect(page.getByRole('heading', { name: 'Test Product', exact: true })).toBeVisible()
  })

  test('should list products', async ({ page }) => {
    await page.goto('/products')

    // Should show products list
    await expect(page.locator('h2')).toContainText('Products')
  })
})
