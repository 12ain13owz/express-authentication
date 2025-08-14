/* eslint-disable no-process-env */
import { ErrorSeverity } from '@/constants/logger.constant'
import { HttpStatus, InternalError } from '@/constants/message.constant'
import { AppError, ErrorLogger } from '@/utils/error-handling.utils'

import { envSchema, EnvSchema } from './env.schema'

export function validateEnv(): EnvSchema {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    const err = new AppError(
      error instanceof Error ? error.message : InternalError.UNKNOWN_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorSeverity.CRITICAL,
      { functionName: 'validateEnv' }
    )
    ErrorLogger.log(err)
    process.exit(1)
  }
}
