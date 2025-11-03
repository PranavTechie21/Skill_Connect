import { Router } from "express";
import { db } from "../db";
import { stories } from "../schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = Router();

// Submit a new success story (no authentication required)
router.post("/", async (req, res) => {
  try {
    const { name, email, title, content, tags } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ 
        error: "Missing required fields",
        message: "Title and content are required" 
      });
    }

    // Reset the sequence to ensure we don't get duplicate key errors
    await db.execute(sql`SELECT setval('stories_id_seq', COALESCE((SELECT MAX(id) FROM stories), 0), true);`);

    // Insert the story into the database
    const [newStory] = await db.insert(stories).values({
      title,
      content,
      tags: tags || [],
      authorId: null,
      submitterName: name,
      submitterEmail: email,
      approved: true,
      createdAt: new Date()
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
router.get("/admin", async (req, res) => {
  try {
    const allStories = await db.select().from(stories);
    res.json(allStories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

// Get paginated stories (for public view)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Get total count of approved stories
    const countResult = await db.select({
      count: sql<number>`CAST(COUNT(*) AS INTEGER)`
    })
    .from(stories)
    .where(eq(stories.approved, true));
    const count = Number(countResult[0]?.count || 0);

    // Get paginated approved stories
    const paginatedStories = await db.select()
      .from(stories)
      .where(eq(stories.approved, true))
      .orderBy(sql`${stories.createdAt} DESC`) // Show newest first
      .limit(limit)
      .offset(offset);

    res.json({
      stories: paginatedStories,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});



export default router;