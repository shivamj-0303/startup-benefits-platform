import { Router, Request, Response } from "express";
import { authRequired } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createClaimSchema } from "../utils/validation";
import { Claim } from "../models/claim";
import { Deal } from "../models/deal";
import { User } from "../models/user";
import mongoose from "mongoose";

const router = Router();

/**
 * POST /claims
 */
router.post("/", authRequired, validateBody(createClaimSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const { dealId } = req.body;
    const userId = req.user?.sub;

    if (!userId) {
      res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      });
      return;
    }

    if (!dealId) {
      res.status(400).json({
        error: {
          code: "MISSING_DEAL_ID",
          message: "dealId is required",
        },
      });
      return;
    }

    let deal;
    if (mongoose.Types.ObjectId.isValid(dealId)) {
      deal = await Deal.findOne({ _id: dealId, isActive: true });
    }
    
    if (!deal) {
      deal = await Deal.findOne({ slug: dealId, isActive: true });
    }

    if (!deal) {
      res.status(404).json({
        error: {
          code: "DEAL_NOT_FOUND",
          message: "Deal not found or is no longer active",
        },
      });
      return;
    }

    if (deal.accessLevel === "locked") {
      const user = await User.findById(userId);
      
      if (!user || !user.isVerified) {
        res.status(403).json({
          error: {
            code: "VERIFICATION_REQUIRED",
            message: "This deal requires a verified account. Please verify your email to claim locked deals.",
            details: {
              dealSlug: deal.slug,
              dealTitle: deal.title,
              isVerified: user?.isVerified || false,
            },
          },
        });
        return;
      }
    }

    const existingClaim = await Claim.findOne({
      userId,
      dealId: deal._id,
    });

    if (existingClaim) {
      res.status(409).json({
        error: {
          code: "DUPLICATE_CLAIM",
          message: "You have already claimed this deal",
          details: {
            claimId: existingClaim._id,
            claimedAt: existingClaim.claimedAt,
            status: existingClaim.status,
          },
        },
      });
      return;
    }

    const claim = await Claim.create({
      userId,
      dealId: deal._id,
      status: "pending",
      claimedAt: new Date(),
    });

    const populatedClaim = await Claim.findById(claim._id)
      .populate("dealId", "title slug description partnerName category accessLevel ctaText ctaUrl")
      .lean();

    res.status(201).json({
      claim: populatedClaim,
      message: "Deal claimed successfully",
    });
  } catch (error: any) {
    console.error("Claim creation error:", error);

    if (error.code === 11000) {
      res.status(409).json({
        error: {
          code: "DUPLICATE_CLAIM",
          message: "You have already claimed this deal",
        },
      });
      return;
    }

    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to create claim",
        details: error.message,
      },
    });
  }
});

/**
 * GET /me/claims
 */
router.get("/me", authRequired, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      });
      return;
    }

    const claims = await Claim.find({ userId })
      .populate("dealId", "title slug description partnerName partnerUrl category accessLevel eligibility ctaText ctaUrl isActive")
      .sort({ claimedAt: -1 })
      .lean();

    const stats = {
      total: claims.length,
      pending: claims.filter((c) => c.status === "pending").length,
      approved: claims.filter((c) => c.status === "approved").length,
      rejected: claims.filter((c) => c.status === "rejected").length,
    };

    res.json({
      claims,
      stats,
    });
  } catch (error: any) {
    console.error("Get claims error:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to fetch claims",
        details: error.message,
      },
    });
  }
});

export default router;
