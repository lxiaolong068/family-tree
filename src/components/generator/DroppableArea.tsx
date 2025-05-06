"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface DroppableAreaProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

const DroppableArea: React.FC<DroppableAreaProps> = ({
  id,
  children,
  className
}) => {
  // 使用dnd-kit的useDroppable hook
  const { isOver, setNodeRef } = useDroppable({
    id
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "transition-all duration-300 relative",
        isOver && "bg-primary/10 rounded-lg scale-105 shadow-md",
        className
      )}
    >
      {isOver && (
        <div className="absolute inset-0 border-2 border-dashed border-primary rounded-lg animate-pulse pointer-events-none" />
      )}
      {children}
    </div>
  );
};

export default DroppableArea;
