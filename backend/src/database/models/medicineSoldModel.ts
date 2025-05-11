import {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
  Model,
  Types,
} from 'mongoose';

const medicineSoldSchema = new Schema(
  {
    patient_id:  { type: Types.ObjectId, ref: 'Patient',  required: true },
    doctor_id:   { type: Types.ObjectId, ref: 'Doctor',   required: true },
    medicine_id: { type: Types.ObjectId, ref: 'Medicine', required: true },
    quantity:    { type: Number, required: true, min: 1 },
    time_sold:   { type: Date, default: Date.now },
  },
  { timestamps: true }
);


export type MedicineSold          = InferSchemaType<typeof medicineSoldSchema>;
export type MedicineSoldDocument  = HydratedDocument<MedicineSold>;
export type MedicineSoldModelType = Model<MedicineSold>;

export const MedicineSoldModel: MedicineSoldModelType = model<MedicineSold>(
  'MedicineSold',
  medicineSoldSchema
);
