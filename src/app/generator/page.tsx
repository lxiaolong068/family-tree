"use client";

import React, { useState, useEffect, useRef } from 'react';

import { Member, FamilyTree, SaveFamilyTreeResult, Relationship, RelationType } from '@/types/family-tree';
import { SuccessDialog } from '@/components/ui/success-dialog';
import { ErrorDialog } from '@/components/ui/error-dialog';
import MemberForm from '@/components/generator/MemberForm';
import MemberList from '@/components/generator/MemberList';
import FamilyTreeChart from '@/components/generator/FamilyTreeChart';
import {
  generateMermaidChart,
  buildFamilyRelations,
  createNewFamilyTree,
  saveFamilyTreeToLocalStorage,
  loadFamilyTreeFromLocalStorage,
  saveFamilyTreeToDatabase,
  loadFamilyTreeFromDatabase,
  addRelationshipToMember,
  addRelationshipsToMember,
  removeRelationship
} from '@/lib/family-tree-utils';
import { isDatabaseConfigured } from '@/db';
import { useAuth } from '@/contexts/AuthContext';
import SaveLoginPrompt from '@/components/SaveLoginPrompt';
import LoginDialog from '@/components/LoginDialog';
import ExportOptions from '@/components/generator/ExportOptions';
import { useFamilyTreeMembers } from '@/hooks/useFamilyTreeMembers';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import Script from 'next/script';



const SoftwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Family Tree Generator - Family Tree CC",
  "operatingSystem": "Web",
  "applicationCategory": "MultimediaApplication",
  "softwareVersion": "1.0.0",
  "featureList": [
    "Create and manage family members",
    "Visualize family relationships with interactive charts",
    "Save family trees to your account (requires login)",
    "Load family trees from your account or local storage",
    "Export family trees as image (PNG, SVG, JPG)",
    "Drag and drop editor for easy tree building (beta)"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "250"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Create and visualize your family tree online with our free and easy-to-use generator. Build your ancestry chart, add family members, and explore your heritage with Family Tree CC.",
  "url": "https://www.family-tree.cc/generator/",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.family-tree.cc/generator/"
  },
  "image": "https://www.family-tree.cc/og-generator.jpg", // Same as OpenGraph image
  "creator": {
    "@type": "Organization",
    "name": "Family Tree CC",
    "url": "https://www.family-tree.cc"
  },
  "keywords": "family tree generator, create family tree, build family tree, online family tree tool, ancestry chart maker, genealogy software, free family tree generator"
};

const BreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://www.family-tree.cc/"
  },{
    "@type": "ListItem",
    "position": 2,
    "name": "Family Tree Generator",
    "item": "https://www.family-tree.cc/generator/"
  }]
};

