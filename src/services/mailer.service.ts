/* eslint-disable security/detect-object-injection */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createTransport, getTestMessageUrl, Transporter } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

import { config } from '@/config'
import { NodeEnv } from '@/constants/env.constant'
import { APP_NAME, TemplateHtml } from '@/constants/generic.constant'
import { MESSAGES } from '@/constants/message.constant'
import { MailOptions, ResetPasswordData, VerifyEmailData } from '@/types/mailer.type'
import { logger } from '@/utils/logger.utils'

export class MailerService {
  private transporter: Transporter

  constructor() {
    this.transporter = createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUsername,
        pass: config.smtpPassword,
      },
    })
  }

  private loadTemplate(templateName: TemplateHtml): string {
    const templatePath = join(process.cwd(), 'src', 'templates', `${templateName}.html`)
    return readFileSync(templatePath, 'utf-8')
  }

  private replaceTemplateVariables(template: string, data: Record<string, string>): string {
    let result = template
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      result = result.replace(regex, data[key])
    })

    return result
  }

  private async sendEmail(options: MailOptions): Promise<void> {
    const mailOptions = {
      from: config.smtpUsername,
      to: options.to,
      subject: options.subject,
      html: options.html,
    }

    const info = (await this.transporter.sendMail(mailOptions)) as SMTPTransport.SentMessageInfo
    if (config.node_env === NodeEnv.DEVELOPMENT)
      logger.info(`Preview URL: ${getTestMessageUrl(info)}`)
  }

  async sendVerificationEmail(to: string, data: VerifyEmailData): Promise<void> {
    const template = this.loadTemplate(TemplateHtml.VERIFY_EMAIL)
    const html = this.replaceTemplateVariables(template, {
      username: data.username,
      verificationLink: data.verificationLink,
      appName: data.appName || APP_NAME,
      expirationTime: data.expirationTime || '60 minutes',
      currentYear: new Date().getFullYear().toString(),
    })

    await this.sendEmail({ to, subject: MESSAGES.GENERIC.SEND_VERIFICATION_EMAIL, html })
  }

  async sendPasswordResetEmail(to: string, data: ResetPasswordData): Promise<void> {
    const template = this.loadTemplate(TemplateHtml.RESET_PASSWORD)
    const html = this.replaceTemplateVariables(template, {
      username: data.username,
      resetLink: data.resetLink,
      appName: data.appName || APP_NAME,
      expirationTime: data.expirationTime || '60 minutes',
      currentYear: new Date().getFullYear().toString(),
    })

    await this.sendEmail({ to, subject: MESSAGES.GENERIC.SEND_VERIFICATION_EMAIL, html })
  }

  async testConnection(): Promise<void> {
    try {
      await this.transporter.verify()
      logger.info(MESSAGES.SMTP.CONNECTED)
    } catch (error) {
      logger.error([MESSAGES.SMTP.FAILED, error])
      throw error
    }
  }
}

export const mailerService = new MailerService()
