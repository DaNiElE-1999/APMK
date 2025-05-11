import { RequestHandler } from 'express';
import asyncHandler       from 'express-async-handler';
import { AppointmentModel } from '../database/models/appointmentModel';
import {
  CreateAppointmentBody,
  UpdateAppointmentBody,
  ListAppointmentsQuery,
} from '../models/Appointment';

/* ─────────────────────────────────────────────────────────────── */
/** PUT /api/appointments  (create) */
export const createAppointment: RequestHandler<{}, {}, CreateAppointmentBody> = asyncHandler(
  async (req, res): Promise<void> => {
    const { start, end, doctor_id, patient_id, lab } = req.body;

    if (!start || !end || !doctor_id || !patient_id) {
      res.status(400).json({ message: 'start, end, doctor_id, patient_id are mandatory' });
      return;
    }

    /* Create appointment */
    let appt;
    try {
      appt = await AppointmentModel.create({
        start: new Date(start),
        end:   new Date(end),
        doctor_id,
        patient_id,
        lab,
      });
    } catch (err) {
      console.error('[createAppointment] create error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    res.status(201).json(appt);
  }
);

/* ─────────────────────────────────────────────────────────────── */
/** GET /api/appointments  (list / filter) */
export const listAppointments: RequestHandler<{}, {}, {}, ListAppointmentsQuery> = asyncHandler(
  async (req, res): Promise<void> => {
    const { doctor_id, patient_id, lab, from, to } = req.query;

    const filter: Record<string, unknown> = {};
    if (doctor_id)  filter.doctor_id  = doctor_id;
    if (patient_id) filter.patient_id = patient_id;
    if (lab)        filter.lab        = lab;

    if (from || to) {
      filter.start = {};
      if (from) (filter.start as any).$gte = new Date(from);
      if (to)   (filter.start as any).$lte = new Date(to);
    }

    let appts;
    try {
      appts = await AppointmentModel
        .find(filter)
        .populate('doctor_id',  'first last email speciality')
        .populate('patient_id', 'first last email')
        .populate('lab',        'type cost')
        .sort({ start: -1 });
    } catch (err) {
      console.error('[listAppointments] find error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    res.json(appts);
  }
);

/* ─────────────────────────────────────────────────────────────── */
/** GET /api/appointments/:id */
export const getAppointment: RequestHandler<{ id: string }> = asyncHandler(
  async (req, res): Promise<void> => {
    let appt;
    try {
      appt = await AppointmentModel
        .findById(req.params.id)
        .populate('doctor_id',  'first last email speciality')
        .populate('patient_id', 'first last email')
        .populate('lab',        'type cost');
    } catch (err) {
      console.error('[getAppointment] findById error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!appt) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    res.json(appt);
  }
);

/* ─────────────────────────────────────────────────────────────── */
/** POST /api/appointments/:id  (update) */
export const updateAppointment: RequestHandler<{ id: string }, {}, UpdateAppointmentBody> = asyncHandler(
  async (req, res): Promise<void> => {
    let appt;
    try {
      appt = await AppointmentModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
    } catch (err) {
      console.error('[updateAppointment] findByIdAndUpdate error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!appt) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    res.json(appt);
  }
);

/* ─────────────────────────────────────────────────────────────── */
/** DELETE /api/appointments/:id */
export const deleteAppointment: RequestHandler<{ id: string }> = asyncHandler(
  async (req, res): Promise<void> => {
    let appt;
    try {
      appt = await AppointmentModel.findByIdAndDelete(req.params.id);
    } catch (err) {
      console.error('[deleteAppointment] findByIdAndDelete error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!appt) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    res.json({ message: 'Appointment removed' });
  }
);
