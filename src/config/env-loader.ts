/* eslint-disable no-process-env */
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import { NodeEnv, EnvFile } from '@/constants/env.constant'
import { ErrorSeverity } from '@/constants/logger.constant'
import { HttpStatus, MESSAGES } from '@/constants/message.constant'
import { AppError, ErrorLogger } from '@/utils/error-handling.util'
import { logger } from '@/utils/logger.util'

export function loadEnvFile(): void {
  const nodeEnv = (process.env.NODE_ENV as NodeEnv | undefined) || NodeEnv.DEVELOPMENT
  const envFile = nodeEnv === NodeEnv.PRODUCTION ? EnvFile.PRODUCTION : EnvFile.DEVELOPMENT
  const envPath = path.resolve(process.cwd(), envFile)

  try {
    if (!fs.existsSync(envPath)) {
      throw new AppError(
        MESSAGES.ERROR.notFoundEnvFile(envFile),
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
