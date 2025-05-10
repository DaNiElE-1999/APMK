import { Router } from 'express'
import authnRoutes from './auth/authnRoutes'
import userRoutes from './userRoutes'

const router = Router()

router.use(authnRoutes)
router.use(userRoutes)

export default router