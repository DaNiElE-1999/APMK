import { Router } from 'express'
import authnRoutes from './auth/authnRoutes'
import userRoutes from './userRoutes'
import patientRoutes from './patientRoutes';
import doctorRoutes from './doctorRoutes';
import labRoutes from './labRoutes';
import medicineRoutes from './medicineRoutes';
import appointmentRoutes from './appointmentRoutes';

const router = Router();

router.use(authnRoutes);
router.use(userRoutes);
router.use(patientRoutes);
router.use(doctorRoutes);
router.use(labRoutes);
router.use(medicineRoutes);
router.use(appointmentRoutes);

export default router