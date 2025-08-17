// rateLimitConfig.ts
import rateLimit from 'express-rate-limit'

import { MESSAGES } from '@/constants/message.constant'

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: MESSAGES.ERROR.TOO_MANY_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
})
