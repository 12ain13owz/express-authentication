import { NextFunction, Request, Response } from 'express'

import { TokenKey } from '@/constants/jwt.constant'
import { ErrorSeverity } from '@/constants/logger.constant'
import { HttpStatus, MESSAGES } from '@/constants/message.constant'
import { AppError } from '@/utils/error-handling.utils'
import { VerifyToken } from '@/utils/jwt.utils'

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token)
      throw new AppError(
        MESSAGES.ERROR.TOKEN_NOT_FOUND_REVOKED,
        HttpStatus.UNAUTHORIZED,
        ErrorSeverity.LOW,
        {
          functionName: 'authMiddleware',
        }
      )

    const decodedToken = VerifyToken(token, TokenKey.ACCESS_TOKEN_KEY)
    if (decodedToken instanceof AppError) throw decodedToken

    req.user = decodedToken
    next()
  } catch (error) {
    next(error)
  }
}
