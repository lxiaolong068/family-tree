"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Member, RelationType, Relationship } from '@/types/family-tree';
import { Plus, UserPlus, Trash2, ChevronDown, ChevronRight, Users, Calendar, User } from 'lucide-react';
import RelationshipSelector from './RelationshipSelector';
import RelationshipList from './RelationshipList';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from '@/lib/utils';

interface MemberListProps {
  members: Member[];
  onDeleteMember: (id: string) => void;
  onClearFamilyTree: () => void;
  onAddRelationship?: (memberId: string, relationship: Relationship) => void;
  onRemoveRelationship?: (memberId: string, targetId: string, relationType: RelationType) => void;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  onDeleteMember,
  onClearFamilyTree,
  onAddRelationship,
  onRemoveRelationship
}) => {
  // 关系选择器状态
  const [relationshipSelectorOpen, setRelationshipSelectorOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // 展开状态
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);

  if (members.length === 0) {
    return null;
  }

  // 处理添加关系按钮点击
  const handleAddRelationshipClick = (member: Member) => {
    setSelectedMember(member);
    setRelationshipSelectorOpen(true);
  };

  // 处理添加关系
  const handleAddRelationship = (memberId: string, relationship: Relationship) => {
    if (onAddRelationship) {
      onAddRelationship(memberId, relationship);
    }
  };

  // 处理移除关系
  const handleRemoveRelationship = (memberId: string, targetId: string, relationType: RelationType) => {
    if (onRemoveRelationship) {
      onRemoveRelationship(memberId, targetId, relationType);
    }
  };

  // 切换展开状态
  const toggleExpanded = (memberId: string) => {
    if (expandedMemberId === memberId) {
      setExpandedMemberId(null);
    } else {
      setExpandedMemberId(memberId);
    }
  };

  // 获取性别图标和颜色
  const getGenderIconAndColor = (gender: string | undefined) => {
    switch (gender) {
      case 'male':
        return { icon: <User className="h-4 w-4 text-blue-500" />, color: 'bg-blue-100 text-blue-800' };
      case 'female':
        return { icon: <User className="h-4 w-4 text-pink-500" />, color: 'bg-pink-100 text-pink-800' };
      default:
        return { icon: <User className="h-4 w-4 text-green-500" />, color: 'bg-green-100 text-green-800' };
    }
  };

  return (
    <Card className="mb-8 shadow-md">
      <CardHeader className="bg-muted/50 rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="h-5 w-5 text-primary" />
          Family Member List ({members.length})
        </CardTitle>
        <CardDescription>
          View and manage family members. Click on a member to see and edit their relationships.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {members.map((member) => {
            const { icon: genderIcon, color: genderColor } = getGenderIconAndColor(member.gender);
            const hasRelationships = member.relationships && member.relationships.length > 0;

            return (
              <Collapsible
                key={member.id}
                open={expandedMemberId === member.id}
                onOpenChange={() => toggleExpanded(member.id)}
                className="overflow-hidden"
              >
                <CollapsibleTrigger asChild>
                  <div className={cn(
                    "flex items-center justify-between p-4 cursor-pointer transition-colors",
                    expandedMemberId === member.id ? "bg-muted/50" : "hover:bg-muted/30"
                  )}>
                    <div className="flex items-center gap-3">
                      {expandedMemberId === member.id ?
                        <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" /> :
                        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      }
                      <div>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          {member.name}
                          <Badge variant="outline" className={cn("text-xs py-0 px-2", genderColor)}>
                            {genderIcon}
                            <span className="ml-1">{member.gender === 'male' ? 'Male' : member.gender === 'female' ? 'Female' : 'Other'}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                          <span>{member.relation}</span>
                          {member.birthDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {member.birthDate}
                            </span>
                          )}
                          {hasRelationships && (
                            <Badge variant="secondary" className="text-xs">
                              {member.relationships?.length} relationship{member.relationships?.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-primary border-primary/30 hover:bg-primary/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddRelationshipClick(member);
                        }}
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Add Relation</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteMember(member.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-6 border-t bg-muted/20">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Relationships
                    </h4>
                    <RelationshipList
                      member={member}
                      allMembers={members}
                      onRemoveRelationship={handleRemoveRelationship}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 gap-1 border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => handleAddRelationshipClick(member)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add New Relationship
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        <div className="p-4 border-t mt-2 flex justify-end">
          <Button
            variant="outline"
            className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={onClearFamilyTree}
          >
            <Trash2 className="h-4 w-4" />
            Clear Family Tree
          </Button>
        </div>

        {/* 关系选择器对话框 */}
        {selectedMember && (
          <RelationshipSelector
            isOpen={relationshipSelectorOpen}
            onClose={() => setRelationshipSelectorOpen(false)}
            member={selectedMember}
            availableMembers={members}
            onAddRelationship={handleAddRelationship}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MemberList;
