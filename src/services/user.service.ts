import { hash } from 'bcrypt'

import { ErrorSeverity } from '@/constants/logger.constant'
import { HttpStatus, MESSAGES } from '@/constants/message.constant'
import { User } from '@/generated/prisma'
import { RegisterBody } from '@/schemas/auth.schema'
import { UserResponse } from '@/types/user.type'
import { AppError } from '@/utils/error-handling.utils'

import { userRepository, UserRepository } from './../repository/user.repository'
export class UserService {
  private readonly saltRounds = 10

  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(body: RegisterBody): Promise<UserResponse> {
    const { email, password, firstName, lastName } = body
    const existingUser = await this.userRepository.findUserByEmail(email)
    if (existingUser)
      throw new AppError(
        MESSAGES.ERROR.alreadyExists('Email'),
        HttpStatus.CONFLICT,
        ErrorSeverity.LOW,
        { functionName: 'registerUser' }
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

  private excludePassword(user: User): UserResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}

export const userService = new UserService(userRepository)
