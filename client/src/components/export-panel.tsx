import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download, Copy, ArrowLeft, Monitor, Smartphone, Settings } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TestimonialPreview from "./testimonial-preview";
import { generateTestimonialImage } from "@/lib/canvas-utils";
import type { ExportFormat } from "@shared/schema";

interface ExportPanelProps {
  testimonialId: number;
  testimonial: any;
  onPrevious: () => void;
}

type AspectRatio = "twitter" | "instagram" | "linkedin" | "custom";

const aspectRatioOptions = [
  {
    id: "twitter" as AspectRatio,
    name: "Twitter (16:9)",
    dimensions: "1200 × 675",
    icon: Monitor,
  },
  {
    id: "instagram" as AspectRatio,
    name: "Instagram (1:1)",
    dimensions: "1080 × 1080",
    icon: Smartphone,
  },
  {
    id: "linkedin" as AspectRatio,
    name: "LinkedIn (1.91:1)",
    dimensions: "1200 × 627",
    icon: Monitor,
  },
  {
    id: "custom" as AspectRatio,
    name: "Custom",
    dimensions: "800 × 600",
    icon: Settings,
  },
];

export default function ExportPanel({ testimonialId, testimonial, onPrevious }: ExportPanelProps) {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>("twitter");
  const [quality, setQuality] = useState([97]);
  const [showWatermark, setShowWatermark] = useState(true);
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);
  const [isExporting, setIsExporting] = useState(false);

  const { toast } = useToast();

  const getDimensions = (ratio: AspectRatio) => {
    switch (ratio) {
      case "twitter":
        return { width: 1200, height: 675 };
      case "instagram":
        return { width: 1080, height: 1080 };
      case "linkedin":
        return { width: 1200, height: 627 };
      case "custom":
        return { width: customWidth, height: customHeight };
      default:
        return { width: 1200, height: 675 };
    }
  };

  const exportMutation = useMutation({
    mutationFn: (exportOptions: ExportFormat) =>
      apiRequest("POST", `/api/testimonials/${testimonialId}/export`, exportOptions).then(res => res.json()),
    onSuccess: (data) => {
      // Create download link
      const link = document.createElement("a");
      link.href = data.dataUrl;
      link.download = `testimonial-${testimonialId}.png`;
      link.click();
      
      toast({
        title: "Success",
        description: "Testimonial exported successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to export testimonial. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const dimensions = getDimensions(selectedRatio);
      
      // Generate image using canvas
      const canvas = await generateTestimonialImage(testimonial, {
        width: dimensions.width,
        height: dimensions.height,
        quality: quality[0],
        showWatermark,
      });
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `testimonial-${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(url);
          
          toast({
            title: "Success",
            description: "Testimonial exported successfully!",
          });
        }
      }, "image/png", quality[0] / 100);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export testimonial. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsExporting(false);
  };

  const handleCopyToClipboard = async () => {
    try {
      const dimensions = getDimensions(selectedRatio);
      const canvas = await generateTestimonialImage(testimonial, {
        width: dimensions.width,
        height: dimensions.height,
        quality: quality[0],
        showWatermark,
      });
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
          ]);
          
          toast({
            title: "Success",
            description: "Testimonial copied to clipboard!",
          });
        }
      }, "image/png", quality[0] / 100);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-xl border border-gray-100">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Preview & Export</CardTitle>
        <p className="text-gray-600 text-center">Fine-tune and download your testimonial image</p>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Export Settings */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aspect Ratio</h3>
              <div className="space-y-3">
                {aspectRatioOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedRatio(option.id)}
                      className={`w-full p-4 border-2 rounded-xl flex items-center justify-between transition-colors ${
                        selectedRatio === option.id
                          ? "border-primary bg-red-50"
                          : "border-gray-300 hover:border-primary"
                      }`}
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">{option.name}</h4>
                        <p className="text-sm text-gray-600">{option.dimensions}</p>
                      </div>
                      <IconComponent className={`w-5 h-5 ${
                        selectedRatio === option.id ? "text-primary" : "text-gray-400"
                      }`} />
                    </button>
                  );
                })}
              </div>
              
              {selectedRatio === "custom" && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">Width</Label>
                    <Input
                      id="width"
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number(e.target.value))}
                      min="100"
                      max="2000"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                      min="100"
                      max="2000"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Quality</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Quality: {quality[0]}%</span>
                </div>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  max={100}
                  min={50}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="watermark"
                checked={showWatermark}
                onCheckedChange={setShowWatermark}
              />
              <Label htmlFor="watermark" className="text-sm text-gray-700">
                Show "Powered by TestimonyShot" watermark
              </Label>
            </div>
          </div>

          {/* Final Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Final Preview</h3>
            <div className="bg-gray-100 rounded-2xl p-4 aspect-video flex items-center justify-center">
              <div className="transform scale-75 w-full max-w-md">
                <TestimonialPreview testimonial={testimonial} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
          <Button variant="outline" onClick={onPrevious} className="px-8 py-4 rounded-2xl">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex gap-4">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="px-8 py-4 rounded-2xl font-semibold"
            >
              <Download className="mr-2 w-4 h-4" />
              {isExporting ? "Exporting..." : "Download PNG"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              className="px-8 py-4 rounded-2xl font-semibold"
            >
              <Copy className="mr-2 w-4 h-4" />
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
