import { BLACKLIST, REFRESH_TOKEN_KEY } from '@/consts/utils/jwt.const'
import { redisClient } from '@/utils/redis.utils'

export class RedisService {
  async storeRefreshToken(
    userId: number,
    refreshToken: string,
    ttlInSeconds: number
  ): Promise<void> {
    const key = `${REFRESH_TOKEN_KEY}${userId}`
    await redisClient.set(key, refreshToken, 'EX', ttlInSeconds)
  }

  async getRefreshToken(userId: number): Promise<string | null> {
    const key = `${REFRESH_TOKEN_KEY}${userId}`
    return await redisClient.get(key)
  }

  async deleteRefreshToken(userId: number): Promise<void> {
    const key = `${REFRESH_TOKEN_KEY}${userId}`
    await redisClient.del(key)
  }

  async blacklistAccessToken(accessToken: string, ttlInSeconds: number): Promise<void> {
    const key = `${BLACKLIST}${accessToken}`
    await redisClient.set(key, '1', 'EX', ttlInSeconds)
  }

  async isAccessTokenBlacklisted(accessToken: string): Promise<boolean> {
    const key = `${BLACKLIST}${accessToken}`
    const isBlacklisted = await redisClient.get(key)
    return isBlacklisted === '1'
  }
}

export const redisService = new RedisService()
