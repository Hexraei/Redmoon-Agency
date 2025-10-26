import { test, expect } from '@playwright/test'

test.describe('Proposal Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as influencer user
    await page.goto('/login')
    // Add login steps here
  })

  test('should submit a proposal', async ({ page }) => {
    await page.goto('/dashboard/products')

    // Click on first product
    await page.click('.cursor-pointer')

    // Fill proposal form
    await page.fill('textarea', 'I would love to collaborate on this project')
    await page.fill('input[label="Proposed Rate ($)"]', '300')

    await page.click('button[type="submit"]')

    // Should redirect to proposals page
    await page.waitForTimeout(2000)
    await expect(page).toHaveURL(/\/proposals/)
  })
})
