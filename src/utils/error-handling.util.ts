import { Request } from 'express'

import {
  ErrorSeverity,
  LogLevel,
  LogSeverity,
} from '@/constants/logger.constant'
import { ErrorContext } from '@/types/error.type'

import { logger } from './logger.util'

export class AppError extends Error {
  constructor(
    message: string,
    public status: number,
    public severity: ErrorSeverity,
    public context: ErrorContext
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  addRequestContext(req: Request) {
    this.context.requestContext = {
      method: req.method,
      url: req.originalUrl,
      baseUrl: req.baseUrl,
      path: req.path,
      body: req.body as Record<string, unknown>,
      params: req.params,
      query: req.query,
    }

    return this
  }
}

export class ErrorLogger {
  private static formatErrorLog(
    error: AppError | Error,
    additionalData?: Record<string, unknown>
  ) {
    const baseLog = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }

    if (error instanceof AppError)
      return {
        ...baseLog,
        status: error.status,
        severity: error.severity,
        ...error.context,
        ...additionalData,
      }

    return {
      ...baseLog,
      status: 500,
      severity: LogSeverity.HIGH,
      ...additionalData,
    }
  }

  static log(
    error: AppError | Error,
    additionalContext?: Partial<ErrorContext>
  ) {
    const errorLog = this.formatErrorLog(error, additionalContext)
    const level: LogLevel =
      error instanceof AppError && error.severity
        ? LogLevel[LogSeverity[error.severity]]
        : LogLevel.ERROR

    switch (level) {
      case LogLevel.INFO:
        logger.info([errorLog])
        break
      case LogLevel.WARN:
        logger.warn([errorLog])
        break
      case LogLevel.ERROR:
        logger.error([errorLog])
        break
      case LogLevel.CRIT:
        logger.crit([errorLog])
        break
      default:
        logger.error([errorLog])
    }

    return errorLog
  }
}

export class ErrorFactory {
  static notFound(
    message: string, // Not Found
    functionName: string,
    additionalData?: Record<string, unknown>
  ) {
    return new AppError(message, 404, ErrorSeverity.LOW, {
      functionName,
      additionalData,
    })
  }

  static badRequest(
    message: string, // Bad Request
    functionName: string,
    additionalData?: Record<string, unknown>
  ) {
    return new AppError(message, 400, ErrorSeverity.MEDIUM, {
      functionName,
      additionalData,
    })
  }

  static unauthorized(
    message: string, // Unauthorized
    functionName: string,
    additionalData?: Record<string, unknown>
  ) {
    return new AppError(message, 401, ErrorSeverity.HIGH, {
      functionName,
      additionalData,
    })
  }

  static serverError(
    message: string, //Internal Server Error
    functionName: string,
    additionalData?: Record<string, unknown>
  ) {
    return new AppError(message, 500, ErrorSeverity.CRITICAL, {
      functionName,
      additionalData,
    })
  }
}
