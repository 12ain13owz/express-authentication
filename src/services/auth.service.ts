import { compare, hash } from 'bcrypt'

import { config } from '@/config'
import { APP_NAME } from '@/constants/generic.constant'
import { TokenKey } from '@/constants/jwt.constant'
import { ErrorSeverity } from '@/constants/logger.constant'
import { HttpStatus, MESSAGES } from '@/constants/message.constant'
import { Role, User } from '@/generated/prisma'
import { LoginBody, RegisterBody } from '@/schemas/auth.schema'
import { UserResponse, UserResponseWithToken } from '@/types/user.type'
import { AppError } from '@/utils/error-handling.utils'
import { generateToken, verifyToken } from '@/utils/jwt.utils'
import { generateVerifyKey, getVerifyExpiry } from '@/utils/token.utils'

import { mailerService, MailerService } from './mailer.service'
import { userRepository, UserRepository } from '../repository/user.repository'

export class AuthService {
  private readonly saltRounds = 10

  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService
  ) {}

  async register(body: RegisterBody): Promise<UserResponse> {
    const { email, password, firstName, lastName } = body
    const existingUser = await this.userRepository.findUserByEmail(email)
    if (existingUser)
      throw new AppError(
        MESSAGES.ERROR.alreadyExists('Email'),
        HttpStatus.CONFLICT,
        ErrorSeverity.LOW,
        { functionName: 'register' }
      )

    const hashedPassword = await hash(password, this.saltRounds)
    const emailVerificationKey = generateVerifyKey()
    const emailVerificationExpiry = getVerifyExpiry(1)

    const newUser = await this.userRepository.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: [Role.USER],
      emailVerificationKey,
      emailVerificationExpiry,
    })

    await this.mailerService.sendVerificationEmail(email, {
      username: `${firstName} ${lastName}`,
      verificationLink: `${config.baseUrl}/api/auth/verify-email/${emailVerificationKey}`,
      appName: APP_NAME,
      expirationTime: '60 minutes',
    })

    return this.publicUser(newUser)
  }

  async login(body: LoginBody): Promise<UserResponseWithToken> {
    const { email, password } = body
    const existingUser = await this.userRepository.findUserByEmail(email)
    if (!existingUser)
      throw new AppError(MESSAGES.ERROR.notFound('User'), HttpStatus.NOT_FOUND, ErrorSeverity.LOW, {
        functionName: 'login',
      })

    const isValidPassword = await compare(password, existingUser.password)
    if (!isValidPassword)
      throw new AppError(
        MESSAGES.ERROR.EMAIL_PASSWORD_INVALID,
        HttpStatus.UNAUTHORIZED,
        ErrorSeverity.LOW,
        {
          functionName: 'login',
        }
      )

    const accessToken = generateToken(existingUser, TokenKey.ACCESS_TOKEN_KEY)
    if (accessToken instanceof AppError) throw accessToken

    const refreshToken = generateToken(existingUser, TokenKey.REFRESH_TOKEN_KEY)
    if (refreshToken instanceof AppError) throw refreshToken

    const publicUser = this.publicUser(existingUser)
    return { user: publicUser, accessToken, refreshToken }
  }

  async loginWithToken(id?: number): Promise<UserResponseWithToken> {
    if (!id)
      throw new AppError(
        MESSAGES.ERROR.TOKEN_VERIFICATION_FAILED,
        HttpStatus.BAD_REQUEST,
        ErrorSeverity.LOW,
        { functionName: 'loginWithToken' }
      )

    const existingUser = await this.userRepository.findUserById(id)
    if (!existingUser) {
      throw new AppError(MESSAGES.ERROR.notFound('User'), HttpStatus.NOT_FOUND, ErrorSeverity.LOW, {
        functionName: 'loginWithToken',
      })
    }

    const newAccessToken = generateToken(existingUser, TokenKey.ACCESS_TOKEN_KEY)
    if (newAccessToken instanceof AppError) throw newAccessToken

    const userWithoutPassword = this.publicUser(existingUser)
    return { user: userWithoutPassword, accessToken: newAccessToken }
  }

  async refreshAccessToken(refreshToken: string): Promise<UserResponseWithToken> {
    const decodedToken = verifyToken(refreshToken, TokenKey.REFRESH_TOKEN_KEY)
    if (decodedToken instanceof AppError) throw decodedToken

    const existingUser = await this.userRepository.findUserById(decodedToken.id)
    if (!existingUser) {
      throw new AppError(MESSAGES.ERROR.notFound('User'), HttpStatus.NOT_FOUND, ErrorSeverity.LOW, {
        functionName: 'refreshAccessToken',
      })
    }

    const newAccessToken = generateToken(existingUser, TokenKey.ACCESS_TOKEN_KEY)
    if (newAccessToken instanceof AppError) throw newAccessToken

    const newRefreshToken = generateToken(existingUser, TokenKey.REFRESH_TOKEN_KEY)
    if (newRefreshToken instanceof AppError) throw newRefreshToken

    const publicUser = this.publicUser(existingUser)
    return { user: publicUser, accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  async verifyEmail(emailVerificationKey: string): Promise<void> {
    const existingUser = await this.userRepository.findUserByEmailVerificationKey(
      emailVerificationKey
    )
    if (!existingUser)
      throw new AppError(MESSAGES.ERROR.notFound('User'), HttpStatus.NOT_FOUND, ErrorSeverity.LOW, {
        functionName: 'verifyEmail',
      })

    if (existingUser.isVerified) {
      throw new AppError(
        MESSAGES.ERROR.EMAIL_ALREADY_VERIFIED,
        HttpStatus.BAD_REQUEST,
        ErrorSeverity.LOW,
        {
          functionName: 'verifyEmail',
        }
      )
    }

    await this.userRepository.updateUser(existingUser.id, { isVerified: true })
  }

  async sendVerificationEmail(email: string): Promise<void> {
    const existingUser = await this.userRepository.findUserByEmail(email)
    if (!existingUser)
      throw new AppError(MESSAGES.ERROR.notFound('User'), HttpStatus.NOT_FOUND, ErrorSeverity.LOW, {
        functionName: 'sendVerificationEmail',
      })

    if (existingUser.isVerified) {
      throw new AppError(
        MESSAGES.ERROR.EMAIL_ALREADY_VERIFIED,
        HttpStatus.BAD_REQUEST,
        ErrorSeverity.LOW,
        { functionName: 'sendVerificationEmail' }
      )
    }

    const emailVerificationKey = generateVerifyKey()
    const emailVerificationExpiry = getVerifyExpiry(1)

    await this.userRepository.updateUser(existingUser.id, {
      emailVerificationKey,
      emailVerificationExpiry,
    })

    await this.mailerService.sendVerificationEmail(email, {
      username: `${existingUser.firstName} ${existingUser.lastName}`,
      verificationLink: `http://localhost:3000/api/auth/verify-email/${emailVerificationKey}`,
      appName: APP_NAME,
      expirationTime: '60 minutes',
    })
  }

  private publicUser(user: User): UserResponse {
    const publicUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return publicUser
  }
}

export const authService = new AuthService(userRepository, mailerService)
