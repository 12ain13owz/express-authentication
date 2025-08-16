import { User } from '@prisma/client'

export type CreateUser = Omit<
  User,
  'id' | 'isVerified' | 'resetPasswordKey' | 'resetPasswordExpiry' | 'createdAt' | 'updatedAt'
>
export type UpdateUser = Partial<User>
export type UserResponse = Omit<
  User,
  | 'password'
  | 'emailVerificationKey'
  | 'emailVerificationExpiry'
  | 'resetPasswordKey'
  | 'resetPasswordExpiry'
>
export interface UserResponseWithToken {
  user: UserResponse
  accessToken?: string
  refreshToken?: string
}
