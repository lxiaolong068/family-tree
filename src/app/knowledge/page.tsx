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
      answer: "Typically includes: preface, legend, genealogical chart, main content (member information), family rules, biographies, and literary works."
    },
    {
      question: "How to find family member information?",
      answer: "You can ask elders, check old items (letters, photos), household registration archives, local chronicles, libraries, online resources, etc."
    },
    {
      question: "What are the ways to preserve a family tree?",
      answer: "Paper printing, electronic documents (Word, PDF), specialized family tree software, online family tree platforms, etc. Pay attention to moisture, fire, and insect prevention."
    }
  ];

  // Steps for creating a family tree
  const steps = [
    "Collect family member information",
    "Determine the format and content of the family tree",
    "Write the family tree",
    "Proofread and improve the family tree",
    "Print and preserve the family tree"
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
                  "name": `Step ${index + 1}`,
                  "text": step
                }))
              }
            ]
          })
        }}
      />

      <h2 className="text-2xl font-bold mb-2">How to Create a Family Tree</h2>
      <ol className="list-decimal list-inside text-gray-700 mb-4">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions (FAQ)</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqData.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageLayout>
  );
};

export default KnowledgePage;