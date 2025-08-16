import { Router } from 'express'

import * as authController from '@/controllers/auth.controller'
import * as validateMiddleware from '@/middlewares/validate.middleware'
import * as authSchema from '@/schemas/auth.schema'

const router = Router()

router.post(
  '/register',
  validateMiddleware.validateSchema(authSchema.registerSchema),
  authController.registerController
)
router.post('/login', authController.loginController)
router.post('/login/me', validateMiddleware.validateToken, authController.loginWithTokenController)
router.post('/logout', validateMiddleware.validateToken, authController.logoutController)
router.post(
  '/refresh-token',
  validateMiddleware.validateSchema(authSchema.refresTokenhSchema),
  authController.refreshTokenController
)
router.post(
  '/revoke-token',
  validateMiddleware.validateToken,
  authController.revokeRefreshTokenController
)
router.get(
  '/verify-email/:emailVerificationKey',
  validateMiddleware.validateSchema(authSchema.verifyEmailSchema),
  authController.verifyEmailController
)
router.post(
  '/send-verification',
  validateMiddleware.validateSchema(authSchema.sendVerifyEmailSchema),
  authController.sendVerifyEmailController
)
router.post(
  '/forgot-password',
  validateMiddleware.validateSchema(authSchema.forgotPasswordSchema),
  authController.forgotPasswordController
)
router.post(
  '/reset-password',
  validateMiddleware.validateSchema(authSchema.resetPasswordSchema),
  authController.resetPasswordController
)

export const authRouter = router
