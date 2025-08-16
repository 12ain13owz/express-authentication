import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

import { AppError } from '@/utils/error-handling.utils'

export type RequestContext = {
  method: string
  url: string
  baseUrl: string
  path: string
  params?: Record<string, unknown>
  query?: Record<string, unknown>
  body?: Record<string, unknown>
}

export type ErrorContext = {
  functionName: string
  requestContext?: RequestContext
  additionalData?: Record<string, unknown>
}

export type AppErrorType = AppError | Error | PrismaClientKnownRequestError
