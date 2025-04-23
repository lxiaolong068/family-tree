import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Make a Family Tree: Step-by-Step Guide & Tips | Family Tree Maker",
  description: "Learn how to make a family tree with our comprehensive guide. Includes detailed steps, tips for gathering family information, and best practices for creating beautiful family trees.",
  keywords: "how to make a family tree, family tree tutorial, family tree guide, genealogy guide, ancestry chart how-to",
};

export default function HowToMakeFamilyTreePage() {
  return (
    <PageLayout
      title="How to Make a Family Tree: Complete Guide"
      description="Follow our comprehensive step-by-step guide to create your own beautiful family tree"
    >
      <article className="prose prose-lg max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">How to Make a Family Tree: The Complete Guide</h1>
        
        <div className="mb-8">
          <p className="text-xl leading-relaxed">
            Creating a family tree is a rewarding way to preserve your family history and better understand your roots. 
            Whether you're doing it for a school project, genealogy research, or simply to share with future generations, 
            this comprehensive guide will walk you through the entire process.
          </p>
        </div>
        
        <div className="my-12">
          <h2 className="text-3xl font-bold mb-4" id="what-is-family-tree">What is a Family Tree?</h2>
          <p>
            A family tree is a visual representation of your family's genealogy, showing relationships between individuals 
            across multiple generations. Family trees can take various forms, including:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li><strong>Ancestor Chart</strong> - Shows your direct ancestors (parents, grandparents, etc.)</li>
            <li><strong>Descendant Chart</strong> - Shows all descendants from a single ancestor</li>
            <li><strong>Hourglass Chart</strong> - Combines both ancestors and descendants</li>
            <li><strong>Fan Chart</strong> - Displays ancestors in a semi-circular fan pattern</li>
          </ul>
        </div>
        
        <div className="my-12">
          <h2 className="text-3xl font-bold mb-4" id="getting-started">Getting Started: Materials You'll Need</h2>
          <p>Before you begin creating your family tree, gather these essential items:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Family information (names, birth dates, death dates, marriage dates)</li>
            <li>Family photos (optional but adds a personal touch)</li>
            <li>Access to our online family tree maker tool</li>
            <li>Time to research and organize your information</li>
          </ul>
          <p>
            If you're creating a physical family tree, you might also need poster board, markers, 
            and printing supplies. For digital trees, our online tool provides everything you need.
          </p>
        </div>
        
        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6" id="step-by-step">How to Create Your Family Tree: Step-by-Step Guide</h2>
          
          <div className="my-8">
            <h3 className="text-2xl font-semibold mb-3" id="step1">Step 1: Gather Family Information</h3>
            <p>
              The first step in creating your family tree is collecting information about your family members. 
              Here's what you should try to gather for each person:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Full name (including maiden names for women)</li>
              <li>Birth date and location</li>
              <li>Marriage date and location (if applicable)</li>
              <li>Death date and location (if applicable)</li>
              <li>Relationships to other family members</li>
            </ul>
            <p className="mt-4">
              <strong>Research Tips:</strong> Start by interviewing older family members who often have valuable 
              information. Don't forget to check family documents like birth certificates, marriage licenses, 
              and family Bibles. Online resources like census records and genealogy websites can also be helpful.
            </p>
          </div>
          
          <div className="my-8">
            <h3 className="text-2xl font-semibold mb-3" id="step2">Step 2: Choose a Family Tree Format</h3>
            <p>
              Decide which type of family tree will best represent your family history:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li><strong>Ancestor Chart:</strong> Best for tracing your direct lineage backwards</li>
              <li><strong>Descendant Chart:</strong> Ideal for showing all descendants from a single ancestor</li>
              <li><strong>Hourglass Chart:</strong> Perfect for showing both your ancestors and descendants</li>
              <li><strong>Fan Chart:</strong> Great for compact visualization of many generations</li>
            </ul>
            <p className="mt-4">
              Consider how many generations you want to include and who will be the central person or people in your tree.
            </p>
          </div>
          
          <div className="my-8">
            <h3 className="text-2xl font-semibold mb-3" id="step3">Step 3: Organize Your Information</h3>
            <p>
              Before creating your visual family tree, organize all the information you've collected:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Sort individuals by generation</li>
              <li>Establish clear relationships between family members</li>
              <li>Identify any missing information you might need to research further</li>
              <li>Decide on a consistent format for dates and locations</li>
            </ul>
            <p className="mt-4">
              Creating a rough draft or outline can help you visualize the structure before finalizing your family tree.
            </p>
          </div>
          
          <div className="my-8">
            <h3 className="text-2xl font-semibold mb-3" id="step4">Step 4: Create Your Family Tree</h3>
            <p>
              Now it's time to create your family tree using our online tool:
            </p>
            <ol className="list-decimal pl-6 my-4">
              <li>Visit our <Link href="/generator" className="text-blue-600 hover:underline">family tree generator</Link></li>
              <li>Select your preferred tree template or style</li>
              <li>Enter information for each family member</li>
              <li>Establish relationships between individuals</li>
              <li>Customize your tree with colors, photos, and design elements</li>
              <li>Preview your tree and make any necessary adjustments</li>
            </ol>
            <div className="my-6 text-center">
              <Link href="/generator">
                <Button size="lg">Try Our Family Tree Maker</Button>
              </Link>
            </div>
          </div>
          
          <div className="my-8">
            <h3 className="text-2xl font-semibold mb-3" id="step5">Step 5: Save and Share Your Family Tree</h3>
            <p>
              Once you're satisfied with your family tree, it's time to save and share it:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Save your tree to your account for future editing</li>
              <li>Export as a PDF for printing</li>
              <li>Download as an image to share digitally</li>
              <li>Share directly with family members through email or social media</li>
            </ul>
            <p className="mt-4">
              Consider printing a high-quality version for framing or for family reunions.
            </p>
          </div>
        </section>
        
        <section className="my-12">
          <h2 className="text-3xl font-bold mb-4" id="tips">Tips for Creating an Effective Family Tree</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-2">Be Consistent</h3>
              <p>Use the same format for dates, locations, and names throughout your family tree.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-2">Include Key Information</h3>
              <p>At minimum, include names, birth dates, and relationship connections.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-2">Consider Privacy</h3>
              <p>Be mindful of including sensitive information about living relatives.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-2">Verify Information</h3>
              <p>Cross-check dates and names with multiple sources when possible.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-2">Include Photos</h3>
              <p>Adding photographs brings your family tree to life and helps connect generations.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-2">Document Your Sources</h3>
              <p>Keep track of where you found information for future reference and verification.</p>
            </div>
          </div>
        </section>
        
        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6" id="faq">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-2">How far back should I go with my family tree?</h3>
              <p>This depends on your goals and available information. For most personal family trees, 3-5 generations is common, but dedicated genealogists might trace back 10 generations or more.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-2">How do I handle adopted family members in my tree?</h3>
              <p>You can include both biological and adoptive relationships in your family tree. Many tree formats allow for indicating adoptions with special notation or different connection lines.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-2">What if I'm missing information about certain relatives?</h3>
              <p>It's common to have gaps in your family tree. You can either leave placeholders for missing information or use estimates (with clear notation that they're estimated).</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-2">How do I research ancestors from other countries?</h3>
              <p>Look for immigration records, ship passenger lists, and naturalization documents. Also consider connecting with genealogical societies in the relevant countries and exploring international archives.</p>
            </div>
          </div>
        </section>
        
        <section className="my-12">
          <h2 className="text-3xl font-bold mb-4" id="conclusion">Start Creating Your Family Tree Today</h2>
          <p>
            Creating a family tree is a meaningful way to preserve your family's legacy and better understand your roots. 
            With our easy-to-use online tool, you can create a beautiful, detailed family tree in just minutes.
          </p>
          <p className="mt-4">
            Ready to get started? Our family tree maker provides all the tools you need to create, save, and share your 
            family history with loved ones.
          </p>
          
          <div className="mt-8 flex justify-center">
            <Link href="/generator">
              <Button size="lg" className="mr-4">Create Your Family Tree Now</Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="lg">Browse Templates</Button>
            </Link>
          </div>
        </section>
        
        {/* Breadcrumbs Navigation */}
        <nav className="text-sm text-gray-500 mt-12" aria-label="Breadcrumb">
          <ol className="flex">
            <li>
              <Link href="/" className="hover:text-gray-700">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="font-medium">How to Make a Family Tree</li>
          </ol>
        </nav>
      </article>
      
      {/* Structured Data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Make a Family Tree",
        "description": "Complete guide to creating a family tree with step-by-step instructions",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Gather Family Information",
            "text": "Collect names, dates, and relationships of family members",
            "url": "https://www.family-tree.cc/how-to-make-a-family-tree#step1"
          },
          {
            "@type": "HowToStep",
            "name": "Choose a Family Tree Format",
            "text": "Decide on ancestor chart, descendant chart, or another format",
            "url": "https://www.family-tree.cc/how-to-make-a-family-tree#step2"
          },
          {
            "@type": "HowToStep",
            "name": "Organize Your Information",
            "text": "Sort by generation and establish relationships",
            "url": "https://www.family-tree.cc/how-to-make-a-family-tree#step3"
          },
          {
            "@type": "HowToStep",
            "name": "Create Your Family Tree",
            "text": "Use our online tool to build your visual family tree",
            "url": "https://www.family-tree.cc/how-to-make-a-family-tree#step4"
          },
          {
            "@type": "HowToStep",
            "name": "Save and Share",
            "text": "Export, print, or digitally share your family tree",
            "url": "https://www.family-tree.cc/how-to-make-a-family-tree#step5"
          }
        ],
        "tool": [
          {
            "@type": "HowToTool",
            "name": "Online Family Tree Maker"
          },
          {
            "@type": "HowToTool",
            "name": "Family Records"
          }
        ]
      })}}></script>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How far back should I go with my family tree?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "This depends on your goals and available information. For most personal family trees, 3-5 generations is common, but dedicated genealogists might trace back 10 generations or more."
            }
          },
          {
            "@type": "Question",
            "name": "How do I handle adopted family members in my tree?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can include both biological and adoptive relationships in your family tree. Many tree formats allow for indicating adoptions with special notation or different connection lines."
            }
          },
          {
            "@type": "Question",
            "name": "What if I'm missing information about certain relatives?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It's common to have gaps in your family tree. You can either leave placeholders for missing information or use estimates (with clear notation that they're estimated)."
            }
          },
          {
            "@type": "Question",
            "name": "How do I research ancestors from other countries?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Look for immigration records, ship passenger lists, and naturalization documents. Also consider connecting with genealogical societies in the relevant countries and exploring international archives."
            }
          }
        ]
      })}}></script>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.family-tree.cc/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "How to Make a Family Tree",
            "item": "https://www.family-tree.cc/how-to-make-a-family-tree"
          }
        ]
      })}}></script>
    </PageLayout>
  );
}
