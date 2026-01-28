import rateLimit from "express-rate-limit";

/**
 * Rate limiter for authentication endpoints
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many authentication attempts. Please try again in 15 minutes.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General rate limiter for all API endpoints
 */
export const generalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Please slow down.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
