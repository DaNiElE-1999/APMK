import {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
  Model,
} from 'mongoose';

const doctorSchema = new Schema(
  {
    first:      { type: String, required: true, trim: true },
    last:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:      { type: String, trim: true },
    speciality: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export type Doctor            = InferSchemaType<typeof doctorSchema>;
export type DoctorDocument    = HydratedDocument<Doctor>;
export type DoctorModelType   = Model<Doctor>;

export const DoctorModel: DoctorModelType = model<Doctor>(
  'Doctor',
  doctorSchema,
);
