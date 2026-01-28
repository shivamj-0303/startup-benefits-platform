import { Router, Request, Response } from "express";
import { authRequired } from "../middleware/auth";

const router = Router();

/**
 * Protected route
 */
router.get("/me", authRequired, (req: Request, res: Response): void => {
  res.json({
    message: "You are authenticated!",
    user: req.user,
  });
});

export default router;
