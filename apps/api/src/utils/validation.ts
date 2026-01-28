import { z } from "zod";

/**
 * Auth validation schemas
 */
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Claims validation schemas
 */
export const createClaimSchema = z.object({
  dealId: z.string().min(1, "dealId is required"),
});

/**
 * Deals validation schemas (for query params)
 */
export const dealsQuerySchema = z.object({
  category: z.string().optional(),
  accessLevel: z.enum(["public", "locked"]).optional(),
  search: z.string().optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  skip: z.string().regex(/^\d+$/).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateClaimInput = z.infer<typeof createClaimSchema>;
export type DealsQueryInput = z.infer<typeof dealsQuerySchema>;
