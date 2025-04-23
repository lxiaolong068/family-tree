import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const HomePage = () => {
  return (
    <PageLayout 
      title="How to Make a Family Tree"
      description="Learn how to make a family tree with our simple step-by-step guide and free online tools. Create, display, and share your family history easily."
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">How to Make a Family Tree</h1>
          <p className="text-xl text-gray-700">
            Creating your family tree has never been easier. Discover your roots and preserve your family history.
          </p>
          <div className="mt-6">
            <Link href="/generator">
              <Button size="lg" className="mr-4">Start Creating Now</Button>
            </Link>
            <Link href="/how-to-make-a-family-tree">
              <Button variant="outline" size="lg">Read Our Guide</Button>
            </Link>
          </div>
        </section>
        
        <section className="grid md:grid-cols-3 gap-6 my-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-3">Easy-to-Use Tools</h3>
            <p>Our intuitive family tree maker helps you create beautiful family trees in minutes.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-3">Professional Templates</h3>
            <p>Choose from a variety of professionally designed family tree templates.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-3">Easy Sharing</h3>
            <p>Export your family tree as PDF or images to share with family members.</p>
          </div>
        </section>
        
        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">How to Create Your Family Tree in 4 Simple Steps</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
              <div>
                <h3 className="font-bold text-xl">Gather Family Information</h3>
                <p className="text-gray-700">Contact relatives to collect names, birth dates, and relationship information.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
              <div>
                <h3 className="font-bold text-xl">Choose a Family Tree Style</h3>
                <p className="text-gray-700">Select from ancestor charts, descendant charts, or hourglass charts.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
              <div>
                <h3 className="font-bold text-xl">Create Your Chart Using Our Tool</h3>
                <p className="text-gray-700">Use our online tool to organize information and generate a visual family tree.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">4</div>
              <div>
                <h3 className="font-bold text-xl">Export and Share</h3>
                <p className="text-gray-700">Save your family tree as PDF or image format for easy sharing.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/generator">
              <Button size="lg">Start Creating Your Family Tree</Button>
            </Link>
          </div>
        </section>
        
        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-2">What information do I need to create a family tree?</h3>
              <p className="text-gray-700">To create a basic family tree, you'll need names, birth dates, marriage dates, and death dates of family members. Additional information like places of birth, photos, and stories can enhance your family tree.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-2">How many generations should I include in my family tree?</h3>
              <p className="text-gray-700">Most family trees include 3-4 generations, but you can create more extensive trees going back 5-10 generations depending on available information and your research goals.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-2">Can I add photos to my family tree?</h3>
              <p className="text-gray-700">Yes, adding photos personalizes your family tree and brings it to life. Our tool allows you to add photos to individual family members.</p>
            </div>
          </div>
        </section>
      </div>
      
      {/* Structured Data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Make a Family Tree",
        "description": "Complete guide to creating a family tree with step-by-step instructions and free tools",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Gather Family Information",
            "text": "Contact relatives to collect names, birth dates, and relationship information"
          },
          {
            "@type": "HowToStep",
            "name": "Choose a Family Tree Style",
            "text": "Select an appropriate family tree type: ancestor chart, descendant chart, or hourglass chart"
          },
          {
            "@type": "HowToStep",
            "name": "Create Your Chart Using Our Tool",
            "text": "Use our online tool to organize information and generate a visual family tree"
          },
          {
            "@type": "HowToStep",
            "name": "Export and Share",
            "text": "Save your family tree as PDF or image format for easy sharing with family members"
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
          }
        ]
      })}}></script>
    </PageLayout>
  );
};

export default HomePage;
