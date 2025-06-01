import {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
  Model,
  Types,
} from 'mongoose';

const appointmentSchema = new Schema(
  {
    start:      { type: Date,   required: true },
    end:        { type: Date,   required: true },
    doctor_id:  { type: Types.ObjectId, ref: 'Doctor',   required: true },
    patient_id: { type: Types.ObjectId, ref: 'Patient',  required: true },
    lab:        { type: Types.ObjectId, ref: 'Lab' },           // optional
  },
  { timestamps: true }
);

export type Appointment          = InferSchemaType<typeof appointmentSchema>;
export type AppointmentDocument  = HydratedDocument<Appointment>;
export type AppointmentModelType = Model<Appointment>;

export const AppointmentModel: AppointmentModelType = model<Appointment>(
  'Appointment',
  appointmentSchema
);

const CLINIC_OPEN  = 8;
const CLINIC_CLOSE = 17;

const withinClinicHours = (d: Date) => {
  const h = d.getHours();
  return h >= CLINIC_OPEN && h < CLINIC_CLOSE;
};

// 1. Field-level: both start *and* end must sit inside the window.
appointmentSchema
  .path('start')
  .validate(withinClinicHours, 'Start time must be between 08:00 and 17:00');

appointmentSchema
  .path('end')
  .validate(withinClinicHours, 'End time must be between 08:00 and 17:00');

appointmentSchema.pre('validate', function (next) {
  if (this.start >= this.end) {
    return next(new Error('End time must be after start time'));
  }
  return next();
});
