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
    const result = await userService.register(req.body)
    const response = createResponse(MESSAGES.SUCCESS.REGISTER, result)
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
    const result = await userService.login(req.body)
    const response = createResponse(MESSAGES.SUCCESS.LOGGED_IN, result)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    next(error)
  }
}

export const loginWithTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.loginWithToken(req.user?.id)
    const response = createResponse(MESSAGES.SUCCESS.LOGGED_IN, result)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    next(error)
  }
}

export const refreshTokenController = async (
  req: Request<object, object, AuthTypes.RefreshTokenBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.refreshAccessToken(req.body.refreshToken)
    const response = createResponse(MESSAGES.SUCCESS.LOGGED_IN, result)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    next(error)
  }
}
