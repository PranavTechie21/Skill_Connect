import express, { Request, Response, NextFunction } from "express";
import { db } from "../../db";
import { stories } from "../../schema";
import { desc, eq } from "drizzle-orm";

// Extend the session type to include our custom fields
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const router = express.Router();

/**
 * Middleware to ensure user is an admin
 */
const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized: Please log in first." });
  }

  // For now, we're using a hardcoded check. Replace with proper admin check later.
  if (req.session.userId !== 'admin-001') {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }

  next();
};

/**
 * Route to fetch all stories for admin
 */
router.get("/", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const allStories = await db
      .select()
      .from(stories)
      .orderBy(desc(stories.createdAt))
      .execute();

    res.status(200).json(allStories);
  } catch (error: any) {
    console.error("❌ Error fetching stories:", error);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

/**
 * Route to approve a story
 */
router.post("/:id/approve", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await db
      .update(stories)
      .set({ approved: true })
      .where(eq(stories.id, Number(id)))
      .execute();

    if (!result) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.status(200).json({ message: "Story approved successfully" });
  } catch (error: any) {
    console.error("❌ Error approving story:", error);
    res.status(500).json({ error: "Failed to approve story" });
  }
});

/**
 * Route to reject a story
 */
router.post("/:id/reject", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await db
      .update(stories)
      .set({ approved: false })
      .where(eq(stories.id, Number(id)))
      .execute();

    if (!result) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.status(200).json({ message: "Story rejected successfully" });
  } catch (error: any) {
    console.error("❌ Error rejecting story:", error);
    res.status(500).json({ error: "Failed to reject story" });
  }
});

/**
 * Route to delete a story
 */
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await db
      .delete(stories)
      .where(eq(stories.id, Number(id)))
      .execute();

    if (!result) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error deleting story:", error);
    res.status(500).json({ error: "Failed to delete story" });
  }
});

export default router;