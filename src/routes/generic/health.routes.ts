import { Router } from 'express'

import * as healthController from '@/controllers/health.controller'

const router = Router()

router.get('/', healthController.successController)
router.get('/error', healthController.errorController)

export const healthRouter = router
