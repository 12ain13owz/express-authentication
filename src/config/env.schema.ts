import { number, object, string, z } from 'zod'

import { NodeEnv } from '@/constants/env.constant'

export const envSchema = object({
  PORT: string()
    .optional()
    .transform((val) => Number(val))
    .pipe(number().int().positive()),
  NODE_ENV: z.enum([NodeEnv.DEVELOPMENT, NodeEnv.PRODUCTION]),
  DATABASE_URL: string(),
  ACCESS_TOKEN_KEY: string(),
  REFRESH_TOKEN_KEY: string(),
  ACCESS_TOKEN_EXPIRES_IN: string(),
  REFRESH_TOKEN_EXPIRES_IN: string(),
})

export type EnvSchema = z.infer<typeof envSchema>
