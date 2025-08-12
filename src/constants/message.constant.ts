// --- HTTP Status Codes ---
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

// --- Internal Error Types ---
export enum InternalError {
  UNKNOWN_ERROR = 'Unknown error',
  UNKNOWN_FUNCTION = 'Unknown function',
}

// --- Generic Application Messages ---
export const GENERIC = {
  serverListening: (port: number) =>
    `Server listening at http://localhost:${port}`,
} as const

// --- API Response Messages ---
export const MESSAGES = {
  SUCCESS: {
    OK: 'Operation successful',
    CREATED: 'Data created successfully',
    UPDATED: 'Data updated successfully',
    DELETED: 'Data deleted successfully',
    LOGGED_IN: 'Logged in successfully',
    LOGGED_OUT: 'Logged out successfully',
    SAVED: 'Data saved successfully',

    create: (name: string) => `Created ${name} successfully`,
    update: (name: string) => `Updated ${name} successfully`,
    delete: (name: string) => `Deleted ${name} successfully`,
    save: (name: string) => `Saved ${name} successfully`,
    upload: (name: string) => `Uploaded ${name} successfully`,
  },
  ERROR: {
    BAD_REQUEST: 'Bad request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not found',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    METHOD_NOT_ALLOWED: 'Method not allowed',
    TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
    BAD_GATEWAY: 'Bad gateway',

    notFound: (item: string) => `${item} not found`,
    notFoundEnvFile: (envFile: string) => `Could not find ${envFile}`,
    alreadyExists: (item: string) => `${item} already exists`,
    invalidField: (field: string) => `Invalid ${field}`,
    requiredField: (field: string) => `${field} is required`,
    failedAction: (action: string, target: string) =>
      `Failed to ${action} ${target}`,
  },
} as const
