"use client";

import React, { useState } from 'react';
import { Member, RelationType, Relationship } from '@/types/family-tree';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RelationshipSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  availableMembers: Member[];
  onAddRelationship: (memberId: string, relationship: Relationship) => void;
}

const RelationshipSelector: React.FC<RelationshipSelectorProps> = ({
  isOpen,
  onClose,
  member,
  availableMembers,
  onAddRelationship
}) => {
  // 关系状态
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [relationType, setRelationType] = useState<RelationType>(RelationType.CHILD);
  const [description, setDescription] = useState<string>('');

  // 过滤掉当前成员和已有关系的成员
  const filteredMembers = availableMembers.filter(m => {
    // 排除自己
    if (m.id === member.id) return false;
    
    // 如果没有关系数组，则可以添加
    if (!member.relationships) return true;
    
    // 检查是否已经有相同类型的关系
    const hasRelation = member.relationships.some(
      r => r.targetId === m.id && r.type === relationType
    );
    
    return !hasRelation;
  });

  // 处理提交
  const handleSubmit = () => {
    if (selectedMemberId) {
      const relationship: Relationship = {
        type: relationType,
        targetId: selectedMemberId,
        description: description || undefined
      };
      
      onAddRelationship(member.id, relationship);
      resetForm();
      onClose();
    }
  };

  // 重置表单
  const resetForm = () => {
    setSelectedMemberId('');
    setRelationType(RelationType.CHILD);
    setDescription('');
  };

  // 关系类型选项
  const relationTypeOptions = [
    { value: RelationType.PARENT, label: 'Parent' },
    { value: RelationType.CHILD, label: 'Child' },
    { value: RelationType.SPOUSE, label: 'Spouse' },
    { value: RelationType.SIBLING, label: 'Sibling' },
    { value: RelationType.OTHER, label: 'Other' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Relationship for {member.name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {filteredMembers.length === 0 ? (
            <div className="text-center text-gray-500">
              No available members to create a relationship with.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="member" className="text-right">
                  Member
                </Label>
                <Select
                  value={selectedMemberId}
                  onValueChange={setSelectedMemberId}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMembers.map(m => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name} ({m.relation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="relationType" className="text-right">
                  Relationship
                </Label>
                <Select
                  value={relationType}
                  onValueChange={(value) => setRelationType(value as RelationType)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select relationship type" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Optional description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedMemberId || filteredMembers.length === 0}
          >
            Add Relationship
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RelationshipSelector;
