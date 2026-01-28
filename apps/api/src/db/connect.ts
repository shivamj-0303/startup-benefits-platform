import mongoose from "mongoose";
import { env } from "../config/env";

/**
 * Connect to MongoDB with validation, logging, and event listeners
*/
export async function connectDB(): Promise<void> {
  const uri = env.MONGODB_URI;

  if (!uri || uri.trim() === "") {
    throw new Error(
      "MONGODB_URI is missing or empty. Please set it in your .env file."
    );
  }

  try {
    mongoose.set("strictQuery", true);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    });

    await mongoose.connect(uri);

    const { host, name } = mongoose.connection;
    console.log(`MongoDB connected successfully`);
    console.log(`   Host: ${host}`);
    console.log(`   Database: ${name}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export function setupConnectionListeners(): void {
  const connection = mongoose.connection;

  connection.on("connected", () => {
    console.log("Mongoose connected to MongoDB");
  });

  connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
  });

  connection.on("disconnected", () => {
    console.warn("Mongoose disconnected from MongoDB");
  });

  process.on("SIGINT", async () => {
    await connection.close();
    console.log("Mongoose connection closed due to app termination (SIGINT)");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await connection.close();
    console.log("Mongoose connection closed due to app termination (SIGTERM)");
    process.exit(0);
  });
}

export const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc: any, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
} as const;
