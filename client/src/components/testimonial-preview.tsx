import { Card, CardContent } from "@/components/ui/card";
import { Star, ThumbsUp } from "lucide-react";

interface TestimonialData {
  content?: string;
  customerName?: string;
  customerRole?: string;
  customerCompany?: string;
  customerAvatar?: string;
  rating?: number;
  theme?: string;
  primaryColor?: string;
  fontFamily?: string;
  backgroundType?: string;
}

interface TestimonialPreviewProps {
  testimonial: TestimonialData;
}

export default function TestimonialPreview({ testimonial }: TestimonialPreviewProps) {
  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 5: return "Excellent";
      case 4: return "Very Good";
      case 3: return "Good";
      case 2: return "Fair";
      case 1: return "Poor";
      default: return "Good";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="testimonial-card shadow-xl">
      <CardContent className="p-8">
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
            <Star className="text-white w-3 h-3" />
          </div>
          <span className="ml-2 text-sm font-medium text-gray-600">Customer Review</span>
          <span className="ml-auto text-sm text-gray-500">June 25, 2025</span>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="flex">
            {renderStars(testimonial.rating || 5)}
          </div>
          <span className="ml-2 text-lg font-bold text-gray-900">
            {testimonial.rating || 5}.0
          </span>
          <span className="ml-2 text-sm text-gray-500">
            {getRatingLabel(testimonial.rating || 5)}
          </span>
        </div>
        
        <p className={`mb-6 leading-relaxed break-words ${
          testimonial.theme === 'glassmorphic' ? 'text-white' : 'text-gray-800'
        }`}>
          {testimonial.content || "Enter your testimonial content to see it displayed here"}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={testimonial.customerAvatar || "/avatars/avatar-1.jpg"}
              alt="Customer avatar"
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50";
              }}
            />
            <div className="ml-3">
              <h4 className={`font-semibold ${
                testimonial.theme === 'glassmorphic' ? 'text-white' : 'text-gray-900'
              }`}>
                {testimonial.customerName || "Enter customer name"}
              </h4>
              <p className={`text-sm ${
                testimonial.theme === 'glassmorphic' ? 'text-gray-200' : 'text-gray-500'
              }`}>
                {testimonial.customerRole && testimonial.customerCompany
                  ? `${testimonial.customerRole} at ${testimonial.customerCompany}`
                  : testimonial.customerRole || testimonial.customerCompany || "Enter role/company"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-500">
              <ThumbsUp className="w-4 h-4 text-yellow-500 mr-1" />
              <span>Helpful</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
          <span>Review #7852</span>
          <span>29 found this helpful • Verified purchase</span>
        </div>
        
        <div className="text-center mt-4">
          <span className="text-xs text-gray-400">Powered by TestimonyShot</span>
        </div>
      </CardContent>
    </Card>
  );
}
