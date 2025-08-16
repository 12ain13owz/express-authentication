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

const refreshTokenBodySchema = z.object({ refreshToken: requriedString('Token') })
const verifyEmailParamsSchema = z.object({ emailVerificationKey: requriedString('Token') })
const sendVerifyEmailBodySchema = z.object({ email: invalidEmail('Email') })
const forgotPasswordBodySchema = z.object({ email: invalidEmail('Email') })
const resetPasswordBodySchema = z.object({
  token: requriedString('Token'),
  password: passwordSchema('Password'),
  confirmPassword: requriedString('Confirm password'),
})

export const registerSchema = z.object({ body: passwordConfirmation(registerBodySchema) })
export const loginSchema = z.object({ body: loginBodySchema })
export const refresTokenhSchema = z.object({ body: refreshTokenBodySchema })
export const verifyEmailSchema = z.object({ params: verifyEmailParamsSchema })
export const sendVerifyEmailSchema = z.object({ body: sendVerifyEmailBodySchema })
export const forgotPasswordSchema = z.object({ body: forgotPasswordBodySchema })
export const resetPasswordSchema = z.object({ body: passwordConfirmation(resetPasswordBodySchema) })

export type RegisterBody = z.infer<typeof registerSchema>['body']
export type LoginBody = z.infer<typeof loginSchema>['body']
export type RefreshTokenBody = z.infer<typeof refresTokenhSchema>['body']
export type VerifyEmailParams = z.infer<typeof verifyEmailSchema>['params']
export type SendVerifyEmailBody = z.infer<typeof sendVerifyEmailSchema>['body']
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>['body']
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>['body']
