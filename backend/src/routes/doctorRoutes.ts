import { Router } from 'express';
import {
  createDoctor,
  listDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctorController';

const router = Router();

router
  .route('/doctor')
  .put(createDoctor)
  .get(listDoctors);

router
  .route('/doctor/:id')
  .get(getDoctor)
  .post(updateDoctor)
  .delete(deleteDoctor);

export default router;
