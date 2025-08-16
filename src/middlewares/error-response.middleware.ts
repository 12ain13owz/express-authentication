import { NextFunction, Request, Response } from 'express'

import { config } from '@/config'
import { NodeEnv } from '@/constants/env.constant'
import { HttpStatus, MESSAGES } from '@/constants/message.constant'
import { AppError, logErrorWithContext } from '@/utils/error-handling.utils'
import { createResponse } from '@/utils/generic.utils'
import { logger } from '@/utils/logger.utils'

export const errorHandler = async (
  error: AppError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    if (error instanceof AppError) error.addRequestContext(req)
    logErrorWithContext(error, req)

    const status = error instanceof AppError ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
    const message = error.message ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR
    const detail = config.node_env === NodeEnv.DEVELOPMENT ? error : undefined
    const response = createResponse(message, detail)

    res.status(status).json(response)
  } catch (error) {
    logger.error(error)
    const detail = config.node_env === NodeEnv.DEVELOPMENT ? error : undefined
    const response = createResponse(MESSAGES.ERROR.INTERNAL_SERVER_ERROR, detail)

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
  }
}
