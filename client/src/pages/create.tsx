import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Quote, ArrowLeft } from "lucide-react";
import TestimonialWizard from "@/components/testimonial-wizard";

export default function Create() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Quote className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TestimonyShot</h1>
                <p className="text-sm text-gray-500">Create Your Testimonial</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <TestimonialWizard />
      </main>
    </div>
  );
}
