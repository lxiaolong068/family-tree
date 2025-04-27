"use client";

import React, { useState, useEffect } from 'react';
import { FamilyTree } from '@/types/family-tree';
import DraggableFamilyTree from '@/components/generator/DraggableFamilyTree';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createNewFamilyTree, loadFamilyTreeFromLocalStorage, saveFamilyTreeToLocalStorage, loadFamilyTreeFromDatabase, saveFamilyTreeToDatabase } from '@/lib/family-tree-utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { isDatabaseConfigured } from '@/db';
import { SuccessDialog } from '@/components/ui/success-dialog';
import { ErrorDialog } from '@/components/ui/error-dialog';
import Link from 'next/link';

const DragEditorPage = () => {
  const [familyTree, setFamilyTree] = useState<FamilyTree>(createNewFamilyTree());
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [successDialogData, setSuccessDialogData] = useState({
    title: '',
    description: '',
    familyTreeId: 0,
    familyTreeUrl: ''
  });
  const [errorDialogData, setErrorDialogData] = useState({
    title: '',
    description: '',
    actions: [] as { label: string; onClick: () => void; variant?: string }[]
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  // 从数据库或本地存储加载数据
  const loadData = async () => {
    // 从 URL 参数中获取家谱ID
    const familyTreeId = searchParams.get('id');

    if (isDatabaseConfigured() && familyTreeId) {
      try {
        // 从数据库加载
        const loadedFamilyTree = await loadFamilyTreeFromDatabase(Number(familyTreeId));
        if (loadedFamilyTree) {
          console.log('从数据库加载家谱:', loadedFamilyTree);
          setFamilyTree(loadedFamilyTree);
        } else {
          // 如果数据库中没有找到，尝试从本地存储加载
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('从数据库加载家谱失败:', error);
        // 如果数据库加载失败，尝试从本地存储加载
        loadFromLocalStorage();
      }
    } else {
      // 数据库未配置或没有ID参数，直接从本地存储加载
      loadFromLocalStorage();
    }
  };

  // 从本地存储加载
  const loadFromLocalStorage = () => {
    const savedFamilyTree = loadFamilyTreeFromLocalStorage();
    if (savedFamilyTree && savedFamilyTree.members.length > 0) {
      console.log('从本地存储加载家谱:', savedFamilyTree);
      setFamilyTree(savedFamilyTree);
    }
  };

  // 更新家谱
  const handleUpdateFamilyTree = (updatedFamilyTree: FamilyTree) => {
    setFamilyTree(updatedFamilyTree);
    // 保存到本地存储（作为备份）
    saveFamilyTreeToLocalStorage(updatedFamilyTree);
  };

  // 保存到数据库
  const handleSaveToDatabase = async () => {
    if (!isDatabaseConfigured()) {
      setErrorDialogData({
        title: "Database Not Configured",
        description: "Unable to save to database because it is not configured. Your family tree has been saved to local storage.",
        actions: []
      });
      setErrorDialogOpen(true);
      return;
    }

    try {
      // 保存到数据库
      const result = await saveFamilyTreeToDatabase(familyTree);

      if (result && result.id) {
        console.log('家谱已保存到数据库，ID:', result.id);

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
      }
    } catch (error) {
      console.error('保存家谱到数据库失败:', error);

      // 检查是否需要认证
      if (error instanceof Error && error.message === 'AUTH_REQUIRED') {
        setErrorDialogData({
          title: "Login Required",
          description: "You need to log in to save to the database.",
          actions: [
            {
              label: "Cancel",
              onClick: () => setErrorDialogOpen(false),
              variant: "outline"
            },
            {
              label: "Login",
              onClick: () => {
                router.push('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
              }
            }
          ]
        });
      } else {
        // 其他错误
        setErrorDialogData({
          title: "Save Failed",
          description: error instanceof Error ? error.message : "An unknown error occurred while saving the family tree",
          actions: []
        });
      }

      setErrorDialogOpen(true);
    }
  };

  // 对话框控制
  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Drag & Drop Family Tree Editor</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
          <CardDescription>
            Create relationships between family members by dragging and dropping. Drag one member onto another to establish a parent-child relationship.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={loadData}>
              Reload
            </Button>
            <Button onClick={handleSaveToDatabase}>
              Save to Database
            </Button>
            <Link href="/generator" passHref>
              <Button variant="secondary">
                Back to Form Editor
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <DraggableFamilyTree
        familyTree={familyTree}
        onUpdateFamilyTree={handleUpdateFamilyTree}
      />

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
    </div>
  );
};

export default DragEditorPage;
