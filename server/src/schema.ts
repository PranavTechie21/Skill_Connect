
import { pgTable, serial, text, integer, varchar, timestamp, jsonb, date, boolean } from "drizzle-orm/pg-core";

export type ApplicationStatus = 'pending' | 'review' | 'accepted' | 'rejected';

export interface Application {
  id: number;
  userId: number;
  jobId: number;
  status: ApplicationStatus;
  coverLetter?: string;
  attachments: {
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimeType: string;
  }[];
  submittedAt: Date;
  updatedAt: Date;
}

export const userGrowth = pgTable("user_growth", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  users: integer("users").notNull(),
});

export const jobCategories = pgTable("job_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: integer("value").notNull(),
});

export const applicationStatus = pgTable("application_status", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: integer("value").notNull(),
});

export const engagement = pgTable("engagement", {
  id: serial("id").primaryKey(),
  day: text("day").notNull(),
  messages: integer("messages").notNull(),
  applications: integer("applications").notNull(),
});

export const quickStats = pgTable("quick_stats", {
    id: serial("id").primaryKey(),
    totalUsers: integer("total_users").notNull(),
    activeJobs: integer("active_jobs").notNull(),
    applicationsToday: integer("applications_today").notNull(),
    successfulMatches: integer("successful_matches").notNull(),
});

export const topJobListings = pgTable("top_job_listings", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    views: integer("views").notNull(),
    applications: integer("applications").notNull(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  jobId: integer("job_id").notNull(),
  status: text("status").notNull().default('review'),
  coverLetter: text("cover_letter"),
  attachments: jsonb("attachments").notNull().default([]),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  tags: text("tags").array().notNull().default([]),
  submitterName: varchar("submitter_name", { length: 255 }), // Optional for logged in users
  submitterEmail: varchar("submitter_email", { length: 255 }), // Optional for logged in users
  authorId: text("author_id"), // For logged in users
  approved: boolean("approved").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
