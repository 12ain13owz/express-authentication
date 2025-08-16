import { Prisma, Role, User } from '@prisma/client'
import { compare, hash } from 'bcrypt'

import { config } from '@/config'
import { APP_NAME } from '@/constants/generic.constant'
import { TokenKey } from '@/constants/jwt.constant'
import { ErrorSeverity } from '@/constants/logger.constant'
import { HttpStatus, MESSAGES } from '@/constants/message.constant'
import { LoginBody, RegisterBody } from '@/schemas/auth.schema'
import { UserResponse, UserResponseWithToken } from '@/types/user.type'
import { AppError } from '@/utils/error-handling.utils'
import { generateVerifyKey, getVerifyExpiry, isVerificationExpired } from '@/utils/generic.utils'
import { generateToken, verifyToken } from '@/utils/jwt.utils'

import { mailerService, MailerService } from './mailer.service'
import { userRepository, UserRepository } from '../repository/user.repository'

export class AuthService {
  private readonly saltRounds = 10

  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService
  ) {}

  async register(body: RegisterBody): Promise<UserResponse> {
    try {
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
    } catch (error) {
      if (error instanceof AppError) throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        throw new AppError(
          MESSAGES.ERROR.failedAction('register', 'account'),
          HttpStatus.BAD_REQUEST,
          ErrorSeverity.LOW,
          { functionName: 'register' }
        )

      const e = error as Error
      throw new AppError(e.message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorSeverity.MEDIUM, {
        functionName: 'register',
      })
    }
  }

  async login(body: LoginBody): Promise<UserResponseWithToken> {
    try {
      const { email, password } = body
      const existingUser = await this.userRepository.findUserByEmail(email)
      if (!existingUser)
        throw new AppError(
          MESSAGES.ERROR.notFound('User'),
          HttpStatus.NOT_FOUND,
          ErrorSeverity.LOW,
          { functionName: 'login' }
        )

      const isValidPassword = await compare(password, existingUser.password)
      if (!isValidPassword)
        throw new AppError(
          MESSAGES.ERROR.EMAIL_PASSWORD_INVALID,
          HttpStatus.UNAUTHORIZED,
          ErrorSeverity.LOW,
          { functionName: 'login' }
        )

      const accessToken = generateToken(existingUser, TokenKey.ACCESS_TOKEN_KEY)
      if (accessToken instanceof AppError) throw accessToken

      const refreshToken = generateToken(existingUser, TokenKey.REFRESH_TOKEN_KEY)
      if (refreshToken instanceof AppError) throw refreshToken

      const publicUser = this.publicUser(existingUser)
      return { user: publicUser, accessToken, refreshToken }
    } catch (error) {
      if (error instanceof AppError) throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        throw new AppError(
          MESSAGES.ERROR.failedAction('login', 'account'),
          HttpStatus.BAD_REQUEST,
          ErrorSeverity.LOW,
          { functionName: 'login' }
        )

      const e = error as Error
      throw new AppError(e.message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorSeverity.MEDIUM, {
        functionName: 'login',
      })
    }
  }

  async loginWithToken(id?: number): Promise<UserResponseWithToken> {
    try {
      if (!id)
        throw new AppError(
          MESSAGES.ERROR.TOKEN_VERIFICATION_FAILED,
          HttpStatus.BAD_REQUEST,
          ErrorSeverity.LOW,
          { functionName: 'loginWithToken' }
        )

      const existingUser = await this.userRepository.findUserById(id)
      if (!existingUser) {
        throw new AppError(
          MESSAGES.ERROR.notFound('User'),
          HttpStatus.NOT_FOUND,
          ErrorSeverity.LOW,
          { functionName: 'loginWithToken' }
        )
      }

      const newAccessToken = generateToken(existingUser, TokenKey.ACCESS_TOKEN_KEY)
      if (newAccessToken instanceof AppError) throw newAccessToken

      const userWithoutPassword = this.publicUser(existingUser)
      return { user: userWithoutPassword, accessToken: newAccessToken }
    } catch (error) {
      if (error instanceof AppError) throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        throw new AppError(
          MESSAGES.ERROR.failedAction('login', 'account'),
          HttpStatus.BAD_REQUEST,
          ErrorSeverity.LOW,
          { functionName: 'loginWithToken' }
        )

      const e = error as Error
      throw new AppError(e.message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorSeverity.MEDIUM, {
        functionName: 'loginWithToken',
      })
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<UserResponseWithToken> {
    try {
      const decodedToken = verifyToken(refreshToken, TokenKey.REFRESH_TOKEN_KEY)
      if (decodedToken instanceof AppError) throw decodedToken

      const existingUser = await this.userRepository.findUserById(decodedToken.id)
      if (!existingUser) {
        throw new AppError(
          MESSAGES.ERROR.notFound('User'),
          HttpStatus.NOT_FOUND,
          ErrorSeverity.LOW,
          { functionName: 'refreshAccessToken' }
        )
      }

      const newAccessToken = generateToken(existingUser, TokenKey.ACCESS_TOKEN_KEY)
      if (newAccessToken instanceof AppError) throw newAccessToken

      const newRefreshToken = generateToken(existingUser, TokenKey.REFRESH_TOKEN_KEY)
      if (newRefreshToken instanceof AppError) throw newRefreshToken

      const publicUser = this.publicUser(existingUser)
      return { user: publicUser, accessToken: newAccessToken, refreshToken: newRefreshToken }
    } catch (error) {
      if (error instanceof AppError) throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        throw new AppError(
          MESSAGES.ERROR.failedAction('login', 'account'),
          HttpStatus.BAD_REQUEST,
          ErrorSeverity.LOW,
          { functionName: 'refreshAccessToken' }
        )

      const e = error as Error
      throw new AppError(e.message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorSeverity.MEDIUM, {
        functionName: 'refreshAccessToken',
      })
    }
  }

  async verifyEmail(emailVerificationKey: string): Promise<void> {
    try {
      const existingUser = await this.userRepository.findUserByEmailVerificationKey(
        emailVerificationKey
      )
      if (!existingUser)
        throw new AppError(
          MESSAGES.ERROR.notFound('User'),
          HttpStatus.NOT_FOUND,
          ErrorSeverity.LOW,
          { functionName: 'verifyEmail' }
        )

      if (existingUser.isVerified) {
        throw new AppError(
          MESSAGES.ERROR.EMAIL_ALREADY_VERIFIED,
          HttpStatus.BAD_REQUEST,
          ErrorSeverity.LOW,
          { functionName: 'verifyEmail' }
        )
      }

      if (isVerificationExpired(existingUser.emailVerificationExpiry)) {
        throw new AppError(
          MESSAGES.ERROR.EMAIL_VERIFICATION_EXPIRED,
          HttpStatus.BAD_REQUEST,
          ErrorSeverity.LOW,
          { functionName: 'verifyEmail' }
        )
      }

      await this.userRepository.updateUser(existingUser.id, {
        isVerified: true,
        emailVerificationKey: null,
        emailVerificationExpiry: null,
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        throw new AppError(
          MESSAGES.ERROR.failedAction('verify', 'email'),
          HttpStatus.BAD_REQUEST,
          ErrorSeverity.LOW,
          { functionName: 'verifyEmail' }
        )

      const e = error as Error
      throw new AppError(e.message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorSeverity.MEDIUM, {
        functionName: 'verifyEmail',
      })
    }
  }

  async sendVerificationEmail(email: string): Promise<void> {
    try {
      const existingUser = await this.userRepository.findUserByEmail(email)
      if (!existingUser)
        throw new AppError(
          MESSAGES.ERROR.notFound('User'),
          HttpStatus.NOT_FOUND,
          ErrorSeverity.LOW,
          { functionName: 'sendVerificationEmail' }
        )

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
        verificationLink: `${config.baseUrl}/api/auth/verify-email/${emailVerificationKey}`,
        appName: APP_NAME,
        expirationTime: '60 minutes',
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        throw new AppError(
          MESSAGES.ERROR.failedAction('send', 'email verification'),
          HttpStatus.BAD_REQUEST,
          ErrorSeverity.LOW,
          { functionName: 'sendVerificationEmail' }
        )

      const e = error as Error
      throw new AppError(e.message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorSeverity.MEDIUM, {
        functionName: 'sendVerificationEmail',
      })
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const existingUser = await this.userRepository.findUserByEmail(email)
      if (!existingUser)
        throw new AppError(
          MESSAGES.ERROR.notFound('User'),
          HttpStatus.NOT_FOUND,
          ErrorSeverity.LOW,
          { functionName: 'forgotPassword' }
        )

      const resetPasswordKey = generateVerifyKey()
      const resetPasswordExpiry = getVerifyExpiry(1)

      await this.userRepository.updateUser(existingUser.id, {
        resetPasswordKey,
        resetPasswordExpiry,
      })

      await this.mailerService.sendPasswordResetEmail(email, {
        username: `${existingUser.firstName} ${existingUser.lastName}`,
        resetLink: `${config.baseUrl}/api/auth/reset-password/${resetPasswordKey}`,
        appName: APP_NAME,
        expirationTime: '60 minutes',
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        throw new AppError(
          MESSAGES.ERROR.failedAction('send', 'password reset'),
          HttpStatus.BAD_REQUEST,
          ErrorSeverity.LOW,
          { functionName: 'forgotPassword' }
        )

      const e = error as Error
      throw new AppError(e.message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorSeverity.MEDIUM, {
        functionName: 'forgotPassword',
      })
    }
  }

  async resetPassword(passwordResetKey: string, newPassword: string): Promise<void> {
    try {
      const existingUser = await this.userRepository.findUserByResetPasswordKey(passwordResetKey)
      if (!existingUser)
        throw new AppError(
          MESSAGES.ERROR.notFound('User'),
          HttpStatus.NOT_FOUND,
          ErrorSeverity.LOW,
          { functionName: 'resetPassword' }
        )

      if (isVerificationExpired(existingUser.resetPasswordExpiry)) {
        throw new AppError(
          MESSAGES.ERROR.PASSWORD_RESET_EXPIRED,
          HttpStatus.BAD_REQUEST,
          ErrorSeverity.LOW,
          { functionName: 'resetPassword' }
        )
      }

      const hashedPassword = await hash(newPassword, this.saltRounds)
      await this.userRepository.updateUser(existingUser.id, {
        password: hashedPassword,
        resetPasswordKey: null,
        resetPasswordExpiry: null,
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        throw new AppError(
          MESSAGES.ERROR.failedAction('reset', 'password'),
          HttpStatus.BAD_REQUEST,
          ErrorSeverity.LOW,
          { functionName: 'resetPassword' }
        )

      const e = error as Error
      throw new AppError(e.message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorSeverity.MEDIUM, {
        functionName: 'resetPassword',
      })
    }
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
