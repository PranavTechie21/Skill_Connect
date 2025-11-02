import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { db } from "../db";
import { stories } from "../schema";
import { eq } from "drizzle-orm";

const router = Router();

// Submit a new success story
router.post("/submit", authenticateToken, async (req, res) => {
  try {
    const { name, email, title, story } = req.body;
    
    // Validate required fields
    if (!name || !email || !title || !story) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert the story into the database
    const [newStory] = await db.insert(stories).values({
      name,
      email,
      title,
      content: story,
      createdAt: new Date(),
      approved: false // Stories need admin approval before being shown
    }).returning();

    res.status(201).json({
      message: "Story submitted successfully! It will be reviewed by our team.",
      story: newStory
    });
  } catch (error) {
    console.error("Error submitting story:", error);
    res.status(500).json({ error: "Failed to submit story" });
  }
});

// Get all stories (for admin)
router.get("/admin", authenticateToken, async (req, res) => {
  try {
    const allStories = await db.select().from(stories);
    res.json(allStories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

// Get approved stories (for public view)
router.get("/", async (req, res) => {
  try {
    const approvedStories = await db.select()
      .from(stories)
      .where(eq(stories.approved, true));
    res.json(approvedStories);
  } catch (error) {
    console.error("Error fetching approved stories:", error);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

// Approve or reject a story (admin only)
router.patch("/:id/approve", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const [updatedStory] = await db.update(stories)
      .set({ approved })
      .where(eq(stories.id, id))
      .returning();

    res.json(updatedStory);
  } catch (error) {
    console.error("Error updating story approval:", error);
    res.status(500).json({ error: "Failed to update story approval status" });
  }
});

export default router;