/* eslint-disable no-process-env */
import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'

import { NodeEnv, EnvFile } from '@/consts/env/env.constant'
import { ERRORS } from '@/consts/systems/errors.const'
import { HttpStatus } from '@/consts/systems/http-status.const'
import { ErrorSeverity } from '@/consts/utils/logger.const'
import { AppError, ErrorLogger } from '@/utils/error-handling.utils'
import { logger } from '@/utils/logger.utils'

export function loadEnvFile(): void {
  const nodeEnv = (process.env.NODE_ENV as NodeEnv | undefined) || NodeEnv.DEVELOPMENT
  const envFile = nodeEnv === NodeEnv.PRODUCTION ? EnvFile.PRODUCTION : EnvFile.DEVELOPMENT
  const envPath = path.resolve(process.cwd(), envFile)

  try {
    if (!fs.existsSync(envPath)) {
      throw new AppError(
        ERRORS.UTIL.notFound(envFile),
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorSeverity.CRITICAL,
        { functionName: 'loadEnvFile' }
      )
    }

    dotenv.config({ path: envPath })
    logger.info(`[config] ✅ Loaded environment from: ${envFile}`)
  } catch (error) {
    if (error instanceof AppError) {
      ErrorLogger.log(error)
      process.exit(1)
    }

    console.error(`[config] ❌ Unexpected error loading ${envFile}:`, error)
    process.exit(1)
  }
}
