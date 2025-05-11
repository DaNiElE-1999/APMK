import { RequestHandler } from 'express';
import asyncHandler       from 'express-async-handler';
import { FileModel }      from '../database/models/fileModel';
import {
  CreateFileBody,
  UpdateFileBody,
  ListFilesQuery,
} from '../models/File';
import fs                 from 'fs';
import path               from 'path';

/* ───────────────────────────────────────────────────────────── */
/** PUT /api/files  (create) */
export const createFile: RequestHandler<{}, {}, CreateFileBody> = asyncHandler(
  async (req, res): Promise<void> => {
    const uploaded   = req.file;
    const { patient_id, doctor_id } = req.body;

    if (!uploaded) {
      res.status(400).json({ message: 'No file uploaded (field name must be "file")' });
      return;
    }
    if (!patient_id && !doctor_id) {
      res.status(400).json({ message: 'Provide at least patient_id or doctor_id' });
      return;
    }

    // derive extension
    const [, ext] = uploaded.mimetype.split('/');
    if (!ext) {
      res.status(400).json({ message: 'Unsupported file type' });
      return;
    }

    // generate unique filename
    const filename   = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const targetDir  = path.resolve(process.cwd(), 'uploads');
    const targetPath = path.join(targetDir, filename);

    // ensure uploads/ exists
    await fs.promises.mkdir(targetDir, { recursive: true });

    // move temp file
    try {
      await fs.promises.rename(uploaded.path, targetPath);
    } catch (err) {
      console.error('[createFile] file rename error:', err);
      res.status(500).json({ message: 'File system error' });
      return;
    }

    // persist, pulling name from originalname
    let fileDoc;
    try {
      fileDoc = await FileModel.create({
        name:       uploaded.originalname,
        path:       `uploads/${filename}`,
        mimeType:   uploaded.mimetype,
        patient_id,
        doctor_id,
      });
    } catch (err) {
      console.error('[createFile] create error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    res.status(201).json(fileDoc);
  }
);

/* ───────────────────────────────────────────────────────────── */
/** GET /api/files  (list / filter) */
export const listFiles: RequestHandler<{}, {}, {}, ListFilesQuery> = asyncHandler(
  async (req, res): Promise<void> => {
    const { name, patient_id, doctor_id, mimeType, path: p, from, to } = req.query;

    const filter: Record<string, unknown> = {};
    if (name)       filter.name       = new RegExp(name, 'i');
    if (patient_id) filter.patient_id = patient_id;
    if (doctor_id)  filter.doctor_id  = doctor_id;
    if (mimeType)   filter.mimeType   = new RegExp(mimeType, 'i');
    if (p)          filter.path       = new RegExp(p, 'i');

    if (from || to) {
      filter.createdAt = {};
      if (from) (filter.createdAt as any).$gte = new Date(from);
      if (to)   (filter.createdAt as any).$lte = new Date(to);
    }

    let files;
    try {
      files = await FileModel
        .find(filter)
        .populate('patient_id', 'first last email')
        .populate('doctor_id',  'first last email speciality')
        .sort({ createdAt: -1 });
    } catch (err) {
      console.error('[listFiles] find error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    res.json(files);
  }
);

/* ───────────────────────────────────────────────────────────── */
/** GET /api/files/:id */
export const getFile: RequestHandler<{ id: string }> = asyncHandler(
  async (req, res) => {
    let file;
    try {
      file = await FileModel
        .findById(req.params.id)
        .populate('patient_id', 'first last email')
        .populate('doctor_id',  'first last email speciality');
    } catch (err) {
      console.error('[getFile] findById error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    res.json(file);
  }
);

/* ───────────────────────────────────────────────────────────── */
/** POST /api/files/:id  (update) */
export const updateFile: RequestHandler<{ id: string }, {}, UpdateFileBody> = asyncHandler(
  async (req, res) => {
    let file;
    try {
      file = await FileModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
    } catch (err) {
      console.error('[updateFile] findByIdAndUpdate error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    res.json(file);
  }
);

/* ───────────────────────────────────────────────────────────── */
/** DELETE /api/files/:id */
export const deleteFile: RequestHandler<{ id: string }> = asyncHandler(
  async (req, res) => {
    let file;
    try {
      file = await FileModel.findByIdAndDelete(req.params.id);
    } catch (err) {
      console.error('[deleteFile] findByIdAndDelete error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    res.json({ message: 'File removed' });
  }
);
