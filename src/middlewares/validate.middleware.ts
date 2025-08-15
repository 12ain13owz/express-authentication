import { NextFunction, Request, Response } from 'express'
import * as z from 'zod'

import { ErrorSeverity } from '@/constants/logger.constant'
import { HttpStatus, MESSAGES } from '@/constants/message.constant'
import { AppError } from '@/utils/error-handling.utils'

export const validate =
  (schema: z.ZodObject) =>
  (req: Request<object>, _res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body as object,
        query: req.query,
        params: req.params,
        headers: req.headers,
      })
      next()
    } catch (error) {
      let message = MESSAGES.ERROR.VALIDATION_ERROR
      let status = HttpStatus.INTERNAL_SERVER_ERROR

      if (error instanceof z.ZodError) {
        message = error.issues.map((issue) => issue.message).join(', ')
        status = HttpStatus.BAD_REQUEST
      }

      const appError = new AppError(message, status, ErrorSeverity.LOW, {
        functionName: 'validate',
      })
      next(appError)
    }
  }
