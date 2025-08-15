import { compare, hash } from 'bcrypt'

import { TokenKey } from '@/constants/jwt.constant'
import { ErrorSeverity } from '@/constants/logger.constant'
import { HttpStatus, MESSAGES } from '@/constants/message.constant'
import { User } from '@/generated/prisma'
import { LoginBody, RegisterBody } from '@/schemas/auth.schema'
import { UserResponse, UserResponseWithToken } from '@/types/user.type'
import { AppError } from '@/utils/error-handling.utils'
import { generateToken, VerifyToken } from '@/utils/jwt.utils'

import { userRepository, UserRepository } from './../repository/user.repository'
export class UserService {
  private readonly saltRounds = 10

  constructor(private readonly userRepository: UserRepository) {}

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
    const newUser = await this.userRepository.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    })

    return this.excludePassword(newUser)
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

    const userWithoutPassword = this.excludePassword(existingUser)
    return { user: userWithoutPassword, accessToken, refreshToken }
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

    const userWithoutPassword = this.excludePassword(existingUser)
    return { user: userWithoutPassword, accessToken: newAccessToken }
  }

  async refreshAccessToken(refreshToken: string): Promise<UserResponseWithToken> {
    const decodedToken = VerifyToken(refreshToken, TokenKey.REFRESH_TOKEN_KEY)
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

    const userWithoutPassword = this.excludePassword(existingUser)
    return { user: userWithoutPassword, accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  private excludePassword(user: User): UserResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}

export const userService = new UserService(userRepository)
