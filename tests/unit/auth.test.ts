import { describe, it, expect } from '@jest/globals'

describe('Auth', () => {
  it('should validate email format', () => {
    const validEmail = 'test@example.com'
    const invalidEmail = 'invalid-email'
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    expect(emailRegex.test(validEmail)).toBe(true)
    expect(emailRegex.test(invalidEmail)).toBe(false)
  })

  it('should validate password length', () => {
    const validPassword = 'password123'
    const invalidPassword = 'short'
    
    expect(validPassword.length >= 8).toBe(true)
    expect(invalidPassword.length >= 8).toBe(false)
  })
})
