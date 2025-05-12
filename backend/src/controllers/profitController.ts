import { RequestHandler } from 'express';
import asyncHandler       from 'express-async-handler';
import { MedicineSoldModel } from '../database/models/medicineSoldModel';
import { AppointmentModel   } from '../database/models/appointmentModel';
import { ListProfitQuery     } from '../models/Profit';
import { Types } from 'mongoose';

/** 
 * Helper to build the common match object 
 */
function buildMatch(
  query: ListProfitQuery,
  dateField: string
): Record<string, unknown> {
  const match: Record<string, unknown> = {};

  if (query.patient_id)
    match.patient_id = new Types.ObjectId(query.patient_id);
  if (query.doctor_id)
    match.doctor_id = new Types.ObjectId(query.doctor_id);
  if (query.medicine_id)
    match.medicine_id = new Types.ObjectId(query.medicine_id);

  // appointments store the lab ref in `lab`, so map lab_id → lab
  if (query.lab_id)
    match.lab = new Types.ObjectId(query.lab_id);

  // optional time‐range filtering
  if (query.from || query.to) {
    const df: Record<string, unknown> = {};
    if (query.from) df['$gte'] = new Date(query.from);
    if (query.to)   df['$lte'] = new Date(query.to);
    match[dateField] = df;
  }

  return match;
}

//** GET /api/profits/sale */
export const profitBySale: RequestHandler<{}, {}, {}, ListProfitQuery> = asyncHandler(
  async (req, res) => {
    const match = buildMatch(req.query, 'time_sold');

    let result;
    try {
      result = await MedicineSoldModel.aggregate([
        { $match: match },
        {
          $lookup: {
            from:         'medicines',
            localField:   'medicine_id',
            foreignField: '_id',
            as:           'med'
          }
        },
        { $unwind: '$med' },
        {
          $group: {
            _id:   null,
            total: { $sum: { $multiply: ['$quantity', '$med.cost'] } }
          }
        }
      ]);
    } catch (err) {
      console.error('[profitBySale] aggregate error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    res.json({ total: result[0]?.total ?? 0 });
  }
);

/** GET /api/profits/lab */
export const profitByLab: RequestHandler<{}, {}, {}, ListProfitQuery> = asyncHandler(
  async (req, res) => {
    const match = buildMatch(req.query, 'start'); // appointments use ‘start’ for date

    let result;
    try {
      result = await AppointmentModel.aggregate([
        { $match: match },
        {
          $lookup: {
            from:         'labs',
            localField:   'lab',
            foreignField: '_id',
            as:           'lb'
          }
        },
        { $unwind: '$lb' },
        {
          $group: {
            _id:   null,
            total: { $sum: '$lb.cost' }
          }
        }
      ]);
    } catch (err) {
      console.error('[profitByLab] aggregate error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    res.json({ total: result[0]?.total ?? 0 });
  }
);

/** GET /api/profits/all */
export const profitAll: RequestHandler<{}, {}, {}, ListProfitQuery> = asyncHandler(
  async (req, res) => {
    // run both aggregations in parallel
    const [saleRes, labRes] = await Promise.all([
      (async () => {
        const match = buildMatch(req.query, 'time_sold');
        const r = await MedicineSoldModel.aggregate([
          { $match: match },
          {
            $lookup: {
              from:       'medicines',
              localField: 'medicine_id',
              foreignField: '_id',
              as:         'med'
            }
          },
          { $unwind: '$med' },
          {
            $group: {
              _id:   null,
              total: { $sum: { $multiply: ['$quantity', '$med.cost'] } }
            }
          }
        ]);
        return r[0]?.total ?? 0;
      })(),
      (async () => {
        const match = buildMatch(req.query, 'start');
        const r = await AppointmentModel.aggregate([
          { $match: match },
          {
            $lookup: {
              from:       'labs',
              localField: 'lab',
              foreignField: '_id',
              as:         'lb'
            }
          },
          { $unwind: '$lb' },
          {
            $group: {
              _id:   null,
              total: { $sum: '$lb.cost' }
            }
          }
        ]);
        return r[0]?.total ?? 0;
      })(),
    ]);

    res.json({
      sale:  saleRes,
      lab:   labRes,           // e.g. 2200 for your three appointments
      total: saleRes + labRes,
    });
  }
);