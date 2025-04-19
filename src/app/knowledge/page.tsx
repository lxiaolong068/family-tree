import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const KnowledgePage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Family Tree Knowledge</h1>
      <p className="text-gray-700 mb-4">
        A family tree, also known as a genealogical chart, is a document that records family lineage and important events of family members.
      </p>
      <h2 className="text-2xl font-bold mb-2">How to Create a Family Tree</h2>
      <ol className="list-decimal list-inside text-gray-700 mb-4">
        <li>Collect family member information</li>
        <li>Determine the format and content of the family tree</li>
        <li>Write the family tree</li>
        <li>Proofread and improve the family tree</li>
        <li>Print and preserve the family tree</li>
      </ol>
      <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions (FAQ)</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What should a family tree include?</AccordionTrigger>
          <AccordionContent>
            Typically includes: preface, legend, genealogical chart, main content (member information), family rules, biographies, and literary works.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How to find family member information?</AccordionTrigger>
          <AccordionContent>
            You can ask elders, check old items (letters, photos), household registration archives, local chronicles, libraries, online resources, etc.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What are the ways to preserve a family tree?</AccordionTrigger>
          <AccordionContent>
            Paper printing, electronic documents (Word, PDF), specialized family tree software, online family tree platforms, etc. Pay attention to moisture, fire, and insect prevention.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default KnowledgePage;