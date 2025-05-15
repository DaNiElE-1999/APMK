import { Router } from 'express';
import {
  createAppointment,
  listAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController';

const router = Router();

router
  .route('/appointment')
  .put(createAppointment)
  .get(listAppointments);

router
  .route('/appointment/:id')
  .get(getAppointment)
  .post(updateAppointment)
  .delete(deleteAppointment);

export default router;
