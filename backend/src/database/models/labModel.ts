import {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
  Model,
} from 'mongoose';

const labSchema = new Schema(
  {
    type: { type: String, required: true, trim: true },
    cost: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export type Lab            = InferSchemaType<typeof labSchema>;
export type LabDocument    = HydratedDocument<Lab>;
export type LabModelType   = Model<Lab>;

export const LabModel: LabModelType = model<Lab>('Lab', labSchema);
