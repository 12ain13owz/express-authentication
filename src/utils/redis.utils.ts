import Redis from 'ioredis'

import { config } from '@/config'
import { REDIS } from '@/consts/databases/redis.const'

import { logger } from './logger.utils'

export class RedisClient {
  private static instance: Redis
  private static isConnected = false

  static getInstance(): Redis {
    if (!RedisClient.instance) RedisClient.instance = new Redis(config.redisUrl)
    return RedisClient.instance
  }

  static disconnect(): void {
    if (!RedisClient.instance) return

    RedisClient.instance.disconnect()
    RedisClient.isConnected = false
    logger.warn(REDIS.CONNECTION.DISCONNECTED)
  }

  static async healthCheck(): Promise<void> {
    try {
      const client = this.getInstance()
      const response = await client.ping()

      if (response === 'PONG') {
        logger.info(REDIS.CONNECTION.SUCCESS)
        this.isConnected = true
      } else {
        logger.error(REDIS.CONNECTION.FAILED)
        this.isConnected = false
      }
    } catch (error) {
      this.isConnected = false
      logger.error(REDIS.CONNECTION.UNAVAILABLE)
      throw error
    }
  }

  static getConnectionStatus(): boolean {
    return this.isConnected
  }
}

export const redisClient = RedisClient.getInstance()
