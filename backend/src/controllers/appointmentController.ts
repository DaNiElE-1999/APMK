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
    speciality?: string;
    ageMin?: string;
    ageMax?: string;
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

  const errors: string[] = [];

  function asObjectId(id: string | undefined, label: string) {
    if (!id) return undefined;
    if (!Types.ObjectId.isValid(id)) {
      errors.push(`${label} is not a valid ObjectId`);
      return undefined;
    }
    return new Types.ObjectId(id);
  }

  function asDateISO(str: string | undefined, label: string) {
    if (!str) return undefined;
    const d = new Date(str);
    if (Number.isNaN(d.getTime())) {
      errors.push(`${label} is not a valid ISO date`);
      return undefined;
    }
    return d;
  }

  function asNumber(str: string | undefined, label: string) {
    if (str == null) return undefined;
    const n = Number(str);
    if (!Number.isFinite(n)) {
      errors.push(`${label} is not a valid number`);
      return undefined;
    }
    return n;
  }

  const doctorId  = asObjectId(doctor_id,  'doctor_id');
  const patientId = asObjectId(patient_id, 'patient_id');
  const labId     = asObjectId(lab,        'lab');

  const fromDate  = asDateISO(from, 'from');
  const toDate    = asDateISO(to,   'to');

  const ageMinN   = asNumber(ageMin, 'ageMin');
  const ageMaxN   = asNumber(ageMax, 'ageMax');

  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  const match: Record<string, unknown> = {};
  if (doctorId)  match.doctor_id  = doctorId;
  if (patientId) match.patient_id = patientId;
  if (labId)     match.lab        = labId;

  if (fromDate || toDate) {
    match.start = {};
    if (fromDate) (match.start as any).$gte = fromDate;
    if (toDate)   (match.start as any).$lte = toDate;
  }

  const pipeline: any[] = [{ $match: match }];

  pipeline.push(
    { $lookup: {
        from: 'doctors',
        localField: 'doctor_id',
        foreignField: '_id',
        as: 'doctor',
      }},
    { $unwind: '$doctor' }
  );

  if (speciality) {
    pipeline.push({
      $match: {
        'doctor.speciality': { $regex: new RegExp(`^${speciality}$`, 'i') },
      },
    });
  }

  pipeline.push(
    { $lookup: {
        from: 'patients',
        localField: 'patient_id',
        foreignField: '_id',
        as: 'patient',
      }},
    { $unwind: '$patient' }
  );

  if (ageMinN != null || ageMaxN != null) {
    const ageCond: any = {};
    if (ageMinN != null) ageCond.$gte = ageMinN;
    if (ageMaxN != null) ageCond.$lte = ageMaxN;
    pipeline.push({ $match: { 'patient.age': ageCond } });
  }

  pipeline.push(
    { $lookup: {
        from: 'labs',
        localField: 'lab',
        foreignField: '_id',
        as: 'lab',
      }},
    { $unwind: { path: '$lab', preserveNullAndEmptyArrays: true } }
  );

  pipeline.push(
    { $sort: { start: -1 } },
    { $project: {
        _id: 1,
        start: 1,
        end: 1,
        createdAt: 1,
        updatedAt: 1,
        doctor:  { _id: 1, first: 1, last: 1, email: 1, speciality: 1 },
        patient: { _id: 1, first: 1, last: 1, email: 1, age: 1 },
        lab:     { _id: 1, type: 1, cost: 1 },
      }},
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
