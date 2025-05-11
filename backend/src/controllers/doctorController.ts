import { RequestHandler } from 'express';
import asyncHandler       from 'express-async-handler';
import { DoctorModel }    from '../database/models/doctorModel';
import {
  CreateDoctorBody,
  UpdateDoctorBody,
  ListDoctorsQuery,
} from '../models/Doctor';

/* ─────────── PUT /api/doctors  (create) ─────────── */
export const createDoctor: RequestHandler<{}, {}, CreateDoctorBody> =
  asyncHandler(async (req, res) => {
    const { first, last, email, speciality, phone } = req.body;

    if (!first || !last || !email || !speciality) {
      res.status(400).json({ message: 'first, last, email, speciality are mandatory' });
      return;
    }

    const exists = await DoctorModel.findOne({ email });
    if (exists) {
      res.status(400).json({ message: 'Doctor already exists' });
      return;
    }

    const doctor = await DoctorModel.create({ first, last, email, speciality, phone });
    res.status(201).json(doctor);
  });

/* ─────────── GET /api/doctors  (list / filter) ─────────── */
export const listDoctors: RequestHandler<{}, {}, {}, ListDoctorsQuery> =
  asyncHandler(async (req, res) => {
    const { first, last, email, phone, speciality, from, to } = req.query;

    const filter: Record<string, unknown> = {};
    if (first)      filter.first      = new RegExp(first, 'i');
    if (last)       filter.last       = new RegExp(last,  'i');
    if (email)      filter.email      = new RegExp(email, 'i');
    if (phone)      filter.phone      = new RegExp(phone, 'i');
    if (speciality) filter.speciality = new RegExp(speciality, 'i');

    if (from || to) {
      filter.createdAt = {};
      if (from) (filter.createdAt as any).$gte = new Date(from);
      if (to)   (filter.createdAt as any).$lte = new Date(to);
    }

    const doctors = await DoctorModel.find(filter).sort({ createdAt: -1 });
    res.json(doctors);
  });

/* ─────────── GET /api/doctors/:id ─────────── */
export const getDoctor: RequestHandler<{ id: string }> =
  asyncHandler(async (req, res) => {
    const doctor = await DoctorModel.findById(req.params.id);
    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }
    res.json(doctor);
  });

/* ─────────── POST /api/doctors/:id  (update) ─────────── */
export const updateDoctor: RequestHandler<{ id: string }, {}, UpdateDoctorBody> =
  asyncHandler(async (req, res) => {
    const doctor = await DoctorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }
    res.json(doctor);
  });

/* ─────────── DELETE /api/doctors/:id ─────────── */
export const deleteDoctor: RequestHandler<{ id: string }> =
  asyncHandler(async (req, res) => {
    const doctor = await DoctorModel.findByIdAndDelete(req.params.id);
    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }
    res.json({ message: 'Doctor removed' });
  });
