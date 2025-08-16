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
  ZodPipe,
  ZodString,
  ZodTransform,
  ZodType,
} from 'zod'

import { MESSAGES } from '@/constants/message.constant'

export const invalidEmail = (field: string): ZodPipe<ZodEmail, ZodTransform<string, string>> =>
  email({
    error: (issue) =>
      issue.input === undefined
        ? MESSAGES.ERROR.requiredField(field)
        : MESSAGES.ERROR.invalidField(field),
  }).transform((email) => email.toLowerCase())

export const requriedString = (field: string): ZodString =>
  string({
    error: (issue) =>
      issue.input === undefined
        ? MESSAGES.ERROR.requiredField(field)
        : MESSAGES.ERROR.invalidType(field, 'string'),
  }).nonempty({ error: MESSAGES.ERROR.requiredField(field) })

export const requriedNumber = (field: string): ZodNumber =>
  number({
    error: (issue) =>
      issue.input === undefined
        ? MESSAGES.ERROR.requiredField(field)
        : MESSAGES.ERROR.invalidType(field, 'number'),
  })

export const requriedBoolean = (field: string): ZodBoolean =>
  boolean({
    error: (issue) =>
      issue.input === undefined
        ? MESSAGES.ERROR.requiredField(field)
        : MESSAGES.ERROR.invalidType(field, 'boolean'),
  })

export const requriedDate = (field: string): ZodDate =>
  coerce.date({
    error: (issue) =>
      issue.input === undefined
        ? MESSAGES.ERROR.requiredField(field)
        : MESSAGES.ERROR.invalidType(field, 'date'),
  })

export const passwordSchema = (field: string): ZodString =>
  string({
    error: (issue) =>
      issue.input === undefined
        ? MESSAGES.ERROR.requiredField(field)
        : MESSAGES.ERROR.invalidType(field, 'string'),
  })
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
      const primary = data[primaryKey as string]
      const secondary = data[secondaryKey as string]
      return primary === secondary
    },
    {
      message: MESSAGES.ERROR.PASSWORD_NOT_MATCH,
      path: [secondaryKey as string],
    }
  )
}
