import {
  boolean,
  coerce,
  email,
  number,
  string,
  ZodBoolean,
  ZodDate,
  ZodEmail,
  ZodNumber,
  ZodString,
  ZodType,
} from 'zod'

import { MESSAGES } from '@/constants/message.constant'

export const invalidEmail = (field: string): ZodEmail =>
  email({ error: MESSAGES.ERROR.invalidField(field) })

export const requriedString = (field: string): ZodString =>
  string({ error: MESSAGES.ERROR.invalidType(field, 'string') }).min(1, {
    error: MESSAGES.ERROR.requiredField(field),
  })

export const requriedNumber = (field: string): ZodNumber =>
  number({ error: MESSAGES.ERROR.invalidType(field, 'number') }).min(1, {
    error: MESSAGES.ERROR.requiredField(field),
  })

export const requriedBoolean = (field: string): ZodBoolean =>
  boolean({ error: MESSAGES.ERROR.invalidType(field, 'boolean') })

export const requriedDate = (field: string): ZodDate =>
  coerce.date({ error: MESSAGES.ERROR.invalidType(field, 'date') })

export const passwordSchema = (field: string): ZodString =>
  string({ error: MESSAGES.ERROR.invalidType(field, 'string') })
    .min(8, { error: MESSAGES.ERROR.PASSWORD_MIN_LENGTH })
    .regex(/[A-Z]/, { error: MESSAGES.ERROR.PASSWORD_UPPERCASE })
    .regex(/[a-z]/, { error: MESSAGES.ERROR.PASSWORD_LOWERCASE })
    .regex(/[0-9]/, { error: MESSAGES.ERROR.PASSWORD_NUMBER })
    .regex(/[#?!@$ %^&*-]/, { error: MESSAGES.ERROR.PASSWORD_SPECIAL_CHAR })

export const passwordConfirmation = <T extends Record<string, unknown>>(
  schema: ZodType<T>,
  primaryKey: keyof T = 'password',
  secondaryKey: keyof T = 'confirmPassword'
) => {
  return schema.refine(
    (data) => {
      const password = data[primaryKey as string]
      const confirmPassword = data[secondaryKey as string]
      return password === confirmPassword
    },
    {
      message: MESSAGES.ERROR.PASSWORD_NOT_MATCH,
      path: [secondaryKey as string],
    }
  )
}
