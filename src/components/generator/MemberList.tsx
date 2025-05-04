"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Member, RelationType, Relationship } from '@/types/family-tree';
import { Plus, UserPlus } from 'lucide-react';
import RelationshipSelector from './RelationshipSelector';
import RelationshipList from './RelationshipList';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Family Member List</CardTitle>
        <CardDescription>
          View and manage family members. Click on a member to see and edit their relationships.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <Collapsible
              key={member.id}
              open={expandedMemberId === member.id}
              onOpenChange={() => toggleExpanded(member.id)}
              className="border rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.relation}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Gender: </span>
                      {member.gender === 'male' ? 'Male' : member.gender === 'female' ? 'Female' : 'Other'}
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Birth: </span>
                      {member.birthDate || '-'}
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Relationships: </span>
                      {member.relationships?.length || 0}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddRelationshipClick(member);
                      }}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Relation
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMember(member.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 border-t bg-gray-50">
                  <h4 className="text-sm font-medium mb-2">Relationships</h4>
                  <RelationshipList
                    member={member}
                    allMembers={members}
                    onRemoveRelationship={handleRemoveRelationship}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAddRelationshipClick(member)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Relationship
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        <div className="mt-4 text-right">
          <Button variant="destructive" onClick={onClearFamilyTree}>Clear Family Tree</Button>
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
