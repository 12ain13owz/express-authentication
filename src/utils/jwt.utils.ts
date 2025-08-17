import { User } from '@prisma/client'
import { sign, verify } from 'jsonwebtoken'

import { config } from '@/config'
import { ERRORS } from '@/consts/systems/errors.const'
import { HttpStatus } from '@/consts/systems/http-status.const'
import { TokenKey } from '@/consts/utils/jwt.const'
import { ErrorSeverity } from '@/consts/utils/logger.const'
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
      throw new AppError(ERRORS.TOKEN.EXPIRED, HttpStatus.UNAUTHORIZED, ErrorSeverity.LOW, {
        functionName: 'VerifyToken',
      })

    if (e.name === 'JsonWebTokenError' && e.message === 'invalid signature')
      throw new AppError(
        ERRORS.TOKEN.INVALID_SIGNATURE,
        HttpStatus.UNAUTHORIZED,
        ErrorSeverity.LOW,
        { functionName: 'VerifyToken' }
      )

    const appError = new AppError(
      ERRORS.TOKEN.VERIFICATION_FAILED,
      HttpStatus.UNAUTHORIZED,
      ErrorSeverity.LOW,
      { functionName: 'VerifyToken' }
    )

    throw appError
  }
}
