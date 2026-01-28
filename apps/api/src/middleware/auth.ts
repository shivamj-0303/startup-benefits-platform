import { Request, Response, NextFunction } from "express";
import { verifyToken, JWTPayload } from "../utils/auth";

/**
 * Extend Express Request to include user info
 */
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware: Require valid JWT token
 */
export function authRequired(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing or invalid Authorization header" });
      return;
    }

    const token = authHeader.substring(7);

    const payload = verifyToken(token);
    req.user = payload;

    next();
  } catch (error: any) {
    res.status(401).json({ error: "Invalid or expired token", details: error.message });
  }
}
