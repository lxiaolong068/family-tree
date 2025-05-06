"use client";

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Member } from '@/types/family-tree';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, GripVertical, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableMemberProps {
  member: Member;
  isRoot?: boolean;
  isActive?: boolean;
  isOver?: boolean;
  onAddChild?: (parentId: string) => void;
  onRemoveParent?: (memberId: string) => void;
  onDelete?: (memberId: string) => void;
}

const DraggableMember: React.FC<DraggableMemberProps> = ({
  member,
  isRoot = false,
  isActive = false,
  isOver = false,
  onAddChild,
  onRemoveParent,
  onDelete
}) => {
  // 使用dnd-kit的useDraggable hook
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: member.id,
    data: {
      member
    }
  });

  // 计算拖拽时的样式
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isActive ? 10 : 1,
  } : undefined;

  // 根据性别选择不同的样式
  const genderStyles = {
    male: {
      border: 'border-blue-400',
      bg: 'bg-blue-50',
      icon: 'text-blue-500',
      shadow: 'shadow-blue-200'
    },
    female: {
      border: 'border-pink-400',
      bg: 'bg-pink-50',
      icon: 'text-pink-500',
      shadow: 'shadow-pink-200'
    },
    other: {
      border: 'border-green-400',
      bg: 'bg-green-50',
      icon: 'text-green-500',
      shadow: 'shadow-green-200'
    }
  };

  const genderStyle = genderStyles[member.gender || 'other'];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative cursor-grab active:cursor-grabbing transition-all duration-200",
        isActive && "opacity-75 scale-105",
        isOver && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <Card className={cn(
        "w-48 border-2 transition-all duration-200",
        genderStyle.border,
        genderStyle.bg,
        isRoot && "border-amber-500 border-dashed",
        isActive && `shadow-lg ${genderStyle.shadow}`,
        isOver && "scale-105"
      )}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div
              className={cn(
                "cursor-grab p-1 rounded-md transition-colors",
                "hover:bg-white/80 active:cursor-grabbing"
              )}
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-gray-500" />
            </div>

            <div className="flex space-x-1">
              {!isRoot && member.parentId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-red-50 hover:text-red-500 transition-colors"
                  onClick={() => onRemoveParent?.(member.id)}
                  title="Remove Parent Relation"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-red-50 hover:text-red-600 transition-colors"
                onClick={() => onDelete?.(member.id)}
                title="Delete Member"
              >
                <X className="h-3 w-3 text-red-500" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <UserCircle className={cn(
              "h-8 w-8",
              genderStyle.icon
            )} />
            <div>
              <div className="font-medium text-sm">{member.name}</div>
              <div className="text-xs text-gray-500">{member.relation}</div>
            </div>
          </div>

          {member.birthDate && (
            <div className="text-xs text-gray-500 mt-1 bg-white/50 p-1 rounded">
              Birth: {member.birthDate}
              {member.deathDate && <span> | Death: {member.deathDate}</span>}
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full mt-2 text-xs h-7 border border-dashed",
              "hover:bg-white/80 transition-colors",
              "border-gray-300 hover:border-primary"
            )}
            onClick={() => onAddChild?.(member.id)}
          >
            <PlusCircle className="h-3 w-3 mr-1" />
            Add Child
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraggableMember;
