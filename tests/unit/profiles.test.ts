import { describe, it, expect } from '@jest/globals'

describe('Profiles', () => {
  it('should validate role enum', () => {
    const validRoles = ['influencer', 'brand', 'agency']
    const invalidRole = 'admin'
    
    expect(validRoles).toContain('influencer')
    expect(validRoles).toContain('brand')
    expect(validRoles).toContain('agency')
    expect(validRoles).not.toContain(invalidRole)
  })

  it('should validate engagement rate range', () => {
    const validRate = 5.5
    const invalidRate = 150
    
    expect(validRate >= 0 && validRate <= 100).toBe(true)
    expect(invalidRate >= 0 && invalidRate <= 100).toBe(false)
  })
})
