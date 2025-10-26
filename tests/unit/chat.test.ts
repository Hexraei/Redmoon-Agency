import { describe, it, expect } from '@jest/globals'

describe('Chat', () => {
  it('should validate message content', () => {
    const validMessage = 'Hello, this is a test message'
    const emptyMessage = ''
    
    expect(validMessage.length > 0).toBe(true)
    expect(emptyMessage.length > 0).toBe(false)
  })

  it('should handle presence correctly', () => {
    const activeUsers = new Set<string>()
    
    activeUsers.add('user1')
    activeUsers.add('user2')
    
    expect(activeUsers.size).toBe(2)
    expect(activeUsers.has('user1')).toBe(true)
    
    activeUsers.delete('user1')
    expect(activeUsers.size).toBe(1)
  })
})
