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
  
  // 根据性别选择不同的边框颜色
  const genderBorderColor = member.gender === 'male' 
    ? 'border-blue-400' 
    : member.gender === 'female' 
      ? 'border-pink-400' 
      : 'border-gray-400';
  
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
        "w-48 border-2",
        genderBorderColor,
        isRoot && "border-green-500",
        isActive && "shadow-lg"
      )}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div 
              className="cursor-grab p-1 rounded hover:bg-gray-100" 
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
                  className="h-6 w-6" 
                  onClick={() => onRemoveParent?.(member.id)}
                  title="移除父级关系"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => onDelete?.(member.id)}
                title="删除成员"
              >
                <X className="h-3 w-3 text-red-500" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            <UserCircle className={cn(
              "h-8 w-8",
              member.gender === 'male' ? 'text-blue-500' : 
              member.gender === 'female' ? 'text-pink-500' : 'text-gray-500'
            )} />
            <div>
              <div className="font-medium text-sm">{member.name}</div>
              <div className="text-xs text-gray-500">{member.relation}</div>
            </div>
          </div>
          
          {member.birthDate && (
            <div className="text-xs text-gray-500 mt-1">
              出生: {member.birthDate}
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-2 text-xs h-7 border border-dashed border-gray-300"
            onClick={() => onAddChild?.(member.id)}
          >
            <PlusCircle className="h-3 w-3 mr-1" />
            添加子女
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraggableMember;
