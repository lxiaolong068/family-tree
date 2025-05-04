"use client";

import React from 'react';
import { Member, RelationType, Relationship } from '@/types/family-tree';
import { Button } from "@/components/ui/button";
import { X, UserCircle, Users, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RelationshipListProps {
  member: Member;
  allMembers: Member[];
  onRemoveRelationship: (memberId: string, targetId: string, relationType: RelationType) => void;
}

const RelationshipList: React.FC<RelationshipListProps> = ({
  member,
  allMembers,
  onRemoveRelationship
}) => {
  // 如果没有关系，显示空状态
  if (!member.relationships || member.relationships.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No relationships defined
      </div>
    );
  }

  // 获取关系目标成员
  const getTargetMember = (targetId: string): Member | undefined => {
    return allMembers.find(m => m.id === targetId);
  };

  // 获取关系类型图标
  const getRelationshipIcon = (type: RelationType) => {
    switch (type) {
      case RelationType.PARENT:
        return <User className="h-4 w-4 text-blue-500" />;
      case RelationType.CHILD:
        return <User className="h-4 w-4 text-green-500" />;
      case RelationType.SPOUSE:
        return <Heart className="h-4 w-4 text-red-500" />;
      case RelationType.SIBLING:
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <UserCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // 获取关系类型标签
  const getRelationshipLabel = (type: RelationType): string => {
    switch (type) {
      case RelationType.PARENT:
        return 'Parent';
      case RelationType.CHILD:
        return 'Child';
      case RelationType.SPOUSE:
        return 'Spouse';
      case RelationType.SIBLING:
        return 'Sibling';
      default:
        return 'Other';
    }
  };

  return (
    <div className="space-y-2">
      {member.relationships.map((relationship, index) => {
        const targetMember = getTargetMember(relationship.targetId);
        if (!targetMember) return null;

        return (
          <div 
            key={`${relationship.targetId}-${relationship.type}-${index}`}
            className="flex items-center justify-between p-2 rounded-md bg-gray-50 border border-gray-200"
          >
            <div className="flex items-center space-x-2">
              {getRelationshipIcon(relationship.type)}
              <div>
                <div className="text-sm font-medium">{targetMember.name}</div>
                <div className="text-xs text-gray-500">
                  {getRelationshipLabel(relationship.type)}
                  {relationship.description && ` (${relationship.description})`}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onRemoveRelationship(member.id, relationship.targetId, relationship.type)}
              title="Remove Relationship"
            >
              <X className="h-3 w-3 text-red-500" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default RelationshipList;
