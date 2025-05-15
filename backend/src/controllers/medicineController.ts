import { RequestHandler } from 'express';
import asyncHandler       from 'express-async-handler';
import { MedicineModel }  from '../database/models/medicineModel';
import {
  CreateMedicineBody,
  UpdateMedicineBody,
  ListMedicinesQuery,
} from '../models/Medicine';

/* ──────────────────────────────────────────────────────────────────── */
/** PUT /api/medicine  (create) */
export const createMedicine: RequestHandler<{}, {}, CreateMedicineBody> = asyncHandler(
  async (req, res): Promise<void> => {
    const { name, cost } = req.body;

    if (!name || cost === undefined) {
      res.status(400).json({ message: 'name and cost are mandatory' });
      return;
    }

    /* Uniqueness check (by name) */
    let exists;
    try {
      exists = await MedicineModel.findOne({ name: new RegExp(`^${name}$`, 'i') });
    } catch (err) {
      console.error('[createMedicine] findOne error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }
    if (exists) {
      res.status(400).json({ message: 'Medicine already exists' });
      return;
    }

    /* Create medicine */
    let medicine;
    try {
      medicine = await MedicineModel.create({ name, cost });
    } catch (err) {
      console.error('[createMedicine] create error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    res.status(201).json(medicine);
  }
);

/* ──────────────────────────────────────────────────────────────────── */
/** GET /api/medicine  (list / filter) */
export const listMedicines: RequestHandler<{}, {}, {}, ListMedicinesQuery> = asyncHandler(
  async (req, res): Promise<void> => {
    const { name, costMin, costMax, from, to } = req.query;

    const filter: Record<string, unknown> = {};
    if (name) filter.name = new RegExp(name, 'i');

    if (costMin || costMax) {
      filter.cost = {};
      if (costMin) (filter.cost as any).$gte = Number(costMin);
      if (costMax) (filter.cost as any).$lte = Number(costMax);
    }

    if (from || to) {
      filter.createdAt = {};
      if (from) (filter.createdAt as any).$gte = new Date(from);
      if (to)   (filter.createdAt as any).$lte = new Date(to);
    }

    let medicines;
    try {
      medicines = await MedicineModel.find(filter).sort({ createdAt: -1 });
    } catch (err) {
      console.error('[listMedicines] find error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    res.json(medicines);
  }
);

/* ──────────────────────────────────────────────────────────────────── */
/** GET /api/medicine/:id */
export const getMedicine: RequestHandler<{ id: string }> = asyncHandler(
  async (req, res): Promise<void> => {
    let medicine;
    try {
      medicine = await MedicineModel.findById(req.params.id);
    } catch (err) {
      console.error('[getMedicine] findById error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!medicine) {
      res.status(404).json({ message: 'Medicine not found' });
      return;
    }

    res.json(medicine);
  }
);

/* ──────────────────────────────────────────────────────────────────── */
/** POST /api/medicine/:id  (update) */
export const updateMedicine: RequestHandler<{ id: string }, {}, UpdateMedicineBody> = asyncHandler(
  async (req, res): Promise<void> => {
    let medicine;
    try {
      medicine = await MedicineModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
    } catch (err) {
      console.error('[updateMedicine] findByIdAndUpdate error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!medicine) {
      res.status(404).json({ message: 'Medicine not found' });
      return;
    }

    res.json(medicine);
  }
);

/* ──────────────────────────────────────────────────────────────────── */
/** DELETE /api/medicine/:id */
export const deleteMedicine: RequestHandler<{ id: string }> = asyncHandler(
  async (req, res): Promise<void> => {
    let medicine;
    try {
      medicine = await MedicineModel.findByIdAndDelete(req.params.id);
    } catch (err) {
      console.error('[deleteMedicine] findByIdAndDelete error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!medicine) {
      res.status(404).json({ message: 'Medicine not found' });
      return;
    }

    res.json({ message: 'Medicine removed' });
  }
);
