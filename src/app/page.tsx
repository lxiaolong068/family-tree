import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, FileText, Download, Star, ChevronRight } from "lucide-react";

const HomePage = () => {
  return (
    <>
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold">How to Make a Family Tree</h1>
          <p className="text-gray-700 mt-2">Learn how to make a family tree with our simple step-by-step guide and free online tools. Create, display, and share your family history easily.</p>
        </div>
      </div>
      <div className="mt-4">
      {/* Hero Section - with background image and gradient overlay */}
      <div className="relative overflow-hidden rounded-xl mb-12">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full relative">
            <Image
              src="/hero-family-tree.jpg"
              alt="Family Tree Background"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/60 mix-blend-multiply" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 py-16 md:py-24 lg:py-32 max-w-4xl mx-auto text-white">
          <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
            Professional Family Tree Tool
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-md">
            Discover Your Family History<br />
            <span className="text-white/90">Preserve Precious Memories</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl text-white/90">
            Create, display, and share your family tree with our easy-to-use tools. Preserve your family history for generations to come.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/generator">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                Start Creating Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/how-to-make-a-family-tree">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/20">
                Read Our Guide
              </Button>
            </Link>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold">10,000+</p>
              <p className="text-sm text-white/80">Family Trees Created</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold">50+</p>
              <p className="text-sm text-white/80">Professional Templates</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold">4.9/5</p>
              <p className="text-sm text-white/80">User Rating</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold">Free</p>
              <p className="text-sm text-white/80">Basic Version</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-2">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Family Tree Tools</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We provide comprehensive tools and resources to help you create professional family trees with ease
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
            <div className="h-2 bg-primary w-full"></div>
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Easy-to-Use Tools</h3>
              <p className="text-muted-foreground mb-4">
                Our intuitive family tree maker helps you create beautiful family trees in minutes.
              </p>
              <Link href="/generator" className="text-primary flex items-center text-sm font-medium">
                Get Started <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
            <div className="h-2 bg-secondary w-full"></div>
            <CardContent className="pt-6">
              <div className="bg-secondary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-secondary transition-colors">Professional Templates</h3>
              <p className="text-muted-foreground mb-4">
                Choose from a variety of professionally designed family tree templates for different styles and needs.
              </p>
              <Link href="/templates" className="text-secondary flex items-center text-sm font-medium">
                Browse Templates <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
            <div className="h-2 bg-[#f59e0b] w-full"></div>
            <CardContent className="pt-6">
              <div className="bg-[#f59e0b]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-[#f59e0b]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-[#f59e0b] transition-colors">Easy Sharing</h3>
              <p className="text-muted-foreground mb-4">
                Export your family tree as PDF or images to easily share your precious family history with relatives.
              </p>
              <Link href="/knowledge" className="text-[#f59e0b] flex items-center text-sm font-medium">
                Learn More <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Family Tree Creation Steps - Modern Design */}
      <section className="my-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-transparent -z-10 rounded-3xl" style={{ top: '-10%', bottom: '-10%' }}></div>

        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-2">4 Simple Steps</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Create Your Family Tree</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow these four simple steps to easily create your personalized family tree
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card rounded-xl p-6 shadow-lg relative group hover:shadow-xl transition-all">
            <div className="absolute -top-4 -left-4 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">1</div>
            <div className="pt-6">
              <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">Gather Family Information</h3>
              <p className="text-muted-foreground">Contact relatives to collect names, birth dates, and relationship information to build your family tree foundation.</p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg relative group hover:shadow-xl transition-all">
            <div className="absolute -top-4 -left-4 bg-secondary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">2</div>
            <div className="pt-6">
              <h3 className="font-bold text-xl mb-3 group-hover:text-secondary transition-colors">Choose a Family Tree Style</h3>
              <p className="text-muted-foreground">Select from ancestor charts, descendant charts, or hourglass charts to best suit your needs.</p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg relative group hover:shadow-xl transition-all">
            <div className="absolute -top-4 -left-4 bg-[#f59e0b] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">3</div>
            <div className="pt-6">
              <h3 className="font-bold text-xl mb-3 group-hover:text-[#f59e0b] transition-colors">Create Using Our Tool</h3>
              <p className="text-muted-foreground">Use our online tool to organize information and generate a visual family tree.</p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg relative group hover:shadow-xl transition-all">
            <div className="absolute -top-4 -left-4 bg-[#10b981] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">4</div>
            <div className="pt-6">
              <h3 className="font-bold text-xl mb-3 group-hover:text-[#10b981] transition-colors">Export and Share</h3>
              <p className="text-muted-foreground">Save your family tree as PDF or image format to easily share your precious family history with relatives.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/generator">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg">
              Start Creating Your Family Tree <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Family Tree Examples */}
      <section className="my-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-2">Examples</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Family Tree Examples</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            View beautiful family trees created by users with our tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <div className="aspect-[4/3] relative">
              <Image
                src="/example-tree-1.jpg"
                alt="Classic Family Tree Example"
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white transform translate-y-0 group-hover:translate-y-0 transition-transform">
              <h3 className="font-bold text-lg">Classic Family Tree</h3>
              <p className="text-sm text-white/80">Traditional multi-generation family tree with clear relationship display</p>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <div className="aspect-[4/3] relative">
              <Image
                src="/example-tree-2.jpg"
                alt="Modern Family Tree Example"
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white transform translate-y-0 group-hover:translate-y-0 transition-transform">
              <h3 className="font-bold text-lg">Modern Style Family Tree</h3>
              <p className="text-sm text-white/80">Minimalist modern design, perfect for contemporary family display</p>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <div className="aspect-[4/3] relative">
              <Image
                src="/example-tree-3.jpg"
                alt="Illustrated Family Tree Example"
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white transform translate-y-0 group-hover:translate-y-0 transition-transform">
              <h3 className="font-bold text-lg">Illustrated Family Tree</h3>
              <p className="text-sm text-white/80">Artistic design that adds visual appeal to your family history</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/templates">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/20">
              View More Templates <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section - Modern Design */}
      <section className="my-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-2">FAQ</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn about common questions and answers regarding family tree creation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-3 text-primary">What information do I need to create a family tree?</h3>
              <p className="text-muted-foreground">
                To create a basic family tree, you'll need names, birth dates, marriage dates, and death dates of family members. Additional information like places of birth, photos, and stories can enhance your family tree.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-3 text-primary">How many generations should I include?</h3>
              <p className="text-muted-foreground">
                Most family trees include 3-4 generations, but you can create more extensive trees going back 5-10 generations depending on available information and your research goals.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-3 text-primary">Can I add photos to my family tree?</h3>
              <p className="text-muted-foreground">
                Yes, adding photos personalizes your family tree and brings it to life. Our tool allows you to add photos to individual family members.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-3 text-primary">How can I save and share my family tree?</h3>
              <p className="text-muted-foreground">
                You can save your family tree in our cloud database or export it as PDF or image format for easy sharing. When logged in, your family tree will be automatically saved.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/knowledge">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/20">
              View More FAQs <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* User Testimonials */}
      <section className="my-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-2">Testimonials</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what other users think about our family tree creation tools
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-6 shadow-lg relative">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground mb-4 italic">
              "This tool helped me organize our family history with its simple interface and powerful features. I was able to easily add photos and stories, making our family tree come alive."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3">
                J
              </div>
              <div>
                <p className="font-semibold">John D.</p>
                <p className="text-sm text-muted-foreground">New York</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg relative">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground mb-4 italic">
              "As someone interested in family history, this website is my ideal tool. The templates are diverse, the export function is convenient, and I've recommended it to all my relatives."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold mr-3">
                S
              </div>
              <div>
                <p className="font-semibold">Sarah M.</p>
                <p className="text-sm text-muted-foreground">London</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg relative">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
            <p className="text-muted-foreground mb-4 italic">
              "The cloud storage feature is very practical, allowing me to edit my family tree anytime, anywhere. The interface design is beautiful and the workflow is clear. It's a great family tree creation tool."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#f59e0b]/20 flex items-center justify-center text-[#f59e0b] font-bold mr-3">
                R
              </div>
              <div>
                <p className="font-semibold">Robert T.</p>
                <p className="text-sm text-muted-foreground">Sydney</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="my-20 relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
        <div className="relative z-10 py-16 px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Creating Your Family Tree</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Use our tools now to record and preserve your precious family history for generations to come.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generator">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                Start Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/20">
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </div>
    </div>

    {/* Structured Data for SEO */}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "@id": "https://www.family-tree.cc/#howto",
        "name": "How to Make a Family Tree",
        "description": "Learn how to make a family tree with our simple step-by-step guide and free online tools.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Gather Family Information",
            "text": "Contact relatives to collect names, birth dates, and relationship information to build your family tree foundation."
          },
          {
            "@type": "HowToStep",
            "name": "Choose a Family Tree Style",
            "text": "Select from ancestor charts, descendant charts, or hourglass charts to best suit your needs."
          },
          {
            "@type": "HowToStep",
            "name": "Create Using Our Tool",
            "text": "Use our online tool to organize information and generate a visual family tree."
          },
          {
            "@type": "HowToStep",
            "name": "Export and Share",
            "text": "Save your family tree as PDF or image format to easily share your precious family history with relatives."
          }
        ]
      })}}></script>

    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What information do I need to create a family tree?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "To create a basic family tree, you'll need names, birth dates, marriage dates, and death dates of family members. Additional information like places of birth, photos, and stories can enhance your family tree."
            }
          },
          {
            "@type": "Question",
            "name": "How many generations should I include in my family tree?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most family trees include 3-4 generations, but you can create more extensive trees going back 5-10 generations depending on available information and your research goals."
            }
          },
          {
            "@type": "Question",
            "name": "Can I add photos to my family tree?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, adding photos personalizes your family tree and brings it to life. Our tool allows you to add photos to individual family members."
            }
          },
          {
            "@type": "Question",
            "name": "How can I save and share my family tree?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can save your family tree in our cloud database or export it as PDF or image format for easy sharing. When logged in, your family tree will be automatically saved."
            }
          }
        ]
      })}}></script>
    </>
  );
};

export default HomePage;