const GeneratorPage = () => {
  // 认证状态
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // 家谱数据状态
  const [familyTree, setFamilyTree] = useState<FamilyTree>(createNewFamilyTree());
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
  // 家谱图表引用
  const chartRef = useRef<HTMLDivElement>(null);

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

  // 使用自定义钩子管理成员操作
  const {
    currentMember,
    handleInputChange,
    addMember,
    deleteMember
  } = useFamilyTreeMembers(familyTree, (updatedFamilyTree) => {
    setFamilyTree(updatedFamilyTree);
    // 保存到本地存储（作为备份）
    saveFamilyTreeToLocalStorage(updatedFamilyTree);
    // 更新图表
    if (updatedFamilyTree.members.length > 0) {
      updateChartDefinition(updatedFamilyTree.members);
      setShowChart(true);
    } else {
      setChartDefinition('');
      setShowChart(false);
    }
  });

  // 添加成员
  const handleAddMember = () => {
    try {
      const result = addMember();
      if (!result.success && result.error) {
        // 显示错误对话框
        setErrorDialogData({
          title: "Validation Error",
          description: result.error
        });
        setErrorDialogOpen(true);
      }
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
              const result = deleteMember(id);
              if (!result.success && result.error) {
                // 显示错误对话框
                setErrorDialogData({
                  title: "Error Deleting Member",
                  description: result.error
                });
                setErrorDialogOpen(true);
              }
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

  // 添加关系
  const handleAddRelationship = (memberId: string, relationship: Relationship) => {
    try {
      // 使用工具函数添加关系
      const result = addRelationshipToMember(familyTree, memberId, relationship);

      // 检查是否有冲突
      if (result.conflict) {
        // 显示冲突错误对话框
        setErrorDialogData({
          title: "Relationship Conflict",
          description: result.conflict.message
        });
        setErrorDialogOpen(true);
        return;
      }

      // 更新家谱状态
      setFamilyTree(result.familyTree);

      // 保存到本地存储（作为备份）
      saveFamilyTreeToLocalStorage(result.familyTree);

      // 更新图表
      updateChartDefinition(result.familyTree.members);

      // 显示成功消息
      setSuccessDialogData({
        title: "Relationship Added",
        description: "The relationship has been successfully added."
      });
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error adding relationship:', error);
      // 显示错误对话框
      setErrorDialogData({
        title: "Error Adding Relationship",
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      setErrorDialogOpen(true);
    }
  };

  // 批量添加关系
  const handleAddRelationships = (memberId: string, relationships: Relationship[]) => {
    try {
      // 使用工具函数批量添加关系
      const result = addRelationshipsToMember(familyTree, memberId, relationships);

      // 检查是否有冲突
      if (result.conflicts && result.conflicts.length > 0) {
        // 显示冲突错误对话框
        const conflictMessages = result.conflicts.map(c => c.message).join('\n');
        setErrorDialogData({
          title: "Relationship Conflicts",
          description: `Some relationships could not be added:\n${conflictMessages}`
        });
        setErrorDialogOpen(true);

        // 如果所有关系都有冲突，直接返回
        if (result.conflicts.length === relationships.length) {
          return;
        }
      }

      // 更新家谱状态
      setFamilyTree(result.familyTree);

      // 保存到本地存储（作为备份）
      saveFamilyTreeToLocalStorage(result.familyTree);

      // 更新图表
      updateChartDefinition(result.familyTree.members);

      // 计算成功添加的关系数量
      const successCount = result.conflicts
        ? relationships.length - result.conflicts.length
        : relationships.length;

      // 显示成功消息
      setSuccessDialogData({
        title: "Relationships Added",
        description: `${successCount} relationship${successCount !== 1 ? 's' : ''} have been successfully added.`
      });
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error adding relationships:', error);
      // 显示错误对话框
      setErrorDialogData({
        title: "Error Adding Relationships",
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      setErrorDialogOpen(true);
    }
  };

  // 移除关系
  const handleRemoveRelationship = (memberId: string, targetId: string, relationType: RelationType) => {
    try {
      // 使用工具函数移除关系
      const updatedFamilyTree = removeRelationship(familyTree, memberId, targetId, relationType);

      // 更新家谱状态
      setFamilyTree(updatedFamilyTree);

      // 保存到本地存储（作为备份）
      saveFamilyTreeToLocalStorage(updatedFamilyTree);

      // 更新图表
      updateChartDefinition(updatedFamilyTree.members);
    } catch (error) {
      console.error('Error removing relationship:', error);
      // 显示错误对话框
      setErrorDialogData({
        title: "Error Removing Relationship",
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
    <>
      <Script
        id="structured-data-softwareapplication"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SoftwareApplicationSchema) }}
      />
      <Script
        id="structured-data-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema) }}
      />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-6">Family Tree Generator</h1>

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
          onAddRelationship={handleAddRelationship}
          onAddRelationships={handleAddRelationships}
          onRemoveRelationship={handleRemoveRelationship}
        />

        <FamilyTreeChart ref={chartRef} chartDefinition={chartDefinition} />

        {/* 导出选项 */}
        <ExportOptions
          familyTreeName={familyTree.name || 'family-tree'}
          chartRef={chartRef}
          disabled={!chartDefinition || familyTree.members.length === 0}
        />

        {/* 拖拽编辑器链接 */}
        <div className="mt-4 mb-6 p-4 border border-dashed border-blue-300 rounded-lg bg-blue-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-blue-800">Try our new Drag & Drop Editor!</h3>
              <p className="text-sm text-blue-600">
                We've added a new drag and drop interface for easier family tree editing.
                Your current family tree data will be available in the new editor.
              </p>
            </div>
            <Link href="/drag-editor" passHref>
              <Button className="whitespace-nowrap">
                Try Drag Editor
              </Button>
            </Link>
          </div>
        </div>

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
    </>
  );
};

export default GeneratorPage;
