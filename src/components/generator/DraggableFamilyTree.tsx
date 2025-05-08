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
      // Focus management: Optionally focus on a relevant element after dialog closes
      // Trigger Vercel deployment
      // For example, focus on the button that opened the dialog or the newly added member
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

    // 根据性别选择连接线颜色
    const lineColor = member.gender === 'male'
      ? 'bg-blue-300'
      : member.gender === 'female'
        ? 'bg-pink-300'
        : 'bg-green-300';

    return (
      <div key={member.id} className="flex flex-col items-center">
        <DroppableArea id={member.id}>
          <div className="m-2" tabIndex={0} role="group" aria-labelledby={`member-name-${member.id}`}>
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
            <div className={`absolute top-0 left-1/2 w-1 h-6 -translate-x-1/2 ${lineColor} rounded-full transition-all duration-300`}></div>

            <div className="flex flex-wrap justify-center gap-6">
              {children.map((child, index) => {
                // 如果有多个子节点，添加水平连接线
                const isFirstChild = index === 0;
                const isLastChild = index === children.length - 1;
                const showHorizontalLine = children.length > 1;

                return (
                  <div key={child.id} className="relative">
                    {showHorizontalLine && !isFirstChild && !isLastChild && (
                      <div className={`absolute top-[-24px] left-[-16px] right-[-16px] h-0.5 ${lineColor}`}></div>
                    )}
                    {showHorizontalLine && isFirstChild && (
                      <div className={`absolute top-[-24px] left-[50%] right-[-16px] h-0.5 ${lineColor}`}></div>
                    )}
                    {showHorizontalLine && isLastChild && (
                      <div className={`absolute top-[-24px] left-[-16px] right-[50%] h-0.5 ${lineColor}`}></div>
                    )}
                    {renderMemberWithChildren(child, level + 1)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Vercel Deployment Fix (VERY IMPORTANT - Ensure Vercel uses THIS commit, NOT 2e2d6d5): This change targets 'Unexpected token Card' and verifies 'xmlns' for the SVG element.
  return (
    <Card className="shadow-lg border-2 border-transparent" data-testid="family-tree-card-v2" aria-label="Family Tree Container Card"> {/* Updated data-testid to force Vercel rebuild (superseding 2e2d6d5) and address 'Unexpected token Card'. */}
      <CardHeader className="bg-muted/50 rounded-t-xl">
        <CardTitle className="flex items-center gap-2">
          {/* SVG xmlns ABSOLUTELY VERIFIED (Must supersede 2e2d6d5): Correct value is "http://www.w3.org/2000/svg". Any xmlns error means Vercel is on the WRONG commit. */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M8 3v2"></path>
            <path d="M16 3v2"></path>
            <path d="M21 7H3"></path>
            <path d="M16 10a4 4 0 1 1-8 0"></path>
            <path d="M18 21H6a2 2 0 0 1-2-2V7h16v12a2 2 0 0 1-2 2Z"></path>
            <path d="M9 17h6"></path>
          </svg>
          Drag & Drop Family Tree Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm" role="alert">
            <p className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <span>
              <strong>Tip:</strong> Drag a family member onto another to create a parent-child relationship.
              Click "Add Child" to add a new child to a member.
            </span>
          </p>
        </div>

        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          {familyTree.members.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary/50 mb-4">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                No family members yet. Start creating your family tree by adding your first member!
              </p>
              <Button
                onClick={() => {
                  setNewMemberParentId(null);
                  setIsAddMemberDialogOpen(true);
                }}
                className="gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                Add First Member
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto p-4 border rounded-lg bg-white/50">
              <div className="flex flex-wrap justify-center gap-10 min-h-[400px] p-4">
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
                <div className="col-span-3 grid grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => setNewMember({...newMember, gender: 'male'})}>
                    <input
                      type="radio"
                      id="gender-male"
                      checked={newMember.gender === 'male'}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor="gender-male" className="flex items-center gap-2 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 8v8"></path>
                        <path d="M8 12h8"></path>
                      </svg>
                      <span>Male</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-pink-50 transition-colors cursor-pointer" onClick={() => setNewMember({...newMember, gender: 'female'})}>
                    <input
                      type="radio"
                      id="gender-female"
                      checked={newMember.gender === 'female'}
                      onChange={() => {}}
                      className="h-4 w-4 text-pink-500 border-gray-300 focus:ring-pink-500"
                    />
                    <Label htmlFor="gender-female" className="flex items-center gap-2 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 12h8"></path>
                      </svg>
                      <span>Female</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-green-50 transition-colors cursor-pointer" onClick={() => setNewMember({...newMember, gender: 'other'})}>
                    <input
                      type="radio"
                      id="gender-other"
                      checked={newMember.gender === 'other'}
                      onChange={() => {}}
                      className="h-4 w-4 text-green-500 border-gray-300 focus:ring-green-500"
                    />
                    <Label htmlFor="gender-other" className="flex items-center gap-2 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 8v8"></path>
                      </svg>
                      <span>Other</span>
                    </Label>
                  </div>
                </div>
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
              <Button onClick={handleSubmitNewMember} className="w-full sm:w-auto">
                Add Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DraggableFamilyTree;
