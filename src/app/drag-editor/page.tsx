"use client";

import React, { Suspense } from 'react';

import DragEditorContent from '@/components/generator/DragEditorContent';

const DragEditorPage = () => {
  return (
    <Suspense fallback={<div className="container mx-auto p-4">Loading drag editor...</div>}>
      <DragEditorContent />
    </Suspense>
  );
};

export default DragEditorPage;
