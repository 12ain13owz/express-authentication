import express from 'express'
import morgan from 'morgan'
import path from 'path'

import { config } from './config'
import { GENERIC } from './constants/message.constant'
import { errorHandler } from './middlewares/error-response.middleware'
import { mainRoutes } from './routes'
import { logger } from './utils/logger.util'

const app = express()
const port = config.port

app.use(morgan('dev'))
app.use(express.json())

app.use('/docs', express.static(path.join(__dirname, '../docs')))
app.use(mainRoutes)
app.use(errorHandler)

const main = () => {
  try {
    logger.info(GENERIC.serverListening(port))
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

app.listen(port, main)
