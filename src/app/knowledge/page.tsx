import React from 'react';
import Script from 'next/script';
import { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PageLayout from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Family Tree Knowledge | Genealogy Guide & FAQs",
  description: "Learn about family trees, genealogy charts, and how to create your own family history record. Includes step-by-step guides and frequently asked questions.",
  keywords: "family tree knowledge, genealogy guide, family tree FAQ, how to create family tree",
};

const KnowledgePage = () => {
  // FAQ data for structured data
  const faqData = [
    {
      question: "What should a family tree include?",
      answer: "Typically includes: preface, legend, genealogical chart, main content (member information), family rules, biographies, and literary works. Modern family trees often focus on names, dates (birth, marriage, death), locations, and relationships, but can be expanded with photos, stories, and occupations."
    },
    {
      question: "How to find family member information?",
      answer: "Start by asking elders and relatives. Check old family items like letters, photos, and bibles. Official records such as household registration archives, birth/marriage/death certificates, census records, and local chronicles are valuable. Libraries, archives, and online genealogy resources (e.g., Ancestry, FamilySearch) can also provide significant information."
    },
    {
      question: "What are the ways to preserve a family tree?",
      answer: "Options include paper printing (use acid-free paper), electronic documents (Word, PDF, specialized genealogy software formats like GEDCOM), specialized family tree software for organization and charting, and online family tree platforms for collaboration and cloud backup. Regardless of the method, ensure proper storage to prevent damage from moisture, fire, and insects, and make multiple backups."
    },
    {
      question: "What is a family tree and how is it different from family history?",
      answer: "A family tree (or genealogical chart) visually represents family relationships, typically showing ancestors and descendants. Family history is a broader narrative that includes stories, historical context, and biographical details of family members, often using the family tree as a framework."
    },
    {
      question: "What is the significance or value of a family tree?",
      answer: "Creating a family tree helps understand one's heritage, preserve family stories for future generations, discover connections to historical events, and can sometimes provide insights into genetic health predispositions. It fosters a sense of identity and belonging."
    },
    {
      question: "Where should I start when recording my family tree?",
      answer: "Start with yourself and work backwards. Gather information about your parents, then grandparents, and so on. Collect names, dates (birth, marriage, death), and places for each individual. It's easier to verify information for recent generations."
    }
  ];

  // Steps for creating a family tree
  const steps = [
    {
      title: "Collect family member information",
      details: "Begin by interviewing older relatives, as they are often a rich source of names, dates, stories, and relationships. Gather existing documents like birth/marriage/death certificates, family bibles, letters, diaries, photographs (check for notes on the back), and any existing family trees. Note down sources for each piece of information."
    },
    {
      title: "Determine the format and content of the family tree",
      details: "Decide what information you want to include for each person (e.g., full name, birth/death dates and places, marriage dates and places, occupation, photos). Choose a charting style: an ancestor chart (direct line backwards), a descendant chart (from an ancestor downwards), or a more comprehensive chart including all relatives. You can use paper, genealogy software, or online platforms."
    },
    {
      title: "Write or draw the family tree",
      details: "Start with yourself and work backwards (for an ancestor chart) or start with a key ancestor and work forwards (for a descendant chart). Use clear, consistent formatting. Standard genealogical conventions can be helpful (e.g., symbols for birth, marriage, death). If using software, it will often handle the drawing aspect for you."
    },
    {
      title: "Proofread and verify information",
      details: "Accuracy is key. Double-check names, dates, and places against your sources. Cross-reference information from different sources. If you find discrepancies, try to resolve them or note the conflicting information. Be open to correcting mistakes as you find new evidence."
    },
    {
      title: "Share, print, and preserve the family tree",
      details: "Share your findings with family members – they might have additional information or corrections. Consider printing a physical copy on acid-free paper for longevity. Make digital backups in multiple locations (e.g., external hard drive, cloud storage). Online platforms can also serve as a way to preserve and share your work."
    }
  ];

  return (
    <PageLayout
      title="Family Tree Knowledge"
      description="A family tree, also known as a genealogical chart, is a document that records family lineage and important events of family members."
    >
      {/* Structured Data for SEO */}
      <Script
        id="schema-knowledge"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                "headline": "Family Tree Knowledge",
                "description": "A family tree, also known as a genealogical chart, is a document that records family lineage and important events of family members.",
                "image": "https://www.family-tree.cc/knowledge-image.jpg",
                "author": {
                  "@type": "Organization",
                  "name": "Family Tree Maker"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "Family Tree Maker",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.family-tree.cc/logo.png"
                  }
                },
                "datePublished": "2025-04-23",
                "dateModified": "2025-04-23",
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": "https://www.family-tree.cc/knowledge/"
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": faqData.map(item => ({
                  "@type": "Question",
                  "name": item.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                  }
                }))
              },
              {
                "@type": "HowTo",
                "name": "How to Create a Family Tree",
                "description": "Step-by-step guide to creating your own family tree",
                "step": steps.map((step, index) => ({
                  "@type": "HowToStep",
                  "position": index + 1,
                  "name": `Step ${index + 1}: ${step.title}`,
                  "text": step.details
                }))
              }
            ]
          })
        }}
      />

      {/* Introduction */}
      <div className="mb-8 p-6 bg-blue-50 dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Family trees are valuable tools for preserving your heritage and understanding your roots.
              Whether you're just starting your genealogy journey or looking to expand your knowledge,
              this guide provides essential information about family trees, their types, and how to create them.
            </p>
            <div className="flex gap-2 mt-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-semibold">Genealogy</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-xs font-semibold">Family History</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-semibold">Heritage</span>
            </div>
          </div>
        </div>
      </div>

      {/* How to Create a Family Tree */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">How to Create a Family Tree</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Follow these steps to create a comprehensive family tree that preserves your heritage
          </p>
          <ol className="space-y-6">
            {steps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">{step.details}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Types and Styles of Family Trees */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Types and Styles of Family Trees</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Family trees can be presented in various formats, each highlighting different aspects of family lineage
          </p>

          <div className="space-y-8">
            {/* Ancestor Chart */}
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Ancestor Chart (Pedigree Chart)</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Shows an individual's direct ancestors (parents, grandparents, etc.). It typically branches outwards from the individual at the bottom or left.
                </p>
              </div>
              <div className="p-0">
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src="/images/knowledge/ancestry-tree-7933639-1280.png"
                    alt="Ancestor Chart Example"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Descendant Chart */}
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Descendant Chart</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Starts with a common ancestor (or couple) and shows all their descendants. This type of chart grows downwards or outwards.
                </p>
              </div>
              <div className="p-0">
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src="/images/knowledge/family-tree-295298-1280.png"
                    alt="Descendant Chart Example"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Fan Chart */}
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Fan Chart</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A circular or semi-circular chart that displays ancestors, often used to visualize many generations compactly.
                </p>
              </div>
              <div className="p-0">
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src="/images/knowledge/family-tree-8249245-1280.png"
                    alt="Fan Chart Example"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mt-6">
            The choice of chart often depends on the research goals and the amount of information available.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
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
        </div>
      </div>

      {/* Common Genealogy Terms */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Common Genealogy Terms</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Essential terminology to understand when researching your family history
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Ancestor</h3>
              <p className="text-gray-700 dark:text-gray-300">
                A person from whom one is descended, typically further back than a grandparent (e.g., great-grandparent, great-great-grandparent).
              </p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Descendant</h3>
              <p className="text-gray-700 dark:text-gray-300">
                A person who is descended from a particular ancestor.
              </p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Lineage</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Direct descent from an ancestor; ancestry or pedigree.
              </p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Pedigree</h3>
              <p className="text-gray-700 dark:text-gray-300">
                A record of ancestry, typically presented as a chart or tree.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Ready to Create Your Family Tree?</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Use our easy-to-use tools to start documenting your family history today.
            </p>
          </div>
          <div className="flex gap-3">
            <a href="/generator" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Start Creating
            </a>
            <a href="/templates" className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors">
              Browse Templates
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default KnowledgePage;