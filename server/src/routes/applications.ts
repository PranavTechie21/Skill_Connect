import { Request, Response } from 'express';
import { db } from '../db';
import { applications } from '../schema';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { eq } from 'drizzle-orm';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
}).array('attachments', 5); // Allow up to 5 files

export const createApplication = async (req: Request, res: Response) => {
  const userId = req.user?.id; // Assuming you have user info in req.user from auth middleware
  
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Handle file upload
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });

    const { jobId, coverLetter } = req.body;

    // Get uploaded file details
    const attachments = (req.files as Express.Multer.File[])?.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimeType: file.mimetype
    })) || [];

    // Create application record
    const [application] = await db
      .insert(applications)
      .values({
        userId,
        jobId: parseInt(jobId),
        coverLetter,
        attachments,
        status: 'review'
      })
      .returning();

    res.status(201).json(application);

  } catch (error) {
    console.error('Error creating application:', error);
    
    // Clean up any uploaded files if there was an error
    if (req.files) {
      const files = Array.isArray(req.files) ? req.files : Object.values(req.files);
      await Promise.all(
        files.map(file => 
          fs.unlink(file.path).catch(err => 
            console.error(`Failed to delete file ${file.path}:`, err)
          )
        )
      );
    }

    res.status(500).json({ 
      error: 'Failed to submit application',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getUserApplications = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const userApplications = await db
      .select()
      .from(applications)
      .where(eq(applications.userId, userId));

    res.json(userApplications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};