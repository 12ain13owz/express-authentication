import { NextFunction, Request, Response } from 'express'

import { ErrorSeverity } from '@/constants/logger.constant'
import { HttpStatus, MESSAGES } from '@/constants/message.constant'
import { AppError } from '@/utils/error-handling.utils'
import { createResponse } from '@/utils/generic.utils'

export const successController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const response = createResponse(MESSAGES.SUCCESS.OK)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    next(error)
  }
}

export const errorController = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    throw new AppError('Test error function', HttpStatus.BAD_REQUEST, ErrorSeverity.LOW, {
      functionName: 'errorController.error',
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
}
