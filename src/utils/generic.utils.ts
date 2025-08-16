import { randomBytes } from 'node:crypto'

import { AppResponse } from '@/types/generic.type'

export const createResponse = <T>(message: string, data?: T): AppResponse<T> => {
  return {
    message: message,
    timestamp: new Date().toISOString(),
    data: data,
  }
}

export const generateVerifyKey = (size = 32): string => {
  return randomBytes(size).toString('base64url')
}

export const getVerifyExpiry = (hours: number): Date => {
  return new Date(Date.now() + hours * 60 * 60 * 1000)
}

export const isVerificationExpired = (expiryDate: Date | null | undefined): boolean => {
  if (!expiryDate) return true
  return expiryDate < new Date()
}
