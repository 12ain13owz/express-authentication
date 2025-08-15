import { User } from '@/generated/prisma'

export type CreateUser = Pick<User, 'email' | 'password' | 'firstName' | 'lastName'>
export type UpdateUser = Partial<User>
export type UserResponse = Omit<User, 'password'>
export type UserResponseWithToken = UserResponse & { accessToken: string; refreshToken: string }
