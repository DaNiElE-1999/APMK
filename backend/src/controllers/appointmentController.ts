import { RequestHandler } from 'express';
import asyncHandler       from 'express-async-handler';
import { AppointmentModel } from '../database/models/appointmentModel';
import {
  CreateAppointmentBody,
  UpdateAppointmentBody,
  ListAppointmentsQuery,
} from '../models/Appointment';
import { Types } from 'mongoose'

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
export const listAppointments: RequestHandler<
  {},
  {},
  {},
  ListAppointmentsQuery & {
    speciality?: string;   // doctor speciality filter
    ageMin?: string;       // patient age lower bound
    ageMax?: string;       // patient age upper bound
  }
> = asyncHandler(async (req, res) => {
  const {
    doctor_id,
    patient_id,
    lab,
    from,
    to,
    speciality,
    ageMin,
    ageMax,
  } = req.query;

  const match: Record<string, unknown> = {};
  if (doctor_id)  match.doctor_id  = new Types.ObjectId(doctor_id);
  if (patient_id) match.patient_id = new Types.ObjectId(patient_id);
  if (lab)        match.lab        = new Types.ObjectId(lab);

  if (from || to) {
    match.start = {};
    if (from) (match.start as any).$gte = new Date(from);
    if (to)   (match.start as any).$lte = new Date(to);
  }

  const pipeline: any[] = [{ $match: match }];

  pipeline.push(
    {
      $lookup: {
        from: 'doctors',
        localField: 'doctor_id',
        foreignField: '_id',
        as: 'doctor',
      },
    },
    { $unwind: '$doctor' }
  );

  /* Optional doctor speciality filter */
  if (speciality) {
    pipeline.push({
      $match: {
        'doctor.speciality': {
          $regex: new RegExp(`^${speciality}$`, 'i'), // case-insensitive
        },
      },
    });
  }

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

  /* Optional patient age range filter */
  if (ageMin || ageMax) {
    const ageCond: any = {};
    if (ageMin) ageCond.$gte = Number(ageMin);
    if (ageMax) ageCond.$lte = Number(ageMax);
    pipeline.push({ $match: { 'patient.age': ageCond } });
  }

  pipeline.push(
    {
      $lookup: {
        from: 'labs',
        localField: 'lab',
        foreignField: '_id',
        as: 'lab',
      },
    },
    { $unwind: { path: '$lab', preserveNullAndEmptyArrays: true } }
  );

  pipeline.push(
    { $sort: { start: -1 } },
    {
      $project: {
        _id: 1,
        start: 1,
        end: 1,
        createdAt: 1,
        updatedAt: 1,
        doctor:  { _id: 1, first: 1, last: 1, email: 1, speciality: 1 },
        patient: { _id: 1, first: 1, last: 1, email: 1, age: 1 },
        lab:     { _id: 1, type: 1, cost: 1 },
      },
    }
  );

  try {
    const appts = await AppointmentModel.aggregate(pipeline);
    res.json(appts);
  } catch (err) {
    console.error('[listAppointments] aggregate error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

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
