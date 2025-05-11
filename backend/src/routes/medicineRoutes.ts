import { Router } from 'express';
import {
  createMedicine,
  listMedicines,
  getMedicine,
  updateMedicine,
  deleteMedicine,
} from '../controllers/medicineController';

const router = Router();

router
  .route('/medicine')
  .put(createMedicine)
  .get(listMedicines);

router
  .route('/medicine/:id')
  .get(getMedicine)
  .post(updateMedicine)
  .delete(deleteMedicine);

export default router;
