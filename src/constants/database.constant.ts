export const DATABASE = {
  PRISMA: {
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
  },
  REDIS: {
    CONNECTION: {
      SUCCESS: `[Redis] ✅ Connection successful`,
      FAILED: `[Redis] ❌ Connection failed`,
      DISCONNECTED: '[Redis] 📊 Disconnected',
      RECONNECTING: '[Redis] 🔄 Attempting to reconnect',
      RECONNECT_SUCCESS: '[Redis] ✅ Reconnected successfully',
      RECONNECT_FAILED: '[Redis] ❌ Reconnection failed',
      TIMEOUT: '[Redis] ⏰ Connection timeout',
      UNAVAILABLE: '[Redis] 🚫 Service unavailable',
    },
    HEALTH_CHECK: {
      STARTING: '[Redis] 🔍 Starting health check',
      PASSED: '[Redis] ✅ Health check passed',
      FAILED: '[Redis] ❌ Health check failed',

      retry: (attempt: number, total: number) =>
        `[Redis] 🔄 Health check attempt ${attempt}/${total}`,
      retrying: (seconds: number) => `[Redis] ⏳ Retrying in ${seconds} seconds...`,
    },
    ERRORS: {
      CONNECTION_LOST: '[Redis] Cache connection was lost',
      COMMAND_FAILED: '[Redis] Cache command failed',
      KEY_NOT_FOUND: '[Redis] Cache key not found',
      TIMEOUT_EXCEEDED: '[Redis] Cache operation timeout exceeded',
      PERMISSION_DENIED: '[Redis] Cache permission denied',
      INVALID_COMMAND: '[Redis] Invalid cache command',
      MEMORY_EXCEEDED: '[Redis] Cache memory limit exceeded',
      CLUSTER_DOWN: '[Redis] Cache cluster is down',
    },
    STATUS: {
      CONNECTED: 'Connected',
      DISCONNECTED: 'Disconnected',
      CONNECTING: 'Connecting',
      ERROR: 'Error',
    },
  },
  SERVER: {
    STARTUP_FAILED: '❌ Cannot start server: Database connections failed',
    STARTUP_SUCCESS: '🚀 Server started with database connections',
    SHUTDOWN_GRACEFUL: '🔄 Gracefully shutting down database connections',

    healthEndpoint: (port: number) =>
      `📊 Health check available at: http://localhost:${port}/health`,
  },

  SMTP: {
    CONNECTED: '[SMTP] ✅ Connection successful',
    FAILED: '[SMTP] ❌ Connection failed',
    DISCONNECTED: 'Disconnected from SMTP successfully',
  },
} as const
