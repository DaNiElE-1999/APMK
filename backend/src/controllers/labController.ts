import { RequestHandler } from 'express';
import asyncHandler       from 'express-async-handler';
import { LabModel }       from '../database/models/labModel';
import {
  CreateLabBody,
  UpdateLabBody,
  ListLabsQuery,
} from '../models/Lab';

/* ──────────────────────────────────────────────────────────────────── */
/** PUT /api/labs   (create) */
export const createLab: RequestHandler<{}, {}, CreateLabBody> = asyncHandler(
  async (req, res): Promise<void> => {
    const { type, cost } = req.body;

    if (!type || cost === undefined) {
      res.status(400).json({ message: 'type and cost are mandatory' });
      return;
    }

    /* Create lab */
    let lab;
    try {
      lab = await LabModel.create({ type, cost });
    } catch (err) {
      console.error('[createLab] create error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    res.status(201).json(lab);
  }
);

/* ──────────────────────────────────────────────────────────────────── */
/** GET /api/labs   (list / filter) */
export const listLabs: RequestHandler<{}, {}, {}, ListLabsQuery> = asyncHandler(
  async (req, res): Promise<void> => {
    const { type, costMin, costMax, from, to } = req.query;

    const filter: Record<string, unknown> = {};
    if (type)    filter.type = new RegExp(type, 'i');

    /* Numeric cost range */
    if (costMin || costMax) {
      filter.cost = {};
      if (costMin) (filter.cost as any).$gte = Number(costMin);
      if (costMax) (filter.cost as any).$lte = Number(costMax);
    }

    /* Time range */
    if (from || to) {
      filter.createdAt = {};
      if (from) (filter.createdAt as any).$gte = new Date(from);
      if (to)   (filter.createdAt as any).$lte = new Date(to);
    }

    let labs;
    try {
      labs = await LabModel.find(filter).sort({ createdAt: -1 });
    } catch (err) {
      console.error('[listLabs] find error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    res.json(labs);
  }
);

/* ──────────────────────────────────────────────────────────────────── */
/** GET /api/labs/:id */
export const getLab: RequestHandler<{ id: string }> = asyncHandler(
  async (req, res): Promise<void> => {
    let lab;
    try {
      lab = await LabModel.findById(req.params.id);
    } catch (err) {
      console.error('[getLab] findById error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!lab) {
      res.status(404).json({ message: 'Lab not found' });
      return;
    }

    res.json(lab);
  }
);

/* ──────────────────────────────────────────────────────────────────── */
/** POST /api/labs/:id  (update) */
export const updateLab: RequestHandler<{ id: string }, {}, UpdateLabBody> = asyncHandler(
  async (req, res): Promise<void> => {
    let lab;
    try {
      lab = await LabModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
    } catch (err) {
      console.error('[updateLab] findByIdAndUpdate error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!lab) {
      res.status(404).json({ message: 'Lab not found' });
      return;
    }

    res.json(lab);
  }
);

/* ──────────────────────────────────────────────────────────────────── */
/** DELETE /api/labs/:id */
export const deleteLab: RequestHandler<{ id: string }> = asyncHandler(
  async (req, res): Promise<void> => {
    let lab;
    try {
      lab = await LabModel.findByIdAndDelete(req.params.id);
    } catch (err) {
      console.error('[deleteLab] findByIdAndDelete error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!lab) {
      res.status(404).json({ message: 'Lab not found' });
      return;
    }

    res.json({ message: 'Lab removed' });
  }
);
