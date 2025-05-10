import {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
  Model,
} from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
  {
    username:  { type: String, required: true, unique: true, trim: true },
    firstname: { type: String, required: true, trim: true },
    lastname:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true, select: false },
    role:      { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema>;

export interface UserMethods {
  comparePassword(raw: string): Promise<boolean>;
}

export interface UserStatics {
  signToken(id: string, role: string): string;
}

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as { password?: string };
  if (!update?.password) return next();
  const salt = await bcrypt.genSalt(10);
  update.password = await bcrypt.hash(update.password, salt);
  next();
});

userSchema.method('comparePassword', function (raw: string) {
  return bcrypt.compare(raw, this.password);
});

userSchema.static('signToken', function (id: string, role: string) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: '24h' });
});

export type UserDocument = HydratedDocument<User, UserMethods>;
export type UserModelType = Model<User, {}, UserMethods> & UserStatics;

export const UserModel: UserModelType = model<User, UserModelType>(
  'User',
  userSchema,
);
