import { Router, Request, Response } from "express";
import { Deal } from "../models/deal";

const router = Router();

/**
 * GET /deals
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, accessLevel, search, limit = "50", skip = "0" } = req.query;

    const query: any = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (accessLevel) {
      if (accessLevel === "public" || accessLevel === "locked") {
        query.accessLevel = accessLevel;
      } else {
        res.status(400).json({ error: "Invalid accessLevel. Must be 'public' or 'locked'" });
        return;
      }
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100);
    const skipNum = Math.max(parseInt(skip as string, 10) || 0, 0);

    const deals = await Deal.find(query)
      .limit(limitNum)
      .skip(skipNum)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Deal.countDocuments(query);

    res.json({
      deals,
      pagination: {
        total,
        limit: limitNum,
        skip: skipNum,
        hasMore: skipNum + deals.length < total,
      },
    });
  } catch (error: any) {
    console.error("Get deals error:", error);
    res.status(500).json({ error: "Failed to fetch deals", details: error.message });
  }
});

/**
 * GET /deals/:slugOrId
 */
router.get("/:slugOrId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { slugOrId } = req.params;

    if (!slugOrId || typeof slugOrId !== "string") {
      res.status(400).json({ error: "Invalid slug or ID" });
      return;
    }

    let deal = await Deal.findOne({ slug: slugOrId, isActive: true }).lean();

    if (!deal) {
      if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
        deal = await Deal.findOne({ _id: slugOrId, isActive: true }).lean();
      }
    }

    if (!deal) {
      res.status(404).json({ error: "Deal not found" });
      return;
    }

    res.json({ deal });
  } catch (error: any) {
    console.error("Get deal error:", error);
    res.status(500).json({ error: "Failed to fetch deal", details: error.message });
  }
});

export default router;
