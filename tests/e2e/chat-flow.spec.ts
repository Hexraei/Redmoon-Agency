import { test, expect } from '@playwright/test'

test.describe('Chat Flow', () => {
  test('should send and receive messages', async ({ browser }) => {
    // Create two browser contexts for two users
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    // Login as user 1 (influencer)
    await page1.goto('/login')
    // Add login steps

    // Login as user 2 (brand)
    await page2.goto('/login')
    // Add login steps

    // Navigate to same conversation
    const conversationId = 'test-conversation-id'
    await page1.goto(`/dashboard/chat/${conversationId}`)
    await page2.goto(`/dashboard/chat/${conversationId}`)

    // User 1 sends message
    await page1.fill('input[placeholder="Type a message..."]', 'Hello from user 1')
    await page1.click('button[type="submit"]')

    // Wait for message to appear
    await page1.waitForTimeout(1000)

    // User 2 should see the message
    await expect(page2.locator('text=Hello from user 1')).toBeVisible()

    // User 2 sends reply
    await page2.fill('input[placeholder="Type a message..."]', 'Hello from user 2')
    await page2.click('button[type="submit"]')

    await page2.waitForTimeout(1000)

    // User 1 should see the reply
    await expect(page1.locator('text=Hello from user 2')).toBeVisible()

    await context1.close()
    await context2.close()
  })
})
