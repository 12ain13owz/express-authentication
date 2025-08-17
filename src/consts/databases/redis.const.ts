export const REDIS = {
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
} as const
