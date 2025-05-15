import { Router } from 'express'
import authnRoutes from './auth/authnRoutes'
import userRoutes from './userRoutes'
import patientRoutes from './patientRoutes';
import doctorRoutes from './doctorRoutes';
import labRoutes from './labRoutes';
import medicineRoutes from './medicineRoutes';
import appointmentRoutes from './appointmentRoutes';
import medicineSoldRoutes from './medicineSoldRoutes';
import fileRoutes from './fileRoutes';
import profitRoutes from './profitRoutes';

const router = Router();

router.use(authnRoutes);
router.use(userRoutes);
router.use(patientRoutes);
router.use(doctorRoutes);
router.use(labRoutes);
router.use(medicineRoutes);
router.use(appointmentRoutes);
router.use(medicineSoldRoutes);
router.use(fileRoutes);
router.use(profitRoutes);

export default router