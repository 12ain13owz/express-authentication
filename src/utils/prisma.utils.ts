import { PrismaClient } from '@prisma/client'

import { DATABASE } from '@/constants/database.constant'

import { logger } from './logger.utils'

export class DatabaseClient {
  private static instance: PrismaClient
  private static isConnected = false

  public static getInstance(): PrismaClient {
    if (!DatabaseClient.instance)
      DatabaseClient.instance = new PrismaClient({ log: ['error', 'warn'] })

    return DatabaseClient.instance
  }

  public static async disconnect(): Promise<void> {
    if (DatabaseClient.instance) {
      await DatabaseClient.instance.$disconnect()
      DatabaseClient.isConnected = false
      logger.warn(DATABASE.CONNECTION.DISCONNECTED)
    }
  }

  // ✅ Health Check Method
  public static async healthCheck(): Promise<void> {
    try {
      const client = this.getInstance()
      await client.$queryRaw`SELECT 1`
      this.isConnected = true
      logger.info(DATABASE.CONNECTION.SUCCESS)
    } catch (error) {
      this.isConnected = false
      logger.error([DATABASE.CONNECTION.FAILED, error])
      throw error
    }
  }

  // ✅ Get Connection Status
  public static getConnectionStatus(): boolean {
    return this.isConnected
  }

  // ✅ Reconnect if needed
  public static async reconnect(): Promise<void> {
    if (this.instance) {
      await this.disconnect()
      this.instance = new PrismaClient()
    }
    return this.healthCheck()
  }
}

export const prisma = DatabaseClient.getInstance()
