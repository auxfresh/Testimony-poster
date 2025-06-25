import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  customerName: text("customer_name").notNull(),
  customerRole: text("customer_role"),
  customerCompany: text("customer_company"),
  customerAvatar: text("customer_avatar"),
  rating: integer("rating").notNull().default(5),
  sourceUrl: text("source_url"),
  sourceType: text("source_type"), // 'manual', 'twitter', 'linkedin', etc.
  theme: text("theme").notNull().default("light"),
  primaryColor: text("primary_color").notNull().default("#EF4444"),
  fontFamily: text("font_family").notNull().default("Inter"),
  backgroundType: text("background_type").notNull().default("gradient"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export const updateTestimonialSchema = insertTestimonialSchema.partial();

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Export formats schema
export const exportFormatSchema = z.object({
  aspectRatio: z.enum(["twitter", "instagram", "linkedin", "custom"]),
  width: z.number().min(100).max(2000),
  height: z.number().min(100).max(2000),
  quality: z.number().min(50).max(100).default(97),
  showWatermark: z.boolean().default(true),
});

export type ExportFormat = z.infer<typeof exportFormatSchema>;

// Social media URL validation schema
export const socialUrlSchema = z.object({
  url: z.string().url(),
});

export type SocialUrl = z.infer<typeof socialUrlSchema>;
