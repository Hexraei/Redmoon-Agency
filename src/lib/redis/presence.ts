import Redis from 'ioredis'

// Hold a single Redis instance across imports
let redisInstance: Redis | null = null

// In-memory mock store for dev mode (when no Redis URL exists)
const mockPresence = new Map<string, Set<string>>()

/**
 * Returns a Redis client (Upstash or local mock).
 */
export async function getRedisClient() {
  // Upstash/production connection
  if (process.env.REDIS_URL) {
    if (!redisInstance) {
      redisInstance = new Redis(process.env.REDIS_URL, {
        // Upstash requires TLS for secure connection
        tls: {},
        password: process.env.REDIS_TOKEN, // if token provided
      })

      redisInstance.on('connect', () => {
        console.log('✅ Connected to Redis successfully')
      })

      redisInstance.on('error', (err) => {
        console.error('❌ Redis connection error:', err.message)
      })
    }
    return redisInstance
  }

  // Fallback for local / free‑tier development
  return null
}

/**
 * Adds a user's presence to a conversation.
 */
export async function setUserPresence(conversationId: string, userId: string, ttl: number = 30) {
  const client = await getRedisClient()

  if (client) {
    const key = `presence:${conversationId}`
    await client.sadd(key, userId)
    await client.expire(key, ttl)
  } else {
    // Mock mode: Using memory store
    if (!mockPresence.has(conversationId)) {
      mockPresence.set(conversationId, new Set())
    }
    mockPresence.get(conversationId)!.add(userId)

    // Auto‑expire
    setTimeout(() => {
      const users = mockPresence.get(conversationId)
      if (users) {
        users.delete(userId)
        if (users.size === 0) mockPresence.delete(conversationId)
      }
    }, ttl * 1000)
  }
}

/**
 * Removes a user's presence from a conversation.
 */
export async function removeUserPresence(conversationId: string, userId: string) {
  const client = await getRedisClient()
  if (client) {
    const key = `presence:${conversationId}`
    await client.srem(key, userId)
  } else {
    const users = mockPresence.get(conversationId)
    if (users) {
      users.delete(userId)
      if (users.size === 0) mockPresence.delete(conversationId)
    }
  }
}

/**
 * Fetch all active users in a conversation.
 */
export async function getPresence(conversationId: string): Promise<string[]> {
  const client = await getRedisClient()
  if (client) {
    const key = `presence:${conversationId}`
    return await client.smembers(key)
  } else {
    const users = mockPresence.get(conversationId)
    return users ? Array.from(users) : []
  }
}
