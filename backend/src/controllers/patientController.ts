import { RequestHandler } from 'express';
import asyncHandler       from 'express-async-handler';
import { PatientModel }   from '../database/models/patientModel';
import {
  CreatePatientBody,
  UpdatePatientBody,
  ListPatientsQuery,
} from '../models/Patient';

/* ──────────────────────────────────────────────────────────────────────── */
/** PUT /api/patients */
export const createPatient: RequestHandler<{}, {}, CreatePatientBody> =
  asyncHandler(async (req, res) => {
    const { first, last, email, phone } = req.body;

    if (!first || !last || !email) {
      res.status(400).json({ message: 'first, last and email are mandatory' });
      return;
    }

    const exists = await PatientModel.findOne({ email });
    if (exists) {
      res.status(400).json({ message: 'Patient already exists' });
      return;
    }

    const patient = await PatientModel.create({ first, last, email, phone });
    res.status(201).json(patient);
  });

/* ──────────────────────────────────────────────────────────────────────── */
/** GET /api/patients?… */
export const listPatients: RequestHandler<{}, {}, {}, ListPatientsQuery> =
  asyncHandler(async (req, res) => {
    const { first, last, email, phone, from, to } = req.query;

    /* Build dynamic filter ------------------------------- */
    const filter: Record<string, unknown> = {};
    if (first)  filter.first  = new RegExp(first, 'i');
    if (last)   filter.last   = new RegExp(last,  'i');
    if (email)  filter.email  = new RegExp(email, 'i');
    if (phone)  filter.phone  = new RegExp(phone, 'i');

    if (from || to) {
      filter.createdAt = {};
      if (from) (filter.createdAt as any).$gte = new Date(from);
      if (to)   (filter.createdAt as any).$lte = new Date(to);
    }

    const patients = await PatientModel.find(filter).sort({ createdAt: -1 });
    res.json(patients);
  });

/* ──────────────────────────────────────────────────────────────────────── */
/** GET /api/patients/:id */
export const getPatient: RequestHandler<{ id: string }> =
  asyncHandler(async (req, res) => {
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }
    res.json(patient);
  });

/* ──────────────────────────────────────────────────────────────────────── */
/** POST /api/patients/:id */
export const updatePatient: RequestHandler<{ id: string }, {}, UpdatePatientBody> =
  asyncHandler(async (req, res) => {
    const patient = await PatientModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }
    res.json(patient);
  });

/* ──────────────────────────────────────────────────────────────────────── */
/** DELETE /api/patients/:id */
export const deletePatient: RequestHandler<{ id: string }> =
  asyncHandler(async (req, res) => {
    const patient = await PatientModel.findByIdAndDelete(req.params.id);
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }
    res.json({ message: 'Patient removed' });
  });
