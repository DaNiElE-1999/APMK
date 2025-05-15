import { Router } from 'express';
import {
  createPatient,
  listPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from '../controllers/patientController';

const router = Router();

router
  .route('/patient')
  .put(createPatient)
  .get(listPatients);

router
  .route('/patient/:id')
  .get(getPatient)
  .post(updatePatient)
  .delete(deletePatient);

export default router;
