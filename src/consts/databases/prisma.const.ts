export const PRISMA = {
  CONNECTION: {
    SUCCESS: `[Prisma] ✅ Connection successful`,
    FAILED: `[Prisma] ❌ Connection failed`,
    DISCONNECTED: '[Prisma] 📊 Disconnected',
    RECONNECTING: '[Prisma] 🔄 Attempting to reconnect',
    RECONNECT_SUCCESS: '[Prisma] ✅ Reconnected successfully',
    RECONNECT_FAILED: '[Prisma] ❌ Reconnection failed',
    TIMEOUT: '[Prisma] ⏰ Connection timeout',
    UNAVAILABLE: '[Prisma] 🚫 Service unavailable',
  },
  HEALTH_CHECK: {
    STARTING: '[Prisma] 🔍 Starting health check',
    PASSED: '[Prisma] ✅ Health check passed',
    FAILED: '[Prisma] ❌ Health check failed',

    retry: (attempt: number, total: number) =>
      `[Prisma] 🔄 Health check attempt ${attempt}/${total}`,
    retrying: (seconds: number) => `[Prisma] ⏳ Retrying in ${seconds} seconds...`,
  },
  ERRORS: {
    CONNECTION_LOST: '[Prisma] Database connection was lost',
    QUERY_FAILED: '[Prisma] Database query failed',
    TRANSACTION_FAILED: '[Prisma] Database transaction failed',
    MIGRATION_FAILED: '[Prisma] Database migration failed',
    TIMEOUT_EXCEEDED: '[Prisma] Database operation timeout exceeded',
    PERMISSION_DENIED: '[Prisma] Database permission denied',
    INVALID_QUERY: '[Prisma] Invalid database query',
    CONSTRAINT_VIOLATION: '[Prisma] Database constraint violation',
  },
  STATUS: {
    CONNECTED: 'Connected',
    DISCONNECTED: 'Disconnected',
    CONNECTING: 'Connecting',
    ERROR: 'Error',
  },
} as const
