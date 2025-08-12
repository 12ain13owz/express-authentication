import type { AppConfig } from '@/types/config.type'

import { loadEnvFile } from './env-loader'
import { validateEnv } from './validate-env'

loadEnvFile()
const env = validateEnv()

export const config = Object.freeze({
  port: env.PORT,
  node_env: env.NODE_ENV,
}) satisfies Readonly<AppConfig>
