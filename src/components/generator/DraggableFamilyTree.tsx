"use client";

import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { Member, FamilyTree } from '@/types/family-tree';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import DraggableMember from './DraggableMember';
import DroppableArea from './DroppableArea';
import { useDraggableFamilyTree } from '@/hooks/useDraggableFamilyTree';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DraggableFamilyTreeProps {
  familyTree: FamilyTree;
  onUpdateFamilyTree: (updatedFamilyTree: FamilyTree) => void;
}

const DraggableFamilyTree: React.FC<DraggableFamilyTreeProps> = ({
  familyTree,
  onUpdateFamilyTree
}) => {
  // 使用自定义Hook管理拖拽状态和逻辑
  const {
    activeMemberId,
    overMemberId,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    addChildMember,
    removeParentRelation
  } = useDraggableFamilyTree(familyTree, onUpdateFamilyTree);

  // 新成员对话框状态
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [newMemberParentId, setNewMemberParentId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: '',
    relation: '子女',
    gender: 'male'
  });

  // 处理拖拽开始
  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    handleDragStart(active.id as string);
  };

  // 处理拖拽结束
  const onDragEnd = (event: DragEndEvent) => {
    handleDragEnd();
  };

  // 处理拖拽悬停
  const onDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      handleDragOver(over.id as string);
    }
  };

  // 处理添加子成员
  const handleAddChild = (parentId: string) => {
    setNewMemberParentId(parentId);
    setIsAddMemberDialogOpen(true);
  };

  // 处理删除成员
  const handleDeleteMember = (memberId: string) => {
    // 过滤掉要删除的成员
    const updatedMembers = familyTree.members.filter(member => member.id !== memberId);

    // 同时移除所有以该成员为父节点的关系
    const finalMembers = updatedMembers.map(member => {
      if (member.parentId === memberId) {
        const { parentId, ...rest } = member;
        return rest;
      }
      return member;
    });

    // 更新家谱
    onUpdateFamilyTree({
      ...familyTree,
      members: finalMembers,
      updatedAt: new Date().toISOString()
    });
  };

  // 提交新成员表单
  const handleSubmitNewMember = () => {
    if (newMemberParentId && newMember.name) {
      addChildMember(newMemberParentId, newMember);
      setIsAddMemberDialogOpen(false);
      setNewMember({
        name: '',
        relation: '子女',
        gender: 'male'
      });
    }
  };

  // 查找根节点成员（没有父节点的成员）
  const rootMembers = familyTree.members.filter(member => !member.parentId);

  // 查找子节点成员
  const getChildMembers = (parentId: string) => {
    return familyTree.members.filter(member => member.parentId === parentId);
  };

  // 渲染成员及其子成员
  const renderMemberWithChildren = (member: Member, level = 0) => {
    const children = getChildMembers(member.id);
    const isRoot = level === 0;

    return (
      <div key={member.id} className="flex flex-col items-center">
        <DroppableArea id={member.id}>
          <div className="m-2">
            <DraggableMember
              member={member}
              isRoot={isRoot}
              isActive={activeMemberId === member.id}
              isOver={overMemberId === member.id}
              onAddChild={handleAddChild}
              onRemoveParent={removeParentRelation}
              onDelete={handleDeleteMember}
            />
          </div>
        </DroppableArea>

        {children.length > 0 && (
          <div className="mt-4 relative">
            {/* 连接线 */}
            <div className="absolute top-0 left-1/2 w-0.5 h-4 -translate-x-1/2 bg-gray-300"></div>

            <div className="flex flex-wrap justify-center gap-4">
              {children.map(child => renderMemberWithChildren(child, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drag & Drop Family Tree Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          {familyTree.members.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-4">No family members yet. Start creating your family tree!</p>
              <Button
                onClick={() => {
                  setNewMemberParentId(null);
                  setIsAddMemberDialogOpen(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Member
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto p-4">
              <div className="flex flex-wrap justify-center gap-8">
                {rootMembers.map(member => renderMemberWithChildren(member))}
              </div>
            </div>
          )}
        </DndContext>

        {/* 添加新成员对话框 */}
        <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {newMemberParentId ? 'Add Child' : 'Add First Member'}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newMember.name || ''}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="relation" className="text-right">
                  Relationship
                </Label>
                <Input
                  id="relation"
                  value={newMember.relation || ''}
                  onChange={(e) => setNewMember({...newMember, relation: e.target.value})}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gender" className="text-right">
                  Gender
                </Label>
                <select
                  id="gender"
                  value={newMember.gender || 'male'}
                  onChange={(e) => setNewMember({...newMember, gender: e.target.value as 'male' | 'female' | 'other'})}
                  className="col-span-3 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birthDate" className="text-right">
                  Birth Date
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={newMember.birthDate || ''}
                  onChange={(e) => setNewMember({...newMember, birthDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewMember}>
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DraggableFamilyTree;
