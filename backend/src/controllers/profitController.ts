import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import { Types } from 'mongoose';
import { MedicineSoldModel } from '../database/models/medicineSoldModel';
import { AppointmentModel }  from '../database/models/appointmentModel';
import { ListProfitQuery }   from '../models/Profit';

/* ──────────────────────────────────────────────────────────── */
/* helper */
function buildMatch(query: ListProfitQuery, dateField: string) {
  const match: Record<string, unknown> = {};
  if (query.patient_id)  match.patient_id  = new Types.ObjectId(query.patient_id);
  if (query.doctor_id)   match.doctor_id   = new Types.ObjectId(query.doctor_id);
  if (query.medicine_id) match.medicine_id = new Types.ObjectId(query.medicine_id);
  if (query.lab_id)      match.lab         = new Types.ObjectId(query.lab_id);

  if (query.from || query.to) {
    const df: any = {};
    if (query.from) df.$gte = new Date(query.from);
    if (query.to)   df.$lte = new Date(query.to);
    match[dateField] = df;
  }
  return match;
}

/* ──────────────────────────────────────────────────────────── */
/** GET /api/profits/sale */
export const profitBySale: RequestHandler<
  {},
  {},
  {},
  ListProfitQuery & { ageMin?: string; ageMax?: string }
> = asyncHandler(async (req, res) => {
  const { ageMin, ageMax } = req.query;
  const match = buildMatch(req.query, 'time_sold');

  const pipeline: any[] = [
    { $match: match },
    { $lookup: { from: 'patients', localField: 'patient_id', foreignField: '_id', as: 'pat' } },
    { $unwind: '$pat' },
  ];

  if (ageMin || ageMax) {
    const ageCond: any = {};
    if (ageMin) ageCond.$gte = Number(ageMin);
    if (ageMax) ageCond.$lte = Number(ageMax);
    pipeline.push({ $match: { 'pat.age': ageCond } });
  }

  pipeline.push(
    { $lookup: { from: 'medicines', localField: 'medicine_id', foreignField: '_id', as: 'med' } },
    { $unwind: '$med' },
    {
      $group: {
        _id: null,
        total: { $sum: { $multiply: ['$quantity', '$med.cost'] } },
      },
    }
  );

  try {
    const [result] = await MedicineSoldModel.aggregate(pipeline);
    res.json({ total: result?.total ?? 0 });
  } catch (err) {
    console.error('[profitBySale] aggregate error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

/* ──────────────────────────────────────────────────────────── */
/** GET /api/profits/lab */
export const profitByLab: RequestHandler<
  {},
  {},
  {},
  ListProfitQuery & { ageMin?: string; ageMax?: string }
> = asyncHandler(async (req, res) => {
  const { ageMin, ageMax } = req.query;
  const match = buildMatch(req.query, 'start');

  const pipeline: any[] = [
    { $match: match },
    { $lookup: { from: 'patients', localField: 'patient_id', foreignField: '_id', as: 'pat' } },
    { $unwind: '$pat' },
  ];

  if (ageMin || ageMax) {
    const ageCond: any = {};
    if (ageMin) ageCond.$gte = Number(ageMin);
    if (ageMax) ageCond.$lte = Number(ageMax);
    pipeline.push({ $match: { 'pat.age': ageCond } });
  }

  pipeline.push(
    { $lookup: { from: 'labs', localField: 'lab', foreignField: '_id', as: 'lb' } },
    { $unwind: '$lb' },
    { $group: { _id: null, total: { $sum: '$lb.cost' } } }
  );

  try {
    const [result] = await AppointmentModel.aggregate(pipeline);
    res.json({ total: result?.total ?? 0 });
  } catch (err) {
    console.error('[profitByLab] aggregate error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

/* ──────────────────────────────────────────────────────────── */
/** GET /api/profits/all */
export const profitAll: RequestHandler<
  {},
  {},
  {},
  ListProfitQuery & { ageMin?: string; ageMax?: string }
> = asyncHandler(async (req, res) => {
  const { ageMin, ageMax } = req.query;

  const patientStages = () => {
    const stages: any[] = [
      { $lookup: { from: 'patients', localField: 'patient_id', foreignField: '_id', as: 'pat' } },
      { $unwind: '$pat' },
    ];
    if (ageMin || ageMax) {
      const ageCond: any = {};
      if (ageMin) ageCond.$gte = Number(ageMin);
      if (ageMax) ageCond.$lte = Number(ageMax);
      stages.push({ $match: { 'pat.age': ageCond } });
    }
    return stages;
  };

  const [saleRes, labRes] = await Promise.all([
    (async () => {
      const pipeline: any[] = [
        { $match: buildMatch(req.query, 'time_sold') },
        ...patientStages(),
        { $lookup: { from: 'medicines', localField: 'medicine_id', foreignField: '_id', as: 'med' } },
        { $unwind: '$med' },
        { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$med.cost'] } } } },
      ];
      const [r] = await MedicineSoldModel.aggregate(pipeline);
      return r?.total ?? 0;
    })(),
    (async () => {
      const pipeline: any[] = [
        { $match: buildMatch(req.query, 'start') },
        ...patientStages(),
        { $lookup: { from: 'labs', localField: 'lab', foreignField: '_id', as: 'lb' } },
        { $unwind: '$lb' },
        { $group: { _id: null, total: { $sum: '$lb.cost' } } },
      ];
      const [r] = await AppointmentModel.aggregate(pipeline);
      return r?.total ?? 0;
    })(),
  ]);

  res.json({
    sale:  saleRes,
    lab:   labRes,
    total: saleRes + labRes,
  });
});
