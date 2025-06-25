import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Play, CheckCircle } from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position: "top" | "bottom" | "left" | "right" | "center";
  action?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to TestimonyShot!",
    description: "Let's create your first professional testimonial graphic. This tutorial will guide you through each step.",
    position: "center",
  },
  {
    id: "input-methods",
    title: "Choose Your Input Method",
    description: "Start by selecting how you want to add your testimonial content. You can paste text directly, import from social media URLs, or upload a screenshot.",
    target: "[data-tutorial='input-methods']",
    position: "bottom",
  },
  {
    id: "social-url",
    title: "Import from Social Media",
    description: "Paste any social media URL (Twitter, LinkedIn, Facebook, Instagram) and we'll extract the testimonial content automatically.",
    target: "[data-tutorial='social-url']",
    position: "bottom",
    action: "Click on 'Social URL' and try pasting a social media link",
  },
  {
    id: "customer-info",
    title: "Customize Customer Details",
    description: "Add the customer's name, role, and company to make your testimonial more credible and professional.",
    target: "[data-tutorial='customer-info']",
    position: "right",
  },
  {
    id: "avatar-selection",
    title: "Choose or Upload Avatar",
    description: "Select from preset avatars or upload a custom photo. You can easily add your own avatar images to personalize testimonials.",
    target: "[data-tutorial='avatar-selection']",
    position: "right",
  },
  {
    id: "rating",
    title: "Set Star Rating",
    description: "Choose a star rating (1-5) to show the customer's satisfaction level visually.",
    target: "[data-tutorial='rating']",
    position: "right",
  },
  {
    id: "preview",
    title: "Live Preview",
    description: "See your testimonial design update in real-time as you make changes. The preview shows exactly how your final image will look.",
    target: "[data-tutorial='preview']",
    position: "left",
  },
  {
    id: "export-formats",
    title: "Choose Export Format",
    description: "Select the perfect dimensions for your platform - Twitter, Instagram, LinkedIn, or custom sizes. Adjust quality settings for optimal results.",
    target: "[data-tutorial='export-formats']",
    position: "top",
  },
  {
    id: "download",
    title: "Download Your Testimonial",
    description: "Export as high-quality PNG or copy directly to clipboard. Your professional testimonial graphic is ready to share!",
    target: "[data-tutorial='download']",
    position: "top",
  },
  {
    id: "complete",
    title: "Tutorial Complete!",
    description: "You're now ready to create amazing testimonial graphics. Click anywhere to start creating your first testimonial.",
    position: "center",
  },
];

interface TutorialOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function TutorialOverlay({ isVisible, onComplete, onSkip }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const currentStepData = tutorialSteps[currentStep];

  useEffect(() => {
    if (!isVisible) return;

    const targetElement = currentStepData.target 
      ? document.querySelector(currentStepData.target) as HTMLElement
      : null;

    setHighlightedElement(targetElement);

    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }
  }, [currentStep, isVisible, currentStepData.target]);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTooltipPosition = () => {
    if (!highlightedElement || currentStepData.position === "center") {
      return {
        position: "fixed" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
      };
    }

    const rect = highlightedElement.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    
    let style: React.CSSProperties = {
      position: "fixed" as const,
      zIndex: 1000,
    };

    switch (currentStepData.position) {
      case "top":
        style.bottom = `${window.innerHeight - rect.top + 20}px`;
        style.left = `${rect.left + rect.width / 2 - tooltipWidth / 2}px`;
        break;
      case "bottom":
        style.top = `${rect.bottom + 20}px`;
        style.left = `${rect.left + rect.width / 2 - tooltipWidth / 2}px`;
        break;
      case "left":
        style.right = `${window.innerWidth - rect.left + 20}px`;
        style.top = `${rect.top + rect.height / 2 - tooltipHeight / 2}px`;
        break;
      case "right":
        style.left = `${rect.right + 20}px`;
        style.top = `${rect.top + rect.height / 2 - tooltipHeight / 2}px`;
        break;
    }

    // Ensure tooltip stays within viewport
    if (style.left && parseInt(style.left.toString()) < 10) {
      style.left = "10px";
    }
    if (style.left && parseInt(style.left.toString()) + tooltipWidth > window.innerWidth - 10) {
      style.left = `${window.innerWidth - tooltipWidth - 10}px`;
    }

    return style;
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Highlight for targeted element */}
      {highlightedElement && (
        <div
          className="fixed border-4 border-primary rounded-lg pointer-events-none z-50"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 4,
            left: highlightedElement.getBoundingClientRect().left - 4,
            width: highlightedElement.getBoundingClientRect().width + 8,
            height: highlightedElement.getBoundingClientRect().height + 8,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
          }}
        />
      )}

      {/* Tutorial Card */}
      <Card className="w-80 shadow-2xl border-2 border-primary" style={getTooltipPosition()}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-600">
                Tutorial {currentStep + 1} of {tutorialSteps.length}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {currentStepData.title}
          </h3>

          <p className="text-gray-600 mb-4 leading-relaxed">
            {currentStepData.description}
          </p>

          {currentStepData.action && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800 font-medium">
                💡 Try this: {currentStepData.action}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep 
                      ? "bg-primary" 
                      : index < currentStep 
                        ? "bg-green-500" 
                        : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              )}
              
              <Button size="sm" onClick={nextStep}>
                {currentStep === tutorialSteps.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}