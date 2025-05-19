import {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
  Model,
} from 'mongoose';

const medicineSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    cost: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

medicineSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } }
);

export type Medicine          = InferSchemaType<typeof medicineSchema>;
export type MedicineDocument  = HydratedDocument<Medicine>;
export type MedicineModelType = Model<Medicine>;

export const MedicineModel: MedicineModelType = model<Medicine>(
  'Medicine',
  medicineSchema
);
