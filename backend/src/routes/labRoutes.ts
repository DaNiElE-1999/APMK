import { Router } from 'express';
import {
  createLab,
  listLabs,
  getLab,
  updateLab,
  deleteLab,
} from '../controllers/labController';

const router = Router();

router
  .route('/lab')
  .put(createLab)
  .get(listLabs);

router
  .route('/lab/:id')
  .get(getLab)
  .post(updateLab)
  .delete(deleteLab);

export default router;
