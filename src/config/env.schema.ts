import { z } from 'zod'

import { NodeEnv } from '@/constants/env.constant'

export const envSchema = z.object({
  PORT: z
    .string()
    .optional()
    .transform((val) => Number(val))
    .pipe(z.number().int().positive()),
  NODE_ENV: z.enum([NodeEnv.DEVELOPMENT, NodeEnv.PRODUCTION]),
})

export type EnvSchema = z.infer<typeof envSchema>
