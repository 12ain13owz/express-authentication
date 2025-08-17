import { number, object, string, z } from 'zod'

import { NodeEnv } from '@/consts/env/env.constant'

export const envSchema = object({
  PORT: string()
    .transform((val) => Number(val))
    .pipe(number().int().positive()),
  NODE_ENV: z.enum([NodeEnv.DEVELOPMENT, NodeEnv.PRODUCTION]),
  BASE_URL: string(),
  REDIS_URL: string(),
  DATABASE_URL: string(),
  ACCESS_TOKEN_KEY: string(),
  REFRESH_TOKEN_KEY: string(),
  ACCESS_TOKEN_EXPIRES_IN: string(),
  REFRESH_TOKEN_EXPIRES_IN: string(),
  SMTP_HOST: string(),
  SMTP_PORT: string()
    .transform((val) => Number(val))
    .pipe(number().int().positive()),
  SMTP_SECURE: string().transform((val) => val.toLowerCase() === 'true'),
  SMTP_USERNAME: string(),
  SMTP_PASSWORD: string(),
})

export type EnvSchema = z.infer<typeof envSchema>
