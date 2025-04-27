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
        "transition-colors duration-200",
        isOver && "bg-primary/10 rounded-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

export default DroppableArea;
