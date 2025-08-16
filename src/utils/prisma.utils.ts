import { PrismaClient } from '@prisma/client'

import { DATABASE } from '@/constants/database.constant'

import { logger } from './logger.utils'

export class DatabaseClient {
  private static instance: PrismaClient
  private static isConnected = false

  private static createClient(): PrismaClient {
    return new PrismaClient({ log: ['error', 'warn'] })
  }

  static getInstance(): PrismaClient {
    if (!DatabaseClient.instance) DatabaseClient.instance = this.createClient()

    return DatabaseClient.instance
  }

  static async disconnect(): Promise<void> {
    if (!DatabaseClient.instance) return
    await DatabaseClient.instance.$disconnect()
    DatabaseClient.isConnected = false
    logger.warn(DATABASE.PRISMA.CONNECTION.DISCONNECTED)
  }

  static async healthCheck(): Promise<void> {
    try {
      const client = this.getInstance()
      await client.$queryRaw`SELECT 1`
      this.isConnected = true
      logger.info(DATABASE.PRISMA.CONNECTION.SUCCESS)
    } catch (error) {
      this.isConnected = false
      logger.error([DATABASE.PRISMA.CONNECTION.FAILED, error])
      throw error
    }
  }

  static getConnectionStatus(): boolean {
    return this.isConnected
  }

  static async reconnect(): Promise<void> {
    if (this.instance) await this.disconnect()
    this.instance = this.createClient()

    return this.healthCheck()
  }
}

export const prisma = DatabaseClient.getInstance()
