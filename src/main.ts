import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import path from 'path'

import { config } from './config'
import { DATABASE } from './constants/database.constant'
import { MESSAGES } from './constants/message.constant'
import { errorHandler } from './middlewares/error-response.middleware'
import { mainRoutes } from './routes'
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

const main = async () => {
  try {
    const isDbConnected = await DatabaseClient.healthCheck()
    if (!isDbConnected) throw new Error(DATABASE.CONNECTION.FAILED)

    logger.info(MESSAGES.GENERIC.serverListening(port))
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

void main().then(() => app.listen(port))
