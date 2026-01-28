import mongoose, { Schema, Document } from "mongoose";
import { schemaOptions } from "../db/connect";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  isVerified: boolean;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, required: false },
  },
  schemaOptions
);

export const User = mongoose.model<IUser>("User", userSchema);
