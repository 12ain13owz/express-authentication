import { NextFunction, Request, Response } from 'express'

import { config } from '@/config'
import { NodeEnv } from '@/constants/env.constant'
import { HttpStatus, InternalError, MESSAGES } from '@/constants/message.constant'
import { AppError, ErrorLogger } from '@/utils/error-handling.util'
import { logger } from '@/utils/logger.util'

export const errorHandler = async (
  error: AppError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    if (error instanceof AppError) error.addRequestContext(req)
    const errorLog = ErrorLogger.log(error, {
      functionName: (error as AppError).context?.functionName || InternalError.UNKNOWN_FUNCTION,
      requestContext: {
        method: req.method,
        url: req.url,
        baseUrl: req.baseUrl,
        path: req.path,
        body: req.body as Record<string, unknown>,
        params: req.params,
        query: req.query,
      },
    })

    const response = {
      status: error instanceof AppError ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
      timestamp: new Date().toISOString(),
      ...(config.node_env === NodeEnv.DEVELOPMENT && {
        details: errorLog,
      }),
    }

    res.status(response.status).json(response)
  } catch (error) {
    logger.error(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
    })
  }
}
