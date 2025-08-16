export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204, // Often used for successful deletions with no response body

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409, // Useful for 'already exists' scenarios
  TOO_MANY_REQUESTS = 429,
  UNPROCESSABLE_ENTITY = 422, // Common for validation errors

  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export enum InternalError {
  UNKNOWN_ERROR = 'Unknown error',
  UNKNOWN_FUNCTION = 'Unknown function',
}

export const MESSAGES = {
  GENERIC: {
    serverListening: (port: number) => `Server listening at http://localhost:${port}`,
    SEND_VERIFICATION_EMAIL: 'Please verify your email address',
    SEND_RESET_PASSWORD_EMAIL: 'Please reset your password',
  },
  SUCCESS: {
    OK: 'Operation successful',
    CREATED: 'Data created successfully',
    UPDATED: 'Data updated successfully',
    DELETED: 'Data deleted successfully',
    REGISTER: 'Registered successfully',
    LOGGED_IN: 'Logged in successfully',
    LOGGED_OUT: 'Logged out successfully',
    SAVED: 'Data saved successfully',
    PASSWORD_RESET: 'Password reset successfully',

    EMAIL_SENT: 'Email sent successfully',
    EMAIL_VERIFIED: 'Email verified successfully',

    create: (name: string) => `Created ${name} successfully`,
    update: (name: string) => `Updated ${name} successfully`,
    delete: (name: string) => `Deleted ${name} successfully`,
    save: (name: string) => `Saved ${name} successfully`,
    upload: (name: string) => `Uploaded ${name} successfully`,
  },
  ERROR: {
    EMAIL_PASSWORD_INVALID: 'Email or password is invalid',
    EMAIL_ALREADY_VERIFIED: 'Email is already verified',
    EMAIL_VERIFICATION_EXPIRED: 'Email verification link is expired',

    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
    PASSWORD_UPPERCASE: 'Password must contain at least one uppercase letter',
    PASSWORD_LOWERCASE: 'Password must contain at least one lowercase letter',
    PASSWORD_NUMBER: 'Password must contain at least one number',
    PASSWORD_SPECIAL_CHAR: 'Password must contain at least one special character',
    PASSWORD_NOT_MATCH: 'Passwords do not match',
    PASSWORD_RESET_EXPIRED: 'Password reset link is expired',

    TOKEN_EXPIRED: 'Token is expired',
    TOKEN_INVALID_SIGNATURE: 'Token is invalid signature',
    TOKEN_NOT_FOUND_REVOKED: 'Token not found or revoked',
    TOKEN_VERIFICATION_FAILED: 'Token verification failed',

    VALIDATION_ERROR: 'An unexpected error occurred during request validation',
    BAD_REQUEST: 'Bad request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not found',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    METHOD_NOT_ALLOWED: 'Method not allowed',
    TOO_MANY_REQUESTS: 'Too many requests. Please try again later',
    BAD_GATEWAY: 'Bad gateway',

    UNAUTHORIZED_ACCESS: 'Unauthorized access',

    notFound: (item: string) => `${item} not found`,
    notFoundEnvFile: (envFile: string) => `Could not find ${envFile}`,
    alreadyExists: (item: string) => `${item} already exists`,
    invalidField: (field: string) => `Invalid ${field} format`,
    invalidType: (field: string, type: string) => `${field} must be of type ${type}`,
    requiredField: (field: string) => `${field} is required`,
    failedAction: (action?: string, target?: string) => `Failed to ${action} ${target}`,
  },

  SMTP: {
    CONNECTED: '[SMTP] ✅ connection successful',
    FAILED: '[SMTP] ❌ connection failed',
    DISCONNECTED: 'Disconnected from SMTP successfully',
  },
}
