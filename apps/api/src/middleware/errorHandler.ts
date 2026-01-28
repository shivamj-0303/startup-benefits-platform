import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

/**
 * Central error handling middleware
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("Error:", {
    message: err.message,
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  const statusCode = err.statusCode || err.status || 500;
  const response: any = {
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: err.message || "An unexpected error occurred",
    },
  };

  if (env.NODE_ENV === "development" && err.details) {
    response.error.details = err.details;
  }

  if (env.NODE_ENV === "development" && err.stack) {
    response.error.stack = err.stack;
  }

  if (err.name === "MongoServerError" && err.code === 11000) {
    response.error.code = "DUPLICATE_KEY";
    response.error.message = "A record with this data already exists";
    res.status(409).json(response);
    return;
  }

  if (err.name === "ValidationError") {
    response.error.code = "VALIDATION_ERROR";
    res.status(400).json(response);
    return;
  }

  if (err.name === "CastError") {
    response.error.code = "INVALID_ID";
    response.error.message = "Invalid ID format";
    res.status(400).json(response);
    return;
  }

  res.status(statusCode).json(response);
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}
