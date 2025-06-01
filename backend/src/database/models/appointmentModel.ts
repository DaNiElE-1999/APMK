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
