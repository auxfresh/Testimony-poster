import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Keyboard, Link2, Image, ArrowRight, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AvatarSelector from "./avatar-selector";
import TestimonialPreview from "./testimonial-preview";
import ExportPanel from "./export-panel";
import { parseSocialUrl } from "@/lib/social-parser";
import type { InsertTestimonial } from "@shared/schema";

type WizardStep = "content" | "customize" | "preview" | "export";

interface TestimonialData extends Partial<InsertTestimonial> {
  id?: number;
}

export default function TestimonialWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>("content");
  const [inputMethod, setInputMethod] = useState<"text" | "url" | "image">("url");
  const [testimonialData, setTestimonialData] = useState<TestimonialData>({
    content: "",
    customerName: "",
    customerRole: "",
    customerCompany: "",
    customerAvatar: "/avatars/avatar-1.jpg",
    rating: 5,
    theme: "light",
    primaryColor: "#EF4444",
    fontFamily: "Inter",
    backgroundType: "gradient",
  });
  const [socialUrl, setSocialUrl] = useState("");
  const [textContent, setTextContent] = useState("");

  const { toast } = useToast();

  const parseSocialMutation = useMutation({
    mutationFn: (url: string) => parseSocialUrl(url),
    onSuccess: (data) => {
      setTestimonialData(prev => ({
        ...prev,
        content: data.content,
        customerName: data.author,
        sourceUrl: url,
        sourceType: data.platform,
      }));
      toast({
        title: "Success",
        description: "Social media content imported successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to parse social media URL. Please check the URL and try again.",
        variant: "destructive",
      });
    },
  });

  const createTestimonialMutation = useMutation({
    mutationFn: (data: InsertTestimonial) => 
      apiRequest("POST", "/api/testimonials", data).then(res => res.json()),
    onSuccess: (data) => {
      setTestimonialData(prev => ({ ...prev, id: data.id }));
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Success",
        description: "Testimonial created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create testimonial. Please try again.",
        variant: "destructive",
      });
    },
  });

  const steps = [
    { id: "content", label: "Content", number: 1 },
    { id: "customize", label: "Customize", number: 2 },
    { id: "preview", label: "Preview", number: 3 },
    { id: "export", label: "Export", number: 4 },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const handleNext = () => {
    if (currentStep === "content") {
      if (inputMethod === "url" && socialUrl) {
        parseSocialMutation.mutate(socialUrl);
      } else if (inputMethod === "text" && textContent) {
        setTestimonialData(prev => ({
          ...prev,
          content: textContent,
          sourceType: "manual",
        }));
      }
      setCurrentStep("customize");
    } else if (currentStep === "customize") {
      // Create testimonial when moving to preview
      const testimonialToCreate: InsertTestimonial = {
        content: testimonialData.content || "",
        customerName: testimonialData.customerName || "",
        customerRole: testimonialData.customerRole,
        customerCompany: testimonialData.customerCompany,
        customerAvatar: testimonialData.customerAvatar,
        rating: testimonialData.rating || 5,
        sourceUrl: testimonialData.sourceUrl,
        sourceType: testimonialData.sourceType || "manual",
        theme: testimonialData.theme || "light",
        primaryColor: testimonialData.primaryColor || "#EF4444",
        fontFamily: testimonialData.fontFamily || "Inter",
        backgroundType: testimonialData.backgroundType || "gradient",
      };
      createTestimonialMutation.mutate(testimonialToCreate);
      setCurrentStep("preview");
    } else if (currentStep === "preview") {
      setCurrentStep("export");
    }
  };

  const handlePrevious = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].id as WizardStep);
    }
  };

  const canProceed = () => {
    if (currentStep === "content") {
      return (inputMethod === "url" && socialUrl) || 
             (inputMethod === "text" && textContent.length >= 10);
    }
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  index <= currentStepIndex
                    ? "bg-primary text-white" 
                    : "bg-gray-300 text-gray-600"
                }`}>
                  {step.number}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  index <= currentStepIndex ? "text-gray-900" : "text-gray-500"
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 ml-4 ${
                  index < currentStepIndex ? "bg-primary" : "bg-gray-300"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === "content" && (
        <Card className="shadow-xl border border-gray-100">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Add Your Testimonial Content</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Input Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setInputMethod("text")}
                className={`p-6 border-2 rounded-2xl transition-all group ${
                  inputMethod === "text" 
                    ? "border-primary bg-red-50" 
                    : "border-gray-200 hover:border-primary hover:bg-red-50"
                }`}
              >
                <div className="text-center">
                  <Keyboard className={`w-8 h-8 mx-auto mb-4 ${
                    inputMethod === "text" ? "text-primary" : "text-gray-400 group-hover:text-primary"
                  }`} />
                  <h3 className="font-semibold text-gray-900 mb-2">Paste Text</h3>
                  <p className="text-sm text-gray-500">Paste testimonial text directly</p>
                </div>
              </button>
              <button
                onClick={() => setInputMethod("url")}
                className={`p-6 border-2 rounded-2xl transition-all group ${
                  inputMethod === "url" 
                    ? "border-primary bg-red-50" 
                    : "border-gray-200 hover:border-primary hover:bg-red-50"
                }`}
              >
                <div className="text-center">
                  <Link2 className={`w-8 h-8 mx-auto mb-4 ${
                    inputMethod === "url" ? "text-primary" : "text-gray-400 group-hover:text-primary"
                  }`} />
                  <h3 className="font-semibold text-gray-900 mb-2">Social URL</h3>
                  <p className="text-sm text-gray-500">Import from social media</p>
                </div>
              </button>
              <button
                onClick={() => setInputMethod("image")}
                className={`p-6 border-2 rounded-2xl transition-all group ${
                  inputMethod === "image" 
                    ? "border-primary bg-red-50" 
                    : "border-gray-200 hover:border-primary hover:bg-red-50"
                }`}
              >
                <div className="text-center">
                  <Image className={`w-8 h-8 mx-auto mb-4 ${
                    inputMethod === "image" ? "text-primary" : "text-gray-400 group-hover:text-primary"
                  }`} />
                  <h3 className="font-semibold text-gray-900 mb-2">Upload Image</h3>
                  <p className="text-sm text-gray-500">Extract from screenshot</p>
                </div>
              </button>
            </div>

            {/* Input Content */}
            <div className="space-y-6">
              {inputMethod === "url" && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Social Media URL</Label>
                  <Input
                    type="url"
                    placeholder="https://twitter.com/user/status/123 or https://linkedin.com/posts/..."
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-2">Enter a URL from Twitter/X, LinkedIn, Facebook, Instagram, or other platforms</p>
                </div>
              )}

              {inputMethod === "text" && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Testimonial Text</Label>
                  <Textarea
                    rows={4}
                    placeholder="Paste your testimonial, review, or feedback here..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="mt-2 resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Minimum 10 characters</span>
                    <span className="text-sm text-gray-500">{textContent.length}/500</span>
                  </div>
                </div>
              )}

              {inputMethod === "image" && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Upload Screenshot</Label>
                  <label className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center block cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const text = event.target?.result as string;
                            // For now, we'll just set some placeholder text
                            // In a real implementation, you'd use OCR to extract text
                            setTextContent("This is extracted text from the uploaded image. OCR functionality would parse the actual testimonial content here.");
                            setInputMethod("text");
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                    <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Drag and drop an image here, or click to select</p>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG, WEBP up to 10MB</p>
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={handleNext}
                disabled={!canProceed() || parseSocialMutation.isPending}
                className="px-12 py-4 rounded-2xl font-semibold"
              >
                {parseSocialMutation.isPending ? "Processing..." : "Next Step"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === "customize" && (
        <Card className="shadow-xl border border-gray-100">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Customize Design</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Customization Options */}
              <div className="space-y-8">
                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={testimonialData.customerName || ""}
                        onChange={(e) => setTestimonialData(prev => ({ ...prev, customerName: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Role/Title</Label>
                      <Input
                        value={testimonialData.customerRole || ""}
                        onChange={(e) => setTestimonialData(prev => ({ ...prev, customerRole: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={testimonialData.customerCompany || ""}
                        onChange={(e) => setTestimonialData(prev => ({ ...prev, customerCompany: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating (1-5 stars)</h3>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setTestimonialData(prev => ({ ...prev, rating }))}
                        className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-semibold transition-colors ${
                          testimonialData.rating === rating
                            ? "border-primary bg-red-50 text-primary"
                            : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Selection */}
                <AvatarSelector
                  selectedAvatar={testimonialData.customerAvatar}
                  onAvatarChange={(avatar) => setTestimonialData(prev => ({ ...prev, customerAvatar: avatar }))}
                />

                {/* Font Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Font Family</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Inter", preview: "The quick brown fox jumps" },
                      { name: "Roboto", preview: "The quick brown fox jumps" },
                      { name: "General Sans", preview: "The quick brown fox jumps" },
                    ].map((font) => (
                      <button
                        key={font.name}
                        onClick={() => setTestimonialData(prev => ({ ...prev, fontFamily: font.name }))}
                        className={`w-full p-4 border-2 rounded-xl text-left transition-colors ${
                          testimonialData.fontFamily === font.name
                            ? "border-primary bg-red-50"
                            : "border-gray-300 hover:border-primary"
                        }`}
                      >
                        <h4 className="font-semibold text-gray-900">{font.name}</h4>
                        <p className="text-sm text-gray-600">{font.preview}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Live Preview */}
              <div className="lg:sticky lg:top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                <TestimonialPreview testimonial={testimonialData} />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevious} className="px-8 py-4 rounded-2xl">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Previous
              </Button>
              <Button 
                onClick={handleNext}
                disabled={createTestimonialMutation.isPending}
                className="px-12 py-4 rounded-2xl font-semibold"
              >
                {createTestimonialMutation.isPending ? "Creating..." : "Continue to Export"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === "preview" && (
        <Card className="shadow-xl border border-gray-100">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Preview Your Testimonial</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="max-w-2xl mx-auto">
              <TestimonialPreview testimonial={testimonialData} />
            </div>
            
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevious} className="px-8 py-4 rounded-2xl">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Previous
              </Button>
              <Button onClick={handleNext} className="px-12 py-4 rounded-2xl font-semibold">
                Continue to Export
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === "export" && testimonialData.id && (
        <ExportPanel 
          testimonialId={testimonialData.id}
          testimonial={testimonialData}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
}
