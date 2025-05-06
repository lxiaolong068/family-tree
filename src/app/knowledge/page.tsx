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

      <h2 className="text-2xl font-bold mb-2">How to Create a Family Tree</h2>
      <ol className="list-decimal list-inside space-y-3 mb-6">
        {steps.map((step, index) => (
          <li key={index} className="text-gray-700 dark:text-gray-300">
            <strong className="font-semibold text-gray-900 dark:text-white">{step.title}</strong>
            <p className="ml-4 text-sm">{step.details}</p>
          </li>
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

      <h2 className="text-2xl font-bold mt-8 mb-2">Types and Styles of Family Trees</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Family trees can be presented in various formats, each highlighting different aspects of family lineage. Common types include:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 dark:text-gray-300">
        <li>
          <strong className="font-semibold text-gray-900 dark:text-white">Ancestor Chart (Pedigree Chart):</strong> Shows an individual's direct ancestors (parents, grandparents, etc.). It typically branches outwards from the individual at the bottom or left.
        </li>
        <li>
          <strong className="font-semibold text-gray-900 dark:text-white">Descendant Chart:</strong> Starts with a common ancestor (or couple) and shows all their descendants. This type of chart grows downwards or outwards.
        </li>
        <li>
          <strong className="font-semibold text-gray-900 dark:text-white">Family Group Sheet:</strong> Details information about one family unit (parents and children), including names, dates, and places for vital events.
        </li>
        <li>
          <strong className="font-semibold text-gray-900 dark:text-white">Fan Chart:</strong> A circular or semi-circular chart that displays ancestors, often used to visualize many generations compactly.
        </li>
        <li>
          <strong className="font-semibold text-gray-900 dark:text-white">All Relatives (or Dropline) Chart:</strong> A more comprehensive chart that attempts to show all known relatives, including aunts, uncles, cousins, etc. Can become very large and complex.
        </li>
      </ul>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        The choice of chart often depends on the research goals and the amount of information available.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-2">Common Genealogy Terms</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-term-1">
          <AccordionTrigger>Ancestor</AccordionTrigger>
          <AccordionContent>
            A person from whom one is descended, typically further back than a grandparent (e.g., great-grandparent, great-great-grandparent).
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-term-2">
          <AccordionTrigger>Descendant</AccordionTrigger>
          <AccordionContent>
            A person who is descended from a particular ancestor.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-term-3">
          <AccordionTrigger>Lineage</AccordionTrigger>
          <AccordionContent>
            Direct descent from an ancestor; ancestry or pedigree.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-term-4">
          <AccordionTrigger>Pedigree</AccordionTrigger>
          <AccordionContent>
            A record of ancestry, typically presented as a chart or tree.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-term-5">
          <AccordionTrigger>Vital Records</AccordionTrigger>
          <AccordionContent>
            Records of life events kept under governmental authority, such as birth certificates, marriage licenses, and death certificates.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-term-6">
          <AccordionTrigger>GEDCOM</AccordionTrigger>
          <AccordionContent>
            An acronym for GEnealogical Data COMmunication. It's a standard file format used for exchanging genealogical data between different genealogy software.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-term-7">
          <AccordionTrigger>Direct Line</AccordionTrigger>
          <AccordionContent>
            Ancestors from whom you directly descend (parents, grandparents, great-grandparents, etc.), without branching to siblings, aunts, uncles, or cousins.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-term-8">
          <AccordionTrigger>Collateral Line</AccordionTrigger>
          <AccordionContent>
            Family members who are not in your direct line of descent, such as siblings, aunts, uncles, cousins, nieces, and nephews.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </PageLayout>
  );
};

export default KnowledgePage;