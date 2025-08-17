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

import { ERRORS } from '@/consts/systems/errors.const'

export const invalidEmail = (field: string): ZodPipe<ZodEmail, ZodTransform<string, string>> =>
  email({
    error: (issue) =>
      issue.input === undefined
        ? ERRORS.UTIL.requiredField(field)
        : ERRORS.UTIL.invalidField(field),
  }).transform((email) => email.toLowerCase())

export const requriedString = (field: string): ZodString =>
  string({
    error: (issue) =>
      issue.input === undefined
        ? ERRORS.UTIL.requiredField(field)
        : ERRORS.UTIL.invalidType(field, 'string'),
  }).nonempty({ error: ERRORS.UTIL.requiredField(field) })

export const requriedNumber = (field: string): ZodNumber =>
  number({
    error: (issue) =>
      issue.input === undefined
        ? ERRORS.UTIL.requiredField(field)
        : ERRORS.UTIL.invalidType(field, 'number'),
  })

export const requriedBoolean = (field: string): ZodBoolean =>
  boolean({
    error: (issue) =>
      issue.input === undefined
        ? ERRORS.UTIL.requiredField(field)
        : ERRORS.UTIL.invalidType(field, 'boolean'),
  })

export const requriedDate = (field: string): ZodDate =>
  coerce.date({
    error: (issue) =>
      issue.input === undefined
        ? ERRORS.UTIL.requiredField(field)
        : ERRORS.UTIL.invalidType(field, 'date'),
  })

export const passwordSchema = (field: string): ZodString =>
  string({
    error: (issue) =>
      issue.input === undefined
        ? ERRORS.UTIL.requiredField(field)
        : ERRORS.UTIL.invalidType(field, 'string'),
  })
    .min(8, { error: ERRORS.PASSWORD.MIN_LENGTH })
    .regex(/[A-Z]/, { error: ERRORS.PASSWORD.UPPERCASE })
    .regex(/[a-z]/, { error: ERRORS.PASSWORD.LOWERCASE })
    .regex(/[0-9]/, { error: ERRORS.PASSWORD.NUMBER })
    .regex(/[#?!@$ %^&*-]/, { error: ERRORS.PASSWORD.SPECIAL_CHAR })

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
      message: ERRORS.PASSWORD.NOT_MATCH,
      path: [secondaryKey as string],
    }
  )
}
