import {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
  Model,
  Types,
} from 'mongoose';

const fileSchema = new Schema(
  {
    name:       { type: String, required: true, trim: true },
    path:       { type: String, required: true, trim: true },
    mimeType:   { type: String, required: true, trim: true },
    patient_id: { type: Types.ObjectId, ref: 'Patient' },
    doctor_id:  { type: Types.ObjectId, ref: 'Doctor'  },
  },
  { timestamps: true }
);

export type File            = InferSchemaType<typeof fileSchema>;
export type FileDocument    = HydratedDocument<File>;
export type FileModelType   = Model<File>;

export const FileModel: FileModelType = model<File>('File', fileSchema);
