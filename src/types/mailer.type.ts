export interface MailOptions {
  to: string
  subject: string
  html: string
}

export interface VerifyEmailData {
  username: string
  verificationLink: string
  appName?: string
  expirationTime?: string
}

export interface ResetPasswordData {
  username: string
  resetLink: string
  appName?: string
  expirationTime?: string
}
