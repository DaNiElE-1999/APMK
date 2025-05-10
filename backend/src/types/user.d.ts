export interface IUserDocument extends IUser, Document {
  comparePassword(raw: string): Promise<boolean>;
}