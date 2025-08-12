import { NextFunction, Request, Response } from 'express'

import { ErrorSeverity } from '@/constants/logger.constant'
import { HttpStatus, MESSAGES } from '@/constants/message.constant'
import { AppError } from '@/utils/error-handling.util'

export const healthController = {
  success: (_req: Request, res: Response, next: NextFunction): void => {
    try {
      res.status(HttpStatus.OK).json({
        message: MESSAGES.SUCCESS.OK,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      next(error)
    }
  },

  error: (_req: Request, _res: Response, next: NextFunction): void => {
    try {
      throw new AppError('Test error function', HttpStatus.BAD_REQUEST, ErrorSeverity.LOW, {
        functionName: 'healthController.error',
        additionalData: {
          userId: 1,
          name: 'John Doe',
          active: false,
          items: ['1', 2, true, null, undefined, new Date()],
          description: null,
          email: undefined,
          createdAt: new Date(),
        },
      })
    } catch (error) {
      next(error)
    }
  },
}
