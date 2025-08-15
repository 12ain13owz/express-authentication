import { NextFunction, Request, Response } from 'express'

import { HttpStatus, MESSAGES } from '@/constants/message.constant'
import * as AuthTypes from '@/schemas/auth.schema'
import { userService } from '@/services/user.service'
import { createResponse } from '@/utils/response.utils'

export const registerController = async (
  req: Request<object, object, AuthTypes.RegisterBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newUser = await userService.registerUser(req.body)
    const response = createResponse(MESSAGES.SUCCESS.REGISTER, newUser)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    next(error)
  }
}

export const loginController = async (
  req: Request<object, object, AuthTypes.LoginBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const response = createResponse(MESSAGES.SUCCESS.LOGGED_IN)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    next(error)
  }
}
