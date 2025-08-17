import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'node:path'

import { config } from './config'
import { GENERIC } from './consts/systems/generic.const'
import { errorHandler } from './middlewares/error-response.middleware'
import { limiter } from './middlewares/rate-limit.middleware'
import { mainRoutes } from './routes'
import { mailerService } from './services/mailer.service'
import { logger } from './utils/logger.utils'
import { DatabaseClient } from './utils/prisma.utils'
import { RedisClient } from './utils/redis.utils'

const app = express()
const baseUrl = config.baseUrl
const port = config.port

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(limiter)

app.use('/docs', express.static(path.join(__dirname, '../docs')))
app.use(mainRoutes)
app.use(errorHandler)

app.listen(port, () => {
  DatabaseClient.healthCheck()
    .then(() => RedisClient.healthCheck())
    .then(() => mailerService.testConnection())
    .then(() => logger.info(GENERIC.serverListening(baseUrl, port)))
    .catch((error) => {
      logger.error(error)
      process.exit(1)
    })
})
