import { Router } from 'express'

import { healthController } from '@/controllers/health.controller'

const router = Router()

router.get('/', healthController.success)
router.get('/error', healthController.error)

export default router
