import {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
  Model
} from 'mongoose';

const patientSchema = new Schema(
  {
    first:  { type: String, required: true, trim: true },
    last:   { type: String, required: true, trim: true },
    email:  { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:  { type: String, trim: true },
    age:    { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export type Patient           = InferSchemaType<typeof patientSchema>;
export type PatientDocument   = HydratedDocument<Patient>;
export type PatientModelType  = Model<Patient>;

export const PatientModel: PatientModelType = model<Patient>(
  'Patient',
  patientSchema
);
