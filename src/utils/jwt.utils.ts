import { User } from '@prisma/client'
import { sign, verify } from 'jsonwebtoken'

import { config } from '@/config'
import { TokenKey } from '@/constants/jwt.constant'
import { ErrorSeverity } from '@/constants/logger.constant'
import { HttpStatus, MESSAGES } from '@/constants/message.constant'
import { JwtPayload } from '@/types/generic.type'

import { AppError } from './error-handling.utils'

export function generateToken(user: User, tokenKey: TokenKey): string | AppError {
  try {
    const payload: JwtPayload = { id: user.id, email: user.email }
    const secretKey =
      tokenKey === TokenKey.ACCESS_TOKEN_KEY ? config.accessTokenKey : config.refreshTokenKey

    return sign(payload, secretKey, {
      expiresIn: config.accessTokenExpiresIn || '15m',
    })
  } catch (error) {
    const e = error as Error
    const appError = new AppError(e.message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorSeverity.LOW, {
      functionName: 'generateToken',
    })

    throw appError
  }
}

export function verifyToken(token: string, tokenKey: TokenKey): JwtPayload | AppError {
  try {
    const secretKey =
      tokenKey === TokenKey.ACCESS_TOKEN_KEY ? config.accessTokenKey : config.refreshTokenKey
    return verify(token, secretKey) as JwtPayload
  } catch (error) {
    const e = error as Error
    if (e.name === 'TokenExpiredError')
      throw new AppError(MESSAGES.ERROR.TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED, ErrorSeverity.LOW, {
        functionName: 'VerifyToken',
      })

    if (e.name === 'JsonWebTokenError' && e.message === 'invalid signature')
      throw new AppError(
        MESSAGES.ERROR.TOKEN_INVALID_SIGNATURE,
        HttpStatus.UNAUTHORIZED,
        ErrorSeverity.LOW,
        { functionName: 'VerifyToken' }
      )

    const appError = new AppError(
      MESSAGES.ERROR.TOKEN_VERIFICATION_FAILED,
      HttpStatus.UNAUTHORIZED,
      ErrorSeverity.LOW,
      { functionName: 'VerifyToken' }
    )

    throw appError
  }
}
