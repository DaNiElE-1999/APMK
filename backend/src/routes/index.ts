import { Router } from 'express'
import authnRoutes from './auth/authnRoutes'
import userRoutes from './userRoutes'
import patientRoutes from './patientRoutes';

const router = Router();

router.use(authnRoutes);
router.use(userRoutes);
router.use(patientRoutes);

export default router