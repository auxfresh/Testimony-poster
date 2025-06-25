import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Palette, Download, Eye, Smartphone, Twitter, Instagram, Linkedin, Facebook } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Quote className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TestimonyShot</h1>
                <p className="text-sm text-gray-500">Turn Feedback Into Flex</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative testimonial-gradient min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="floating-elements"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Turn Customer <br />
              <span className="text-yellow-300">Feedback</span> Into <br />
              Social Media <span className="text-yellow-300">Gold</span>
            </h1>
            <p className="text-xl text-white text-opacity-90 mb-12 max-w-2xl mx-auto">
              Create stunning testimonial graphics in seconds. Import from social media, customize with your brand, and export in any format.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl">
                <Link href="/create">
                  <Palette className="mr-2 w-5 h-5" />
                  Create Testimonial
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-2xl font-semibold text-lg bg-transparent">
                Watch Demo
              </Button>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <span className="glassmorphic px-4 py-2 rounded-full text-white text-sm flex items-center">
                <Twitter className="mr-2 w-4 h-4" />
                Twitter Import
              </span>
              <span className="glassmorphic px-4 py-2 rounded-full text-white text-sm flex items-center">
                <Instagram className="mr-2 w-4 h-4" />
                Instagram Ready
              </span>
              <span className="glassmorphic px-4 py-2 rounded-full text-white text-sm flex items-center">
                <Palette className="mr-2 w-4 h-4" />
                Brand Customization
              </span>
              <span className="glassmorphic px-4 py-2 rounded-full text-white text-sm flex items-center">
                <Download className="mr-2 w-4 h-4" />
                HD Export
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Create <span className="text-primary">Amazing Testimonials</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From social media imports to brand customization, we've got all the tools you need to turn customer feedback into powerful marketing assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Twitter className="text-blue-500 w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Media Import</h3>
                <p className="text-gray-600 mb-4">Import testimonials directly from Twitter, LinkedIn, Facebook, Instagram, and more with just a URL.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Twitter/X posts</li>
                  <li>• LinkedIn recommendations</li>
                  <li>• Instagram comments</li>
                  <li>• Facebook reviews</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <Palette className="text-purple-500 w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Brand Customization</h3>
                <p className="text-gray-600 mb-4">Match your brand with custom colors, fonts, and layouts. Create consistent testimonials that align with your brand identity.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Custom color palettes</li>
                  <li>• Font selection</li>
                  <li>• Background options</li>
                  <li>• Logo integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <Smartphone className="text-green-500 w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Multi-Format Export</h3>
                <p className="text-gray-600 mb-4">Export in perfect dimensions for every social media platform. From Instagram squares to Twitter banners.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Instagram (1:1)</li>
                  <li>• Twitter (16:9)</li>
                  <li>• LinkedIn (1.91:1)</li>
                  <li>• Custom dimensions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                  <Star className="text-red-500 w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Star Rating System</h3>
                <p className="text-gray-600 mb-4">Add visual star ratings to make your testimonials more credible and eye-catching for potential customers.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• 1-5 star ratings</li>
                  <li>• Custom rating labels</li>
                  <li>• Visual star displays</li>
                  <li>• Rating averages</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="text-indigo-500 w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Preview</h3>
                <p className="text-gray-600 mb-4">See your testimonial design in real-time as you make changes. No surprises, just perfect testimonials every time.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Real-time updates</li>
                  <li>• Multiple templates</li>
                  <li>• Responsive preview</li>
                  <li>• Quality preview</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                  <Download className="text-orange-500 w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">HD Quality Export</h3>
                <p className="text-gray-600 mb-4">Download high-quality PNG images perfect for print and digital use. Adjustable quality up to 97%.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• High-resolution output</li>
                  <li>• PNG format</li>
                  <li>• Quality control</li>
                  <li>• Batch export</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 testimonial-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="floating-elements"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Turn Your Feedback Into <span className="text-yellow-300">Marketing Gold?</span>
          </h2>
          <p className="text-xl text-white text-opacity-90 mb-12 max-w-2xl mx-auto">
            Join thousands of businesses who are already using TestimonyShot to create stunning testimonials that convert.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl">
              <Link href="/create">
                Start Creating Now
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-5 rounded-2xl font-bold text-lg">
              See It In Action
            </Button>  
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white text-opacity-80">
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Free to start</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Export HD quality</span>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}