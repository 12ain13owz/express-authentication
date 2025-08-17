export const SMTP = {
  CONNECTION: {
    CONNECTED: '[SMTP] ✅ Connection successful',
    FAILED: '[SMTP] ❌ Connection failed',
    DISCONNECTED: '[SMTP] 📭 Disconnected from SMTP',
  },
  EMAIL: {
    VERIFY_SUBJECT: 'Verify your email address',
    RESET_PASSWORD_SUBJECT: 'Reset your password',
    WELCOME_SUBJECT: 'Welcome to our application',
  },
  ERROR: {
    SEND_FAILED: '[SMTP] ❌ Failed to send email',
    TEMPLATE_NOT_FOUND: '[SMTP] 📄 Email template not found',
    INVALID_ADDRESS: '[SMTP] 🚫 Invalid recipient address',
  },
} as const
