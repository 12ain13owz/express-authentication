import { Router } from 'express'

import * as authController from '@/controllers/auth.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { validateSchema } from '@/middlewares/validate.middleware'
import * as authSchema from '@/schemas/auth.schema'

const router = Router()

router.post(
  '/register',
  validateSchema(authSchema.registerSchema),
  authController.registerController
)
router.post('/login', authController.loginController)
router.post('/login/me', authMiddleware, authController.loginWithTokenController)
router.post(
  '/refresh-token',
  validateSchema(authSchema.refresTokenhSchema),
  authController.refreshTokenController
)

export const authRouter = router
