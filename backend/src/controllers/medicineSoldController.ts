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
export const listMedicineSold: RequestHandler<
  {},
  {},
  {},
  ListMedicineSoldQuery & { ageMin?: string; ageMax?: string }
> = asyncHandler(async (req, res) => {
  const {
    patient_id,
    doctor_id,
    medicine_id,
    quantityMin,
    quantityMax,
    from,
    to,
    ageMin,
    ageMax,
  } = req.query;

  const match: Record<string, unknown> = {};
  if (patient_id)  match.patient_id  = patient_id;
  if (doctor_id)   match.doctor_id   = doctor_id;
  if (medicine_id) match.medicine_id = medicine_id;

  if (quantityMin || quantityMax) {
    match.quantity = {};
    if (quantityMin) (match.quantity as any).$gte = Number(quantityMin);
    if (quantityMax) (match.quantity as any).$lte = Number(quantityMax);
  }

  if (from || to) {
    match.time_sold = {};
    if (from) (match.time_sold as any).$gte = new Date(from);
    if (to)   (match.time_sold as any).$lte = new Date(to);
  }

  const pipeline: any[] = [{ $match: match }];

  /* Join patients so we can filter by age */
  pipeline.push(
    {
      $lookup: {
        from: 'patients',
        localField: 'patient_id',
        foreignField: '_id',
        as: 'patient',
      },
    },
    { $unwind: '$patient' }
  );

  /* Optional age filter */
  if (ageMin || ageMax) {
    const ageCond: any = {};
    if (ageMin) ageCond.$gte = Number(ageMin);
    if (ageMax) ageCond.$lte = Number(ageMax);
    pipeline.push({ $match: { 'patient.age': ageCond } });
  }

  /* Add doctors & medicines for a fully-hydrated response */
  pipeline.push(
    {
      $lookup: {
        from: 'doctors',
        localField: 'doctor_id',
        foreignField: '_id',
        as: 'doctor',
      },
    },
    { $unwind: '$doctor' },
    {
      $lookup: {
        from: 'medicines',
        localField: 'medicine_id',
        foreignField: '_id',
        as: 'medicine',
      },
    },
    { $unwind: '$medicine' },
    { $sort: { time_sold: -1 } },

    {
      $project: {
        _id: 1,
        quantity: 1,
        time_sold: 1,
        patient:  { _id: 1, first: 1, last: 1, email: 1, age: 1 },
        doctor:   { _id: 1, first: 1, last: 1, email: 1, speciality: 1 },
        medicine: { _id: 1, name: 1, cost: 1 },
        createdAt: 1,
        updatedAt: 1,
      },
    }
  );

  try {
    const sold = await MedicineSoldModel.aggregate(pipeline);
    res.json(sold);
  } catch (err) {
    console.error('[listMedicineSold] aggregate error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});


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
