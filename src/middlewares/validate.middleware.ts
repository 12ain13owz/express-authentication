import { NextFunction, Request, Response } from 'express'
import { ZodError, ZodObject } from 'zod'

import { TokenKey } from '@/constants/jwt.constant'
import { ErrorSeverity } from '@/constants/logger.constant'
import { HttpStatus, MESSAGES } from '@/constants/message.constant'
import { Role } from '@/generated/prisma'
import { userRepository } from '@/repository/user.repository'
import { AppError } from '@/utils/error-handling.utils'
import { verifyToken } from '@/utils/jwt.utils'

export const validateSchema =
  (schema: ZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parse = schema.parse({
        body: req.body as Record<string, unknown>,
        query: req.query,
        params: req.params,
        headers: req.headers,
      })

      req.body = parse.body
      next()
    } catch (error) {
      let message = MESSAGES.ERROR.VALIDATION_ERROR
      let status = HttpStatus.INTERNAL_SERVER_ERROR

      if (error instanceof ZodError) {
        message = error.issues.map((issue) => issue.message).join(', ')
        status = HttpStatus.BAD_REQUEST
      }

      const appError = new AppError(message, status, ErrorSeverity.LOW, {
        functionName: 'validateSchema',
      })
      next(appError)
    }
  }

export const validateToken = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token)
      throw new AppError(
        MESSAGES.ERROR.TOKEN_NOT_FOUND_REVOKED,
        HttpStatus.UNAUTHORIZED,
        ErrorSeverity.LOW,
        {
          functionName: 'verifyToken',
        }
      )

    const decodedToken = verifyToken(token, TokenKey.ACCESS_TOKEN_KEY)
    if (decodedToken instanceof AppError) throw decodedToken

    req.user = decodedToken
    next()
  } catch (error) {
    next(error)
  }
}

export const validateRoles =
  (roles: Role[]) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id)
        throw new AppError(
          MESSAGES.ERROR.notFound('User'),
          HttpStatus.NOT_FOUND,
          ErrorSeverity.LOW,
          {
            functionName: 'findUserById',
          }
        )

      const user = await userRepository.findUserById(req.user.id)
      if (!user)
        throw new AppError(
          MESSAGES.ERROR.notFound('User'),
          HttpStatus.NOT_FOUND,
          ErrorSeverity.LOW,
          {
            functionName: 'findUserById',
          }
        )

      if (!Array.from(user.role).some((role) => roles.includes(role))) {
        throw new AppError(
          MESSAGES.ERROR.UNAUTHORIZED_ACCESS,
          HttpStatus.UNAUTHORIZED,
          ErrorSeverity.LOW,
          {
            functionName: 'validateRoles',
          }
        )
      }

      next()
    } catch (error) {
      next(error)
    }
  }
