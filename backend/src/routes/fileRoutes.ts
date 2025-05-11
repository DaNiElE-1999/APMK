import { Router } from 'express';
import {
  createFile,
  listFiles,
  getFile,
  updateFile,
  deleteFile,
} from '../controllers/fileController';
import { upload } from '../middleware/file';

const router = Router();

router
  .route('/file')
  .put(upload.single('file'), createFile)
  .get(listFiles);

router
  .route('/file/:id')
  .get(getFile)
  .post(updateFile)
  .delete(deleteFile);

export default router;
