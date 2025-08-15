import { PrismaClient, User } from '@/generated/prisma'
import { CreateUser, UpdateUser } from '@/types/user.type'
import { prisma } from '@/utils/prisma.utils'

export class UserRepository {
  constructor(private readonly userModel: PrismaClient['user'] = prisma.user) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findFirst({ where: { email } })
  }

  async createUser(data: CreateUser): Promise<User> {
    return this.userModel.create({ data })
  }

  async updateUser(id: number, data: UpdateUser): Promise<User> {
    return this.userModel.update({ where: { id }, data })
  }

  async deleteUser(id: number): Promise<User> {
    return this.userModel.delete({ where: { id } })
  }
}

export const userRepository = new UserRepository()
