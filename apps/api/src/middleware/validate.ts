import { Request, Response, NextFunction } from "express";
import { z, ZodError, ZodIssue } from "zod";

/**
 * Middleware to validate request body against a Zod schema
 */
export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            details: error.issues.map((err: ZodIssue) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
        });
        return;
      }
      next(error);
    }
  };
}

/**
 * Middleware to validate query params against a Zod schema
 */
export function validateQuery(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid query parameters",
            details: error.issues.map((err: ZodIssue) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
        });
        return;
      }
      next(error);
    }
  };
}
