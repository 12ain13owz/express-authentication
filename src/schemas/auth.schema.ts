import * as z from 'zod'

import {
  invalidEmail,
  passwordConfirmation,
  passwordSchema,
  requriedString,
} from '@/utils/schema.utils'

const registerBodySchema = z.object({
  email: invalidEmail('Email'),
  password: passwordSchema('Password'),
  confirmPassword: requriedString('Confirm password'),
  firstName: requriedString('First name'),
  lastName: requriedString('Last name'),
})
const loginBodySchema = z.object({
  email: invalidEmail('Email'),
  password: requriedString('Password'),
})
const loginWithTokanBodySchema = z.object({ token: requriedString('Token') })
const forgotPasswordBodySchema = z.object({ email: invalidEmail('Email') })
const resetPasswordBodySchema = z.object({
  token: requriedString('Token'),
  password: passwordSchema('Password'),
  confirmPassword: requriedString('Confirm password'),
})

export const registerSchema = z.object({ body: passwordConfirmation(registerBodySchema) })
export const loginSchema = z.object({ body: loginBodySchema })
export const loginWithTokenSchema = z.object({ body: loginWithTokanBodySchema })
export const forgotPasswordSchema = z.object({ body: forgotPasswordBodySchema })
export const resetPasswordSchema = z.object({ body: passwordConfirmation(resetPasswordBodySchema) })

export type RegisterBody = z.infer<typeof registerSchema>['body']
export type LoginBody = z.infer<typeof loginSchema>['body']
export type LoginWithTokenBody = z.infer<typeof loginWithTokenSchema>['body']
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>['body']
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>['body']
