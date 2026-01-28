import mongoose, { Schema, Document, Types } from "mongoose";
import { schemaOptions } from "../db/connect";

export type ClaimStatus = "pending" | "approved" | "rejected";

export interface IClaim extends Document {
  userId: Types.ObjectId;
  dealId: Types.ObjectId;
  status: ClaimStatus;
  claimedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const claimSchema = new Schema<IClaim>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    dealId: { type: Schema.Types.ObjectId, ref: "Deal", required: true, index: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    claimedAt: { type: Date, default: Date.now },
  },
  schemaOptions
);

claimSchema.index({ userId: 1, dealId: 1 }, { unique: true });

export const Claim = mongoose.model<IClaim>("Claim", claimSchema);
