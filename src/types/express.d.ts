import { Response } from 'express'

import { JwtPayload } from './generic.type'

interface CustomResponseLocals {
  user: string
}

// for custom res.locals
type AppRes = Response & { locals: CustomResponseLocals }

declare module 'express' {
  interface Request {
    user?: JwtPayload
    accessToken?: string
  }
}
