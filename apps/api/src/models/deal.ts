import mongoose, { Schema, Document } from "mongoose";
import { schemaOptions } from "../db/connect";

export type AccessLevel = "public" | "locked";

export interface IDeal extends Document {
  title: string;
  slug: string;
  description?: string;
  partnerName?: string;
  partnerUrl?: string;
  category?: string;
  accessLevel: AccessLevel;
  eligibility?: string;
  ctaText?: string;
  ctaUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const dealSchema = new Schema<IDeal>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    partnerName: { type: String },
    partnerUrl: { type: String },
    category: { type: String },
    accessLevel: { type: String, enum: ["public", "locked"], default: "public" },
    eligibility: { type: String },
    ctaText: { type: String },
    ctaUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  schemaOptions
);

dealSchema.index({ category: 1 });
dealSchema.index({ accessLevel: 1 });
dealSchema.index({ isActive: 1 });

dealSchema.index({ title: "text", description: "text", partnerName: "text" });

export const Deal = mongoose.model<IDeal>("Deal", dealSchema);
