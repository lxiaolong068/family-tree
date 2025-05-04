"use client";

import React from 'react';
import Script from 'next/script';
import DragEditorContent from '@/components/generator/DragEditorContent';

const DragEditorPage = () => {
  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="schema-drag-editor"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Drag & Drop Family Tree Editor",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Create and edit your family tree with our intuitive drag & drop interface. Easily establish parent-child relationships by dragging members onto each other.",
            "featureList": [
              "Drag & drop interface",
              "Visual relationship creation",
              "Intuitive family tree editing",
              "Save to database",
              "Seamless integration with form editor"
            ],
            "screenshot": "https://www.family-tree.cc/drag-editor-screenshot.jpg",
            "softwareVersion": "1.0",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "ratingCount": "124"
            }
          })
        }}
      />
      <DragEditorContent />
    </>
  );
};

export default DragEditorPage;
