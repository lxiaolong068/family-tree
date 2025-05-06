import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "How to Make a Family Tree: A Comprehensive Guide (2024) | Family Tree CC",
  description: "Your complete step-by-step guide to making a family tree. Learn to gather info, choose formats, use our free tools, and share your ancestry. Updated for 2024 by Family Tree CC.",
  keywords: ["how to make a family tree", "family tree tutorial", "family tree guide", "genealogy guide", "ancestry chart how-to", "family tree 2024 guide", "Family Tree CC"],
  openGraph: {
    title: "How to Make a Family Tree: A Comprehensive Guide (2024) | Family Tree CC",
    description: "Your complete step-by-step guide to making a family tree. Learn to gather info, choose formats, use our free tools, and share your ancestry. Updated for 2024 by Family Tree CC.",
    url: "https://www.family-tree.cc/how-to-make-a-family-tree/",
    siteName: "Family Tree CC",
    images: [
      {
        url: "https://www.family-tree.cc/og-how-to-make-family-tree.jpg",
        width: 1200,
        height: 630,
        alt: "Guide to Making a Family Tree - Family Tree CC",
      },
    ],
    locale: "en_US",
    type: "article",
    publishedTime: "2024-01-01T00:00:00Z",
    modifiedTime: new Date().toISOString(),
    authors: ["Family Tree CC Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Make a Family Tree: A Comprehensive Guide (2024) | Family Tree CC",
    description: "Your complete step-by-step guide to making a family tree. Updated for 2024 by Family Tree CC.",
  },
  alternates: {
    canonical: "https://www.family-tree.cc/how-to-make-a-family-tree/",
  },
};

const BreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://www.family-tree.cc/"
  },{
    "@type": "ListItem",
    "position": 2,
    "name": "How to Make a Family Tree",
    "item": "https://www.family-tree.cc/how-to-make-a-family-tree/"
  }]
};

