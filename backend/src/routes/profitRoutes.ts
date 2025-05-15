import { Router } from 'express';
import {
  profitBySale,
  profitByLab,
  profitAll
} from '../controllers/profitController';

const router = Router();

router.get('/profit/sale', profitBySale);
router.get('/profit/lab',  profitByLab);
router.get('/profit/all',  profitAll);

export default router;
