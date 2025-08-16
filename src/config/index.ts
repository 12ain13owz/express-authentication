import { SignOptions } from 'jsonwebtoken'

import { AppConfig } from '@/types/generic.type'

import { loadEnvFile } from './env-loader'
import { validateEnv } from './validate-env'

loadEnvFile()
const env = validateEnv()

export const config: Readonly<AppConfig> = {
  port: env.PORT,
  node_env: env.NODE_ENV,
  baseUrl: env.BASE_URL,
  redisUrl: env.REDIS_URL,
  databaseUrl: env.DATABASE_URL,
  accessTokenKey: env.ACCESS_TOKEN_KEY,
  accessTokenExpiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
  refreshTokenKey: env.REFRESH_TOKEN_KEY,
  refreshTokenExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
  smtpHost: env.SMTP_HOST,
  smtpPort: env.SMTP_PORT,
  smtpSecure: env.SMTP_SECURE,
  smtpUsername: env.SMTP_USERNAME,
  smtpPassword: env.SMTP_PASSWORD,
} as const
