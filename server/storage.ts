import { testimonials, type Testimonial, type InsertTestimonial } from "@shared/schema";

export interface IStorage {
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, updates: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: number): Promise<boolean>;
  getUserTestimonials(limit?: number): Promise<Testimonial[]>;
}

export class MemStorage implements IStorage {
  private testimonials: Map<number, Testimonial>;
  private currentId: number;

  constructor() {
    this.testimonials = new Map();
    this.currentId = 1;
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentId++;
    const testimonial: Testimonial = {
      ...insertTestimonial,
      sourceType: insertTestimonial.sourceType || null,
      customerRole: insertTestimonial.customerRole || null,
      customerCompany: insertTestimonial.customerCompany || null,
      customerAvatar: insertTestimonial.customerAvatar || null,
      sourceUrl: insertTestimonial.sourceUrl || null,
      rating: insertTestimonial.rating || 5,
      theme: insertTestimonial.theme || "light",
      primaryColor: insertTestimonial.primaryColor || "#EF4444",
      fontFamily: insertTestimonial.fontFamily || "Inter",
      backgroundType: insertTestimonial.backgroundType || "gradient",
      id,
      createdAt: new Date(),
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: number, updates: Partial<InsertTestimonial>): Promise<Testimonial> {
    const existing = this.testimonials.get(id);
    if (!existing) {
      throw new Error(`Testimonial with id ${id} not found`);
    }
    
    const updated: Testimonial = {
      ...existing,
      ...updates,
    };
    this.testimonials.set(id, updated);
    return updated;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }

  async getUserTestimonials(limit = 10): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
