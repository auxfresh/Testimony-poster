import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { storage } from '../../server/storage.js';
import { insertTestimonialSchema, updateTestimonialSchema, exportFormatSchema } from '../../shared/schema.js';
import { generateTestimonialImage } from '../../client/src/lib/canvas-utils.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Get all testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await storage.getUserTestimonials();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
});

// Get testimonial by ID
app.get('/api/testimonials/:id', async (req, res) => {
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
app.post('/api/testimonials', async (req, res) => {
  try {
    const testimonialData = insertTestimonialSchema.parse(req.body);
    const testimonial = await storage.createTestimonial(testimonialData);
    res.status(201).json(testimonial);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        message: "Invalid testimonial data", 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: "Failed to create testimonial" });
  }
});

// Update testimonial
app.patch('/api/testimonials/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = updateTestimonialSchema.parse(req.body);
    const testimonial = await storage.updateTestimonial(id, updates);
    res.json(testimonial);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        message: "Invalid update data", 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: "Failed to update testimonial" });
  }
});

// Delete testimonial
app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteTestimonial(id);
    
    if (!success) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete testimonial" });
  }
});

// Parse social media URL
app.post('/api/parse-social', async (req, res) => {
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

    if (!content) {
      return res.status(400).json({ message: "Unable to parse this social media URL" });
    }

    res.json({
      platform,
      content,
      author,
      sourceUrl: url
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to parse social media URL" });
  }
});

// Export testimonial
app.post('/api/testimonials/:id/export', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const exportOptions = exportFormatSchema.parse(req.body);
    
    const testimonial = await storage.getTestimonial(id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // Generate image using canvas
    try {
      const imageBuffer = await generateTestimonialImage(testimonial, {
        width: exportOptions.width,
        height: exportOptions.height,
        quality: exportOptions.quality / 100,
        showWatermark: exportOptions.showWatermark
      });

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="testimonial-${id}.png"`);
      res.send(imageBuffer);
    } catch (imageError) {
      res.status(500).json({ 
        message: "Failed to generate testimonial image",
        error: imageError.message 
      });
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        message: "Invalid export options", 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: "Failed to export testimonial" });
  }
});

export const handler = serverless(app);