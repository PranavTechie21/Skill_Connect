import express, { Request, Response, NextFunction } from "express";
import { db } from "../../src/db";
import { stories } from "../../src/schema";
import { eq } from "drizzle-orm";
import { SessionData } from "express-session";

// Extend the session type to include our custom fields
declare module "express-session" {
  interface SessionData {
    userId: number;
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

  try {
    // TODO: Add admin check when user types are implemented
    next();
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Route to fetch all stories with admin details
 */
router.get("/", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const allStories = await db.select({
      id: stories.id,
      title: stories.title,
      content: stories.content,
      submitterName: stories.submitterName,
      submitterEmail: stories.submitterEmail,
      approved: stories.approved,
      createdAt: stories.createdAt,
      tags: stories.tags
    })
    .from(stories)
    .orderBy(stories.createdAt)
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

export default router;