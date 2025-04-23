"use client";

import React, { useState, useEffect } from 'react';
import { Member, FamilyTree, SaveFamilyTreeResult } from '@/types/family-tree';
import { SuccessDialog } from '@/components/ui/success-dialog';
import { ErrorDialog } from '@/components/ui/error-dialog';
import MemberForm from '@/components/generator/MemberForm';
import MemberList from '@/components/generator/MemberList';
import FamilyTreeChart from '@/components/generator/FamilyTreeChart';
import {
  generateMermaidChart,
  generateUniqueId,
  buildFamilyRelations,
  createNewFamilyTree,
  addMemberToFamilyTree,
  saveFamilyTreeToLocalStorage,
  loadFamilyTreeFromLocalStorage,
  saveFamilyTreeToDatabase,
  loadFamilyTreeFromDatabase
} from '@/lib/family-tree-utils';
import { isDatabaseConfigured } from '@/db';
import { useAuth } from '@/contexts/AuthContext';
import SaveLoginPrompt from '@/components/SaveLoginPrompt';
import LoginDialog from '@/components/LoginDialog';

const GeneratorPage = () => {
  // 认证状态
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // 家谱数据状态
  const [familyTree, setFamilyTree] = useState<FamilyTree>(createNewFamilyTree());
  // 当前编辑的成员
  const [currentMember, setCurrentMember] = useState<Partial<Member>>({
    name: '',
    relation: '',
    gender: 'male'
  });
  // 成功对话框状态
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const [successDialogData, setSuccessDialogData] = useState<{
    title: string;
    description?: string;
    familyTreeId?: number | string;
    familyTreeUrl?: string;
  }>({ title: '' });
  // 错误对话框状态
  const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);
  const [errorDialogData, setErrorDialogData] = useState<{
    title: string;
    description?: string;
    actions?: Array<{
      label: string;
      onClick: () => void;
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    }>;
  }>({ title: '' });
  // Mermaid图表定义
  const [chartDefinition, setChartDefinition] = useState<string>('');
  // 是否显示家谱图
  const [showChart, setShowChart] = useState<boolean>(false);

  // 对话框控制
  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  // 加载保存的家谱数据
  useEffect(() => {
    loadData();
  }, []);

  // 从数据库加载
  const loadFromDatabase = async () => {
    // 从 URL 参数中获取家谱ID
    const urlParams = new URLSearchParams(window.location.search);
    const familyTreeId = urlParams.get('id');
    console.log('URL parameters:', urlParams.toString());
    console.log('Family tree ID from URL:', familyTreeId);

    if (familyTreeId) {
      try {
        console.log('Attempting to load family tree with ID:', familyTreeId);
        const dbFamilyTree = await loadFamilyTreeFromDatabase(parseInt(familyTreeId));
        console.log('Database response for family tree:', dbFamilyTree);

        if (dbFamilyTree) {
          console.log('Successfully loaded family tree from database with members count:', dbFamilyTree.members.length);
          setFamilyTree(dbFamilyTree);
          setShowChart(true);
          updateChartDefinition(dbFamilyTree.members);
          return true; // 标记已从数据库加载成功
        } else {
          console.warn('No family tree data returned from database for ID:', familyTreeId);
        }
      } catch (error) {
        console.error('Failed to load family tree from database:', error);
        // 显示错误对话框
        setErrorDialogData({
          title: "Failed to Load Family Tree",
          description: "Could not load the family tree from database. Using local backup if available."
        });
        setErrorDialogOpen(true);
      }
    }
    return false; // 标记未从数据库加载成功
  };

  // 尝试加载数据，优先使用数据库
  const loadData = async () => {
    // 检查数据库是否配置
    const isDbConfigured = isDatabaseConfigured();

    if (isDbConfigured) {
      // 尝试从数据库加载
      const loadedFromDb = await loadFromDatabase();

      // 如果没有从数据库加载成功，则尝试从本地存储加载
      if (!loadedFromDb) {
        const savedFamilyTree = loadFamilyTreeFromLocalStorage();
        if (savedFamilyTree && savedFamilyTree.members.length > 0) {
          console.log('Loaded family tree from local storage backup:', savedFamilyTree);
          setFamilyTree(savedFamilyTree);
          setShowChart(true);
          updateChartDefinition(savedFamilyTree.members);
        }
      }
    } else {
      // 数据库未配置，直接从本地存储加载
      console.log('Database not configured. Loading from local storage only.');
      const savedFamilyTree = loadFamilyTreeFromLocalStorage();
      if (savedFamilyTree && savedFamilyTree.members.length > 0) {
        console.log('Loaded family tree from local storage:', savedFamilyTree);
        setFamilyTree(savedFamilyTree);
        setShowChart(true);
        updateChartDefinition(savedFamilyTree.members);
      }
    }
  };

  // 更新图表定义
  const updateChartDefinition = (members: Member[]) => {
    if (members.length > 0) {
      const definition = generateMermaidChart(buildFamilyRelations(members));
      setChartDefinition(definition);
      console.log('Chart definition updated:', definition);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: keyof Member, value: string) => {
    setCurrentMember(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 添加成员
  const handleAddMember = () => {
    try {
      // 验证表单
      if (!currentMember.name || !currentMember.relation) {
        // 显示错误对话框
        setErrorDialogData({
          title: "Validation Error",
          description: "Both name and relationship are required fields."
        });
        setErrorDialogOpen(true);
        return;
      }

      // 创建新成员
      const newMember: Member = {
        id: generateUniqueId(),
        name: currentMember.name!,
        relation: currentMember.relation!,
        gender: currentMember.gender || 'male',
        birthDate: currentMember.birthDate || '',
      };

      // 更新家谱
      const updatedFamilyTree = addMemberToFamilyTree(familyTree, newMember);
      setFamilyTree(updatedFamilyTree);

      // 保存到本地存储（作为备份）
      saveFamilyTreeToLocalStorage(updatedFamilyTree);

      // 清空表单
      setCurrentMember({
        name: '',
        relation: '',
        gender: 'male',
        birthDate: '',
      });

      // 更新图表
      updateChartDefinition(updatedFamilyTree.members);
      setShowChart(true);
    } catch (error) {
      console.error('Error adding family member:', error);
      // 显示错误对话框
      setErrorDialogData({
        title: "Error Adding Member",
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      setErrorDialogOpen(true);
    }
  };

  // 删除成员
  const handleDeleteMember = (id: string) => {
    try {
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
              // 执行删除
              const updatedMembers = familyTree.members.filter(member => member.id !== id);
              const updatedFamilyTree = {
                ...familyTree,
                members: updatedMembers
              };
              
              setFamilyTree(updatedFamilyTree);
              
              // 更新图表
              if (updatedMembers.length > 0) {
                updateChartDefinition(updatedMembers);
              } else {
                setChartDefinition('');
                setShowChart(false);
              }
              
              // 保存到本地存储
              saveFamilyTreeToLocalStorage(updatedFamilyTree);
            },
            variant: "destructive"
          }
        ]
      });
      setErrorDialogOpen(true);
    } catch (error) {
      console.error('Error deleting family member:', error);
      // 显示错误对话框
      setErrorDialogData({
        title: "Error Deleting Member",
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      setErrorDialogOpen(true);
    }
  };

  // 生成家谱图
  const handleGenerateChart = () => {
    if (familyTree.members.length > 0) {
      updateChartDefinition(familyTree.members);
      setShowChart(true);
    }
  };

  // 清空家谱
  const handleClearFamilyTree = () => {
    try {
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
                // 执行清除
                const newFamilyTree = createNewFamilyTree();
                setFamilyTree(newFamilyTree);
                setChartDefinition('');
                setShowChart(false);
                saveFamilyTreeToLocalStorage(newFamilyTree);
                
                // 重置表单
                setCurrentMember({
                  name: '',
                  relation: '',
                  gender: 'male',
                  birthDate: '',
                });
                
                // 清除URL参数（如果有ID）
                if (window.location.search.includes('id=')) {
                  window.history.replaceState({}, "", window.location.pathname);
                }
              },
              variant: "destructive"
            }
          ]
        });
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('Error clearing family tree:', error);
      // 显示错误对话框
      setErrorDialogData({
        title: "Failed to Clear Family Tree",
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      setErrorDialogOpen(true);
    }
  };

  // 保存到数据库
  const handleSaveToDatabase = () => {
    // 检查用户是否已登录
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    // 用户已登录，可以保存到数据库
    saveToDatabase();
  };

  // 实际保存到数据库的函数
  const saveToDatabase = async () => {
    try {
      // 检查是否有成员
      if (familyTree.members.length === 0) {
        // 显示错误对话框
        setErrorDialogData({
          title: "Cannot Save Empty Family Tree",
          description: "Please add at least one family member before saving."
        });
        setErrorDialogOpen(true);
        return;
      }

      // 保存到数据库
      const result = await saveFamilyTreeToDatabase(familyTree);
      
      if (result && result.id) {
        console.log('Family tree saved to database with ID:', result.id);
        
        // 创建URL（用于分享）
        const url = new URL(window.location.href);
        url.searchParams.set('id', result.id.toString());
        
        // 更新URL（但不刷新页面）
        window.history.replaceState({}, "", url.toString());
        
        // 显示成功对话框
        setSuccessDialogData({
          title: result.isUpdate ? "Family Tree Updated" : "Family Tree Saved",
          description: result.isUpdate
            ? "Your family tree has been successfully updated in the database."
            : "Your family tree has been successfully saved to the database.",
          familyTreeId: result.id,
          familyTreeUrl: url.toString()
        });
        setSuccessDialogOpen(true);
      } else {
        console.error('Failed to save family tree to database:', result);
        throw new Error('Failed to save to database. Please try again.');
      }
    } catch (error) {
      console.error('Error saving family tree to database:', error);
      // 显示错误对话框
      setErrorDialogData({
        title: "Failed to Save to Database",
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      setErrorDialogOpen(true);
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
        onGenerateChart={handleGenerateChart}
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
