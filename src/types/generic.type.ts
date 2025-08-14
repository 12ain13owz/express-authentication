import { NodeEnv } from '@/constants/env.constant'

export type AppConfig = {
  port: number
  node_env: NodeEnv
}

export interface AppResponse<T> {
  data?: T
  message: string
  timestamp: string
}
