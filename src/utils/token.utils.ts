import { randomBytes } from 'node:crypto'

export const generateVerifyKey = (size = 32): string => {
  return randomBytes(size).toString('base64url')
}

export const getVerifyExpiry = (hours: number): Date => {
  return new Date(Date.now() + hours * 60 * 60 * 1000)
}
