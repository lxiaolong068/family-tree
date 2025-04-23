"use client";

import React, { useState } from 'react';
import { SuccessDialog } from '@/components/ui/success-dialog';
import { ErrorDialog } from '@/components/ui/error-dialog';
import MemberForm from '@/components/generator/MemberForm';
import MemberList from '@/components/generator/MemberList';
import FamilyTreeChart from '@/components/generator/FamilyTreeChart';
import { useFamilyTree, useFamilyTreeMembers, useFamilyTreeStorage } from '@/hooks';
import SaveLoginPrompt from '@/components/SaveLoginPrompt';
import LoginDialog from '@/components/LoginDialog';

const GeneratorPage = () => {
  // 使用自定义hooks
  const {
    familyTree,
    setFamilyTree,
    chartDefinition,
    showChart,
    clearFamilyTree,
    generateChart
  } = useFamilyTree();

  const {
    currentMember,
    handleInputChange,
    addMember,
    deleteMember
  } = useFamilyTreeMembers(familyTree, setFamilyTree);

  const {
    saveToDatabase,
    getFamilyTreeShareUrl
  } = useFamilyTreeStorage();

  // 页面UI状态
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);
  
  // 对话框数据
  const [successDialogData, setSuccessDialogData] = useState<{
    title: string;
    description?: string;
    familyTreeId?: number | string;
    familyTreeUrl?: string;
  }>({ title: '' });
  
  const [errorDialogData, setErrorDialogData] = useState<{
    title: string;
    description?: string;
    actions?: Array<{
      label: string;
      onClick: () => void;
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    }>;
  }>({ title: '' });

  // 对话框控制
  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  // 处理添加成员
  const handleAddMember = () => {
    const result = addMember();
    if (!result.success) {
      // 显示错误对话框
      setErrorDialogData({
        title: "Validation Error",
        description: result.error
      });
      setErrorDialogOpen(true);
    }
  };

  // 处理删除成员
  const handleDeleteMember = (id: string) => {
    // 删除确认
    setErrorDialogData({
      title: "Confirm Delete",
      description: "Are you sure you want to delete this family member?",
      actions: [
        {
          label: "Cancel",
          onClick: () => {},
          variant: "outline"
        },
        {
          label: "Delete",
          onClick: () => {
            deleteMember(id);
          },
          variant: "destructive"
        }
      ]
    });
    setErrorDialogOpen(true);
  };

  // 处理清空家谱
  const handleClearFamilyTree = () => {
    // 确认清除
    if (familyTree.members.length > 0) {
      // 使用错误对话框代替window.confirm
      setErrorDialogData({
        title: "Confirm Clear All",
        description: "Are you sure you want to clear the entire family tree? This action cannot be undone.",
        actions: [
          {
            label: "Cancel",
            onClick: () => {},
            variant: "outline"
          },
          {
            label: "Clear All",
            onClick: () => {
              clearFamilyTree();
            },
            variant: "destructive"
          }
        ]
      });
      setErrorDialogOpen(true);
    }
  };

  // 处理保存到数据库
  const handleSaveToDatabase = async () => {
    const result = await saveToDatabase(familyTree);
    
    if (!result.success) {
      // 检查是否需要登录
      if (result.requireAuth) {
        setShowLoginPrompt(true);
      } else {
        // 显示其他错误
        setErrorDialogData({
          title: "Save Failed",
          description: result.error
        });
        setErrorDialogOpen(true);
      }
      return;
    }
    
    // 成功保存
    if (result.result) {
      const shareUrl = getFamilyTreeShareUrl(result.result.id);
      
      // 显示成功对话框
      setSuccessDialogData({
        title: result.result.isUpdate ? "Family Tree Updated" : "Family Tree Saved",
        description: result.result.isUpdate
          ? "Your family tree has been successfully updated in the database."
          : "Your family tree has been successfully saved to the database.",
        familyTreeId: result.result.id,
        familyTreeUrl: shareUrl
      });
      setSuccessDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Family Tree Generator</h1>
      
      {/* 使用拆分出来的组件 */}
      <MemberForm
        currentMember={currentMember}
        onInputChange={handleInputChange}
        onAddMember={handleAddMember}
        onGenerateChart={generateChart}
        onSaveToDatabase={handleSaveToDatabase}
      />
      
      <MemberList
        members={familyTree.members}
        onDeleteMember={handleDeleteMember}
        onClearFamilyTree={handleClearFamilyTree}
      />
      
      <FamilyTreeChart chartDefinition={chartDefinition} />
      
      {/* 成功对话框 */}
      <SuccessDialog
        isOpen={successDialogOpen}
        onClose={handleCloseSuccessDialog}
        title={successDialogData.title}
        description={successDialogData.description}
        familyTreeId={successDialogData.familyTreeId}
        familyTreeUrl={successDialogData.familyTreeUrl}
      />
      
      {/* 错误对话框 */}
      <ErrorDialog
        isOpen={errorDialogOpen}
        onClose={handleCloseErrorDialog}
        title={errorDialogData.title}
        description={errorDialogData.description}
        actions={errorDialogData.actions}
      />

      {/* 登录提示对话框 */}
      <SaveLoginPrompt
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => {
          setShowLoginPrompt(false);
          setShowLoginDialog(true);
        }}
      />

      {/* 登录对话框 */}
      <LoginDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </div>
  );
};

export default GeneratorPage;
