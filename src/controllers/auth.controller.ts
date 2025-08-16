import { NextFunction, Request, Response } from 'express'

import { HttpStatus, MESSAGES } from '@/constants/message.constant'
import * as AuthTypes from '@/schemas/auth.schema'
import { authService } from '@/services/auth.service'
import { createResponse } from '@/utils/response.utils'

export const registerController = async (
  req: Request<object, object, AuthTypes.RegisterBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.register(req.body)
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
    const result = await authService.login(req.body)
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
    const result = await authService.loginWithToken(req.user?.id)
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
    const result = await authService.refreshAccessToken(req.body.refreshToken)
    const response = createResponse(MESSAGES.SUCCESS.LOGGED_IN, result)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    next(error)
  }
}

export const verifyEmailController = async (
  req: Request<AuthTypes.VerifyEmailParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authService.verifyEmail(req.params.emailVerificationKey)
    const response = createResponse(MESSAGES.SUCCESS.EMAIL_VERIFIED)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    next(error)
  }
}

export const sendVerifyEmailController = async (
  req: Request<object, object, AuthTypes.SendVerifyEmailBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authService.sendVerificationEmail(req.body.email)
    const response = createResponse(MESSAGES.SUCCESS.EMAIL_SENT)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    next(error)
  }
}
