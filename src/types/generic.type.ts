import { SignOptions } from 'jsonwebtoken'

import { NodeEnv } from '@/constants/env.constant'

export type AppConfig = {
  port: number
  node_env: NodeEnv
  databaseUrl: string
  accessTokenKey: string
  accessTokenExpiresIn: SignOptions['expiresIn']
  refreshTokenKey: string
  refreshTokenExpiresIn: SignOptions['expiresIn']
}

export interface AppResponse<T> {
  data?: T
  message: string
  timestamp: string
}

export interface JwtPayload {
  id: number
  email: string
}
