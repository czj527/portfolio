import { pgTable, serial, timestamp, text, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// Guestbook messages table
export const guestbookMessages = pgTable(
  "guestbook_messages",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 128 }),
    email: varchar("email", { length: 255 }),
    content: text("content").notNull(),
    emoji: varchar("emoji", { length: 8 }).default('😀'),
    likes: serial("likes").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  }
);

// Projects table
export const projects = pgTable(
  "projects",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description").notNull(),
    tags: text("tags").array().default(sql`ARRAY[]::TEXT[]`),
    link: varchar("link", { length: 1024 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  }
);

// Blog posts table
export const blogs = pgTable(
  "blogs",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description").notNull(),
    tags: text("tags").array().default(sql`ARRAY[]::TEXT[]`),
    link: varchar("link", { length: 1024 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  }
);

// Create Zod schemas
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
  coerce: { date: true },
});

// Insert schema for guestbook messages
export const insertGuestbookMessageSchema = createCoercedInsertSchema(guestbookMessages).pick({
  name: true,
  email: true,
  content: true,
});

// Insert schema for projects
export const insertProjectSchema = createCoercedInsertSchema(projects).pick({
  name: true,
  description: true,
  tags: true,
  link: true,
});

// Insert schema for blogs
export const insertBlogSchema = createCoercedInsertSchema(blogs).pick({
  name: true,
  description: true,
  tags: true,
  link: true,
});

// TypeScript types
export type GuestbookMessage = typeof guestbookMessages.$inferSelect;
export type InsertGuestbookMessage = z.infer<typeof insertGuestbookMessageSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Blog = typeof blogs.$inferSelect;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
