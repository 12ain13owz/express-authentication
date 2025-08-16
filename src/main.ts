import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import path from 'node:path'

import { config } from './config'
import { MESSAGES } from './constants/message.constant'
import { errorHandler } from './middlewares/error-response.middleware'
import { mainRoutes } from './routes'
import { mailerService } from './services/mailer.service'
import { logger } from './utils/logger.utils'
import { DatabaseClient } from './utils/prisma.utils'

const app = express()
const port = config.port

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/docs', express.static(path.join(__dirname, '../docs')))
app.use(mainRoutes)
app.use(errorHandler)

app.listen(port, () => {
  DatabaseClient.healthCheck()
    .then(() => mailerService.testConnection())
    .then(() => logger.info(MESSAGES.GENERIC.serverListening(port)))
    .catch((error) => {
      logger.error(error)
      process.exit(1)
    })
})
