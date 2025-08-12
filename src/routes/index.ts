import { NextFunction, Request, Response, Router } from 'express'

import docs from './docs.routes'
import health from './health.routes'

const router = Router()

router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.json({ message: 'Hello World!' })
})
router.use('/health', health)
router.use('/docs', docs)

export const mainRoutes = router
