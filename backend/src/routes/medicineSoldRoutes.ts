import { Router } from 'express';
import {
  createMedicineSold,
  listMedicineSold,
  getMedicineSold,
  updateMedicineSold,
  deleteMedicineSold,
} from '../controllers/medicineSoldController';

const router = Router();

router
  .route('/medicine_sold')
  .put(createMedicineSold)
  .get(listMedicineSold);

router
  .route('/medicine_sold/:id')
  .get(getMedicineSold)
  .post(updateMedicineSold)
  .delete(deleteMedicineSold);

export default router;
