import { Router } from 'express'
import authnRoutes from './auth/authnRoutes'
import userRoutes from './userRoutes'
import patientRoutes from './patientRoutes';
import doctorRoutes from './doctorRoutes';

const router = Router();

router.use(authnRoutes);
router.use(userRoutes);
router.use(patientRoutes);
router.use(doctorRoutes);

export default router