import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertTestimonialSchema, updateTestimonialSchema, exportFormatSchema, socialUrlSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for avatar uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), 'client/public/avatars'));
    },
    filename: (req, file, cb) => {
      const uniqueName = `uploaded-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const testimonials = await storage.getUserTestimonials(limit);
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Get single testimonial
  app.get("/api/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testimonial = await storage.getTestimonial(id);
      
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonial" });
    }
  });

  // Create testimonial
  app.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  // Update testimonial
  app.patch("/api/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateTestimonialSchema.parse(req.body);
      const testimonial = await storage.updateTestimonial(id, validatedData);
      res.json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  // Delete testimonial
  app.delete("/api/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTestimonial(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // Parse social media URL
  app.post("/api/parse-social", async (req, res) => {
    try {
      const { url } = req.body;
      
      // Simple URL parsing for demo - in production, you'd use actual APIs
      let platform = "unknown";
      let content = "";
      let author = "";
      
      if (url.includes("twitter.com") || url.includes("x.com")) {
        platform = "twitter";
        content = "Please don't make us wait too long for its release we really need such a tool ❤ tY";
        author = "Akorede Ogunsola";
      } else if (url.includes("linkedin.com")) {
        platform = "linkedin";
        content = "This tool has revolutionized how we handle customer testimonials. Highly recommended!";
        author = "Sarah Johnson";
      } else if (url.includes("facebook.com")) {
        platform = "facebook";
        content = "Amazing service! The team went above and beyond our expectations.";
        author = "Michael Chen";
      } else if (url.includes("instagram.com")) {
        platform = "instagram";
        content = "Love this product! Best purchase I've made this year 🔥";
        author = "Emily Rodriguez";
      }
      
      res.json({
        platform,
        content,
        author,
        sourceUrl: url,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid URL format", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to parse social media URL" });
    }
  });

  // Export testimonial as image (returns base64 data URL)
  app.post("/api/testimonials/:id/export", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const exportOptions = exportFormatSchema.parse(req.body);
      
      const testimonial = await storage.getTestimonial(id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      // In a real implementation, you'd generate the image here using Canvas or similar
      // For now, return a placeholder response
      res.json({
        dataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        width: exportOptions.width,
        height: exportOptions.height,
        format: "png",
        quality: exportOptions.quality,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid export options", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to export testimonial" });
    }
  });

  // Upload avatar endpoint
  app.post("/api/upload-avatar", upload.single('avatar'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const avatarUrl = `/avatars/${req.file.filename}`;
      res.json({ avatarUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload avatar" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
