import { Router } from 'express'

import * as authController from '@/controllers/auth.controller'
import { validate } from '@/middlewares/validate.middleware'
import * as authSchema from '@/schemas/auth.schema'

const router = Router()

router.post('/register', validate(authSchema.registerSchema), authController.registerController)
router.post('/login', authController.loginController)

export const authRouter = router