export default function HowToMakeFamilyTreePage() {
  // FAQ数据
  const faqData = [
    {
      question: "How far back should I go with my family tree?",
      answer: "This depends on your goals and available information. For most personal family trees, 3-5 generations is common, but dedicated genealogists might trace back 10 generations or more."
    },
    {
      question: "How do I handle adopted family members in my tree?",
      answer: "You can include both biological and adoptive relationships in your family tree. Many tree formats allow for indicating adoptions with special notation or different connection lines."
    },
    {
      question: "What if I'm missing information about certain relatives?",
      answer: "It's common to have gaps in your family tree. You can either leave placeholders for missing information or use estimates (with clear notation that they're estimated)."
    },
    {
      question: "How do I research ancestors from other countries?",
      answer: "Look for immigration records, ship passenger lists, and naturalization documents. Also consider connecting with genealogical societies in the relevant countries and exploring international archives."
    },
    {
      question: "Can I include multiple marriages in my family tree?",
      answer: "Yes, most family tree formats allow for including multiple marriages. You can show these as separate branches or with special connectors depending on the format you choose."
    },
    {
      question: "How do I verify family information?",
      answer: "Cross-check information from multiple sources when possible. Official records like birth certificates, census data, and marriage licenses are most reliable. Family stories should be verified with documentation when available."
    }
  ];

  // 家谱类型数据
  const treeTypes = [
    {
      title: "Ancestor Chart (Pedigree Chart)",
      description: "Shows an individual's direct ancestors (parents, grandparents, etc.). It typically branches outwards from the individual at the bottom or left.",
      image: "/images/knowledge/ancestry-tree-7933639-1280.png"
    },
    {
      title: "Descendant Chart",
      description: "Displays all descendants from a single ancestor. This format is ideal for showing how a family has grown over generations.",
      image: "/images/knowledge/family-9294369-1280.png"
    },
    {
      title: "Fan Chart",
      description: "A circular or semi-circular chart that displays ancestors, often used to visualize many generations compactly.",
      image: "/images/knowledge/family-tree-8249245-1280.png"
    },
    {
      title: "Hourglass Chart",
      description: "Combines both ancestors and descendants, with the focus person in the middle. Shows both where you came from and where your family is going.",
      image: "/images/knowledge/family-tree-295298-1280.png"
    }
  ];

  // 创建家谱的步骤
  const steps = [
    {
      title: "Gather Family Information",
      details: "Collect names, dates, locations, and relationships. Interview relatives and check family documents."
    },
    {
      title: "Choose a Family Tree Format",
      details: "Select the type of tree that best represents your family history and meets your goals."
    },
    {
      title: "Organize Your Information",
      details: "Sort by generation, establish relationships, and identify any gaps in your research."
    },
    {
      title: "Create Your Family Tree",
      details: "Use our online tool to build your visual family tree with all the collected information."
    },
    {
      title: "Save and Share",
      details: "Export your tree, print it, or share it digitally with family members."
    }
  ];

  return (
    <PageLayout
      title="How to Make a Family Tree: Complete Guide"
      description="Follow our comprehensive step-by-step guide to create your own beautiful family tree"
    >
      {/* Structured Data for SEO */}
      <Script
        id="structured-data-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema) }}
      />
      <Script
        id="schema-how-to"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Make a Family Tree",
            "description": "Complete guide to creating a family tree with step-by-step instructions",
            "step": steps.map((step, index) => ({
              "@type": "HowToStep",
              "name": step.title,
              "text": step.details,
              "url": `https://www.family-tree.cc/how-to-make-a-family-tree#step${index + 1}`
            })),
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
          })
        }}
      />

      <article className="max-w-4xl mx-auto">
        {/* Introduction */}
        <div className="mb-8 p-6 bg-blue-50 dark:bg-gray-800 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">How to Make a Family Tree: The Complete Guide</h1>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Creating a family tree is a rewarding way to preserve your family history and better understand your roots.
                Whether you're doing it for a school project, genealogy research, or simply to share with future generations,
                this comprehensive guide will walk you through the entire process.
              </p>
              <div className="flex gap-2 mt-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-semibold">Genealogy</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-semibold">Family History</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-semibold">Tutorial</span>
              </div>
            </div>
            <div className="flex-shrink-0 w-full md:w-1/3 relative">
              <div className="aspect-square relative overflow-hidden rounded-lg shadow-md">
                <Image
                  src="/images/knowledge/frame-3554310-1280.jpg"
                  alt="Family Tree Creation"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="my-12">
          <h2 className="text-2xl font-bold mb-4" id="what-is-family-tree">What is a Family Tree?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            A family tree is a visual representation of your family's genealogy, showing relationships between individuals
            across multiple generations. Family trees can take various forms, each with its own advantages.
          </p>

          <h3 className="text-xl font-semibold mb-4">Types and Styles of Family Trees</h3>
          <div className="space-y-8">
            {treeTypes.map((type, index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">{type.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {type.description}
                  </p>
                </div>
                <div className="p-0">
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={type.image}
                      alt={`${type.title} Example`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="my-12">
          <h2 className="text-2xl font-bold mb-4" id="getting-started">Getting Started: Materials You'll Need</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Before you begin creating your family tree, gather these essential items:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Family Information</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Names, birth dates, death dates, marriage dates, and locations</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Family Photos</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Optional but adds a personal touch to your family tree</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Online Tool Access</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Access to our <Link href="/generator" className="text-blue-600 hover:underline">family tree maker tool</Link> for easy creation</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Time</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Time to research and organize your family information</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border-l-4 border-yellow-400 dark:border-yellow-600">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> If you're creating a physical family tree, you might also need poster board, markers,
                and printing supplies. For digital trees, our online tool provides everything you need.
              </p>
            </div>
          </div>
        </div>

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-6" id="step-by-step">How to Create Your Family Tree: Step-by-Step Guide</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Follow these steps to create a comprehensive family tree that preserves your heritage
            </p>
            <ol className="space-y-6">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-4" id={`step${index + 1}`}>
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{step.details}</p>

                    {index === 0 && (
                      <div className="mt-4 bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">What to gather for each person:</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Full name (including maiden names)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Birth date and location</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Marriage date and location</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Death date and location</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Relationships to other members</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Photos (if available)</span>
                          </li>
                        </ul>
                        <div className="mt-3 text-sm text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/40 p-3 rounded border-l-2 border-blue-500">
                          <strong>Research Tip:</strong> Start by interviewing older family members who often have valuable
                          information. Check family documents like birth certificates, marriage licenses, and family Bibles.
                        </div>
                      </div>
                    )}

                    {index === 1 && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {treeTypes.slice(0, 2).map((type, i) => (
                          <div key={i} className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg text-sm">
                            <div className="font-medium text-gray-900 dark:text-white">{type.title}</div>
                            <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">{type.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {index === 1 && (
                      <div className="mt-2">
                        <Link href="/templates" className="text-blue-600 hover:underline">
                          Explore different family tree templates to find one that suits your needs.
                        </Link>
                      </div>
                    )}

                    {index === 3 && (
                      <div className="mt-6 text-center">
                        <Link href="/generator">
                          <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">Try Our Family Tree Maker</Button>
                        </Link>
                      </div>
                    )}

                    {index === 4 && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-gray-700 px-3 py-2 rounded-full text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          <span>Save to account</span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-gray-700 px-3 py-2 rounded-full text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Export as PDF</span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-gray-700 px-3 py-2 rounded-full text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Download as image</span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-gray-700 px-3 py-2 rounded-full text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          <span>Share with family</span>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4" id="tips">Tips for Creating an Effective Family Tree</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Be Consistent</h3>
                  <p className="text-gray-600 dark:text-gray-300">Use the same format for dates, locations, and names throughout your family tree for better readability and organization.</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Include Key Information</h3>
                  <p className="text-gray-600 dark:text-gray-300">At minimum, include names, birth dates, and relationship connections to create a meaningful family record.</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Consider Privacy</h3>
                  <p className="text-gray-600 dark:text-gray-300">Be mindful of including sensitive information about living relatives, especially when sharing your tree publicly.</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Verify Information</h3>
                  <p className="text-gray-600 dark:text-gray-300">Cross-check dates and names with multiple sources when possible to ensure accuracy in your family history.</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Include Photos</h3>
                  <p className="text-gray-600 dark:text-gray-300">Adding photographs brings your family tree to life and helps connect generations in a more personal way.</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Document Your Sources</h3>
                  <p className="text-gray-600 dark:text-gray-300">Keep track of where you found information for future reference, verification, and to help others continue your research.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4" id="faq">Frequently Asked Questions</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`} className="border-b border-gray-200 dark:border-gray-700">
                  <AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-3 rounded-md text-left">
                    <span className="font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-1">
                    <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Have more questions?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Check out our <Link href="/knowledge" className="text-blue-600 hover:underline">Knowledge Base</Link> for more detailed information about family trees and genealogy research.
              </p>
            </div>
          </div>
        </section>

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4" id="conclusion">Start Creating Your Family Tree Today</h2>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Ready to Create Your Family Tree?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Creating a family tree is a meaningful way to preserve your family's legacy and better understand your roots.
                  With our easy-to-use online tool, you can create a beautiful, detailed family tree in just minutes.
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  Our family tree maker provides all the tools you need to create, save, and share your
                  family history with loved ones.
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/generator">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                    Start Creating
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button variant="outline" size="lg" className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </div>
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

      {/* FAQ Schema */}
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      {/* Breadcrumb Schema */}
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          })
        }}
      />
    </PageLayout>
  );
}
