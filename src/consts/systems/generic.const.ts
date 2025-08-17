export const APP_NAME = 'Express Authentication'

export enum TemplateHtml {
  VERIFY_EMAIL = 'verify-email',
  RESET_PASSWORD = 'reset-password',
}

export const GENERIC = {
  serverListening: (baseUrl: string, port: number) => `Server listening at ${baseUrl}${port}`,
}
