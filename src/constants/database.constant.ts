export const DATABASE = {
  CONNECTION: {
    SUCCESS: `[Database] ✅ connection successful`,
    FAILED: `[Database] ❌ connection failed`,
    DISCONNECTED: '📊 Database disconnected',
    RECONNECTING: '🔄 Attempting to reconnect to database',
    RECONNECT_SUCCESS: '✅ Database reconnected successfully',
    RECONNECT_FAILED: '❌ Database reconnection failed',
    TIMEOUT: '⏰ Database connection timeout',
    UNAVAILABLE: '🚫 Database service unavailable',
  },
  HEALTH_CHECK: {
    STARTING: '🔍 Starting database health check',
    PASSED: '✅ Database health check passed',
    FAILED: '❌ Database health check failed',

    retry: (attempt: number, total: number) =>
      `🔄 Database health check attempt ${attempt}/${total}`,
    retrying: (seconds: number) => `⏳ Retrying in ${seconds} seconds...`,
  },
  SERVER: {
    STARTUP_FAILED: '❌ Cannot start server: Database connection failed',
    STARTUP_SUCCESS: '🚀 Server started with database connection',
    SHUTDOWN_GRACEFUL: '🔄 Gracefully shutting down database connection',

    healtEndpoint: (port: number) =>
      `📊 Health check available at: http://localhost:${port}/health`,
  },
  STATUS: {
    CONNECTED: 'Connected',
    DISCONNECTED: 'Disconnected',
    CONNECTING: 'Connecting',
    ERROR: 'Error',
  },
  ERRORS: {
    CONNECTION_LOST: 'Database connection was lost',
    QUERY_FAILED: 'Database query failed',
    TRANSACTION_FAILED: 'Database transaction failed',
    MIGRATION_FAILED: 'Database migration failed',
    TIMEOUT_EXCEEDED: 'Database operation timeout exceeded',
    PERMISSION_DENIED: 'Database permission denied',
    INVALID_QUERY: 'Invalid database query',
    CONSTRAINT_VIOLATION: 'Database constraint violation',
  },
} as const
