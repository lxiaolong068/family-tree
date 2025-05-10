"use client";

import React, { useState } from 'react';
import { Member, RelationType, Relationship } from '@/types/family-tree';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, X, Check, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export interface BatchRelationshipSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  availableMembers: Member[];
  onAddRelationships: (memberId: string, relationships: Relationship[]) => void;
}

const BatchRelationshipSelector: React.FC<BatchRelationshipSelectorProps> = ({
  isOpen,
  onClose,
  member,
  availableMembers,
  onAddRelationships
}) => {
  // 关系类型
  const [relationType, setRelationType] = useState<RelationType>(RelationType.CHILD);
  const [description, setDescription] = useState<string>('');
  
  // 选中的成员ID列表
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // 过滤掉当前成员和已有相同类型关系的成员
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

  // 处理成员选择
  const handleMemberToggle = (memberId: string) => {
    setSelectedMemberIds(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // 处理提交
  const handleSubmit = () => {
    if (selectedMemberIds.length > 0) {
      const relationships: Relationship[] = selectedMemberIds.map(targetId => ({
        type: relationType,
        targetId,
        description: description || undefined
      }));
      
      onAddRelationships(member.id, relationships);
      resetForm();
      onClose();
    }
  };

  // 重置表单
  const resetForm = () => {
    setSelectedMemberIds([]);
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Batch Add Relationships for {member.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {filteredMembers.length === 0 ? (
            <div className="text-center text-gray-500">
              No available members to create relationships with.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="relationType" className="text-right">
                  Relationship
                </Label>
                <Select
                  value={relationType}
                  onValueChange={(value) => {
                    setRelationType(value as RelationType);
                    setSelectedMemberIds([]);
                  }}
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
                  placeholder="Optional description for all relationships"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  Members
                </Label>
                <div className="col-span-3">
                  <div className="mb-2 flex flex-wrap gap-1">
                    {selectedMemberIds.length > 0 ? (
                      selectedMemberIds.map(id => {
                        const selectedMember = availableMembers.find(m => m.id === id);
                        return (
                          <Badge key={id} variant="secondary" className="gap-1">
                            {selectedMember?.name}
                            <button 
                              type="button" 
                              onClick={() => handleMemberToggle(id)}
                              className="ml-1 rounded-full hover:bg-muted p-0.5"
                              data-testid={`remove-selected-${id}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })
                    ) : (
                      <div className="text-sm text-muted-foreground">No members selected</div>
                    )}
                  </div>
                  <ScrollArea className="h-[200px] rounded-md border p-2">
                    <div className="space-y-2">
                      {filteredMembers.map(m => (
                        <div key={m.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`member-${m.id}`} 
                            checked={selectedMemberIds.includes(m.id)}
                            onCheckedChange={() => handleMemberToggle(m.id)}
                          />
                          <Label 
                            htmlFor={`member-${m.id}`}
                            className="flex-1 cursor-pointer text-sm py-1"
                          >
                            {m.name} ({m.relation})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
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
            disabled={selectedMemberIds.length === 0 || filteredMembers.length === 0}
            className="gap-1"
          >
            <Check className="h-4 w-4" />
            Add {selectedMemberIds.length} Relationship{selectedMemberIds.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchRelationshipSelector;
