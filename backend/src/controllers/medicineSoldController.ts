import { RequestHandler } from 'express';
import asyncHandler       from 'express-async-handler';
import { MedicineSoldModel } from '../database/models/medicineSoldModel';
import {
  CreateMedicineSoldBody,
  UpdateMedicineSoldBody,
  ListMedicineSoldQuery,
} from '../models/MedicineSold';

/* ─────────────────────────────────────────────────────────────── */
/** PUT /api/medicine_sold  (create) */
export const createMedicineSold: RequestHandler<{}, {}, CreateMedicineSoldBody> = asyncHandler(
  async (req, res) => {
    const { patient_id, doctor_id, medicine_id, quantity, time_sold } = req.body;

    if (!patient_id || !doctor_id || !medicine_id || quantity === undefined) {
      res.status(400).json({ message: 'patient_id, doctor_id, medicine_id and quantity are mandatory' });
      return;
    }
    if (quantity <= 0) {
      res.status(400).json({ message: 'quantity must be > 0' });
      return;
    }

    let sold;
    try {
      sold = await MedicineSoldModel.create({
        patient_id,
        doctor_id,
        medicine_id,
        quantity,
        time_sold: time_sold ? new Date(time_sold) : undefined,
      });
    } catch (err) {
      console.error('[createMedicineSold] create error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    res.status(201).json(sold);
  }
);

/* ── GET /api/medicine_sold (list / filter) ── */
export const listMedicineSold: RequestHandler<{}, {}, {}, ListMedicineSoldQuery> = asyncHandler(
  async (req, res) => {
    const { patient_id, doctor_id, medicine_id, quantityMin, quantityMax, from, to } = req.query;

    const filter: Record<string, unknown> = {};
    if (patient_id)  filter.patient_id  = patient_id;
    if (doctor_id)   filter.doctor_id   = doctor_id;
    if (medicine_id) filter.medicine_id = medicine_id;

    if (quantityMin || quantityMax) {
      filter.quantity = {};
      if (quantityMin) (filter.quantity as any).$gte = Number(quantityMin);
      if (quantityMax) (filter.quantity as any).$lte = Number(quantityMax);
    }

    if (from || to) {
      filter.time_sold = {};
      if (from) (filter.time_sold as any).$gte = new Date(from);
      if (to)   (filter.time_sold as any).$lte = new Date(to);
    }

    let sold;
    try {
      sold = await MedicineSoldModel
        .find(filter)
        .populate('patient_id',  'first last email')
        .populate('doctor_id',   'first last email speciality')
        .populate('medicine_id', 'name cost')
        .sort({ time_sold: -1 });
    } catch (err) {
      console.error('[listMedicineSold] find error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    res.json(sold);
  }
);

/* ─────────────────────────────────────────────────────────────── */
/** GET /api/medicine_sold/:id */
export const getMedicineSold: RequestHandler<{ id: string }> = asyncHandler(
  async (req, res) => {
    let sold;
    try {
      sold = await MedicineSoldModel
        .findById(req.params.id)
        .populate('patient_id',  'first last email')
        .populate('doctor_id',   'first last email speciality')
        .populate('medicine_id', 'name cost');
    } catch (err) {
      console.error('[getMedicineSold] findById error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!sold) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }

    res.json(sold);
  }
);

/* ─────────────────────────────────────────────────────────────── */
/** POST /api/medicine_sold/:id  (update) */
export const updateMedicineSold: RequestHandler<{ id: string }, {}, UpdateMedicineSoldBody> = asyncHandler(
  async (req, res) => {
    let sold;
    try {
      sold = await MedicineSoldModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
    } catch (err) {
      console.error('[updateMedicineSold] findByIdAndUpdate error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!sold) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }

    res.json(sold);
  }
);

/* ─────────────────────────────────────────────────────────────── */
/** DELETE /api/medicine_sold/:id */
export const deleteMedicineSold: RequestHandler<{ id: string }> = asyncHandler(
  async (req, res) => {
    let sold;
    try {
      sold = await MedicineSoldModel.findByIdAndDelete(req.params.id);
    } catch (err) {
      console.error('[deleteMedicineSold] findByIdAndDelete error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!sold) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }

    res.json({ message: 'Record removed' });
  }
);
