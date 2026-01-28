import { Router, Request, Response } from "express";
import { User } from "../models/user";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import { validateBody } from "../middleware/validate";
import { registerSchema, loginSchema } from "../utils/validation";

const router = Router();

/**
 * POST /auth/register
 */
router.post("/register", validateBody(registerSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({
        error: {
          code: "USER_EXISTS",
          message: "User with this email already exists",
        },
      });
      return;
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      name,
    });

    const token = generateToken({
      sub: user._id.toString(),
      email: user.email,
      isVerified: user.isVerified,
    });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({
      error: {
        code: "REGISTRATION_FAILED",
        message: "Registration failed",
        details: error.message,
      },
    });
  }
});

/**
 * POST /auth/login
 */
router.post("/login", validateBody(loginSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
      return;
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
      return;
    }

    const token = generateToken({
      sub: user._id.toString(),
      email: user.email,
      isVerified: user.isVerified,
    });

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      error: {
        code: "LOGIN_FAILED",
        message: "Login failed",
        details: error.message,
      },
    });
  }
});

export default router;
