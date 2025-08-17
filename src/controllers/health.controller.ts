import { NextFunction, Request, Response } from 'express'

import { HttpStatus } from '@/consts/systems/http-status.const'
import { SUCCESS } from '@/consts/systems/success.const'
import { ErrorSeverity } from '@/consts/utils/logger.const'
import { AppError } from '@/utils/error-handling.utils'
import { createResponse } from '@/utils/generic.utils'

export const successController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const response = createResponse(SUCCESS.GENERIC.OK)
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
