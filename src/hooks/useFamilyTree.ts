import { useState, useEffect } from 'react';
import { FamilyTree, Member, SaveFamilyTreeResult } from '@/types/family-tree';
import {
  createNewFamilyTree,
  generateMermaidChart,
  buildFamilyRelations,
  loadFamilyTreeFromLocalStorage,
  loadFamilyTreeFromDatabase,
  saveFamilyTreeToLocalStorage
} from '@/lib/family-tree-utils';
import { isDatabaseConfigured } from '@/db';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * 自定义hook：管理家谱数据
 * 
 * 该hook包含以下功能：
 * 1. 管理家谱数据状态
 * 2. 从本地存储或数据库加载数据
 * 3. 生成家谱图表
 * 4. 处理URL参数中的家谱ID
 */
export function useFamilyTree() {
  // 状态管理
  const [familyTree, setFamilyTree] = useState<FamilyTree>(createNewFamilyTree());
  const [chartDefinition, setChartDefinition] = useState<string>('');
  const [showChart, setShowChart] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 路由相关
  const router = useRouter();
  const searchParams = useSearchParams();

  // 初始化函数
  useEffect(() => {
    loadData();
  }, []);

  /**
   * 从本地存储或数据库加载家谱数据
   */
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 检查数据库是否配置
      const isDbConfigured = isDatabaseConfigured();
      
      // 从URL参数中获取家谱ID
      const familyTreeId = searchParams?.get('id');

      if (isDbConfigured && familyTreeId) {
        // 尝试从数据库加载
        const loadedFromDb = await loadFromDatabase(parseInt(familyTreeId));
        
        if (!loadedFromDb) {
          // 如果数据库加载失败，尝试从本地存储加载
          loadFromLocalStorage();
        }
      } else {
        // 直接从本地存储加载
        loadFromLocalStorage();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载家谱数据失败');
      console.error('加载家谱数据失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 从数据库加载家谱数据
   * @param id 家谱ID
   * @returns 是否成功从数据库加载
   */
  const loadFromDatabase = async (id: number): Promise<boolean> => {
    try {
      console.log('正在从数据库加载家谱，ID:', id);
      const dbFamilyTree = await loadFamilyTreeFromDatabase(id);
      
      if (dbFamilyTree) {
        console.log('成功从数据库加载家谱，成员数量:', dbFamilyTree.members.length);
        setFamilyTree(dbFamilyTree);
        setShowChart(true);
        updateChartDefinition(dbFamilyTree.members);
        return true;
      } else {
        console.warn('未找到ID为', id, '的家谱');
        return false;
      }
    } catch (err) {
      console.error('从数据库加载家谱失败:', err);
      setError(err instanceof Error ? err.message : '从数据库加载家谱失败');
      return false;
    }
  };

  /**
   * 从本地存储加载家谱数据
   */
  const loadFromLocalStorage = () => {
    const savedFamilyTree = loadFamilyTreeFromLocalStorage();
    if (savedFamilyTree && savedFamilyTree.members.length > 0) {
      console.log('从本地存储加载家谱:', savedFamilyTree);
      setFamilyTree(savedFamilyTree);
      setShowChart(true);
      updateChartDefinition(savedFamilyTree.members);
    }
  };

  /**
   * 更新家谱图表定义
   * @param members 家谱成员
   */
  const updateChartDefinition = (members: Member[]) => {
    if (members.length > 0) {
      const definition = generateMermaidChart(buildFamilyRelations(members));
      setChartDefinition(definition);
      console.log('已更新图表定义:', definition);
    } else {
      setChartDefinition('');
    }
  };

  /**
   * 保存家谱到本地存储
   */
  const saveToLocalStorage = () => {
    saveFamilyTreeToLocalStorage(familyTree);
  };

  /**
   * 清空家谱数据
   */
  const clearFamilyTree = () => {
    const newFamilyTree = createNewFamilyTree();
    setFamilyTree(newFamilyTree);
    setChartDefinition('');
    setShowChart(false);
    saveFamilyTreeToLocalStorage(newFamilyTree);
    
    // 清除URL参数
    if (window.location.search.includes('id=')) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  };

  /**
   * 设置家谱数据
   * @param updatedFamilyTree 更新后的家谱数据
   */
  const setFamilyTreeData = (updatedFamilyTree: FamilyTree) => {
    setFamilyTree(updatedFamilyTree);
    updateChartDefinition(updatedFamilyTree.members);
    saveFamilyTreeToLocalStorage(updatedFamilyTree);
  };

  /**
   * 生成家谱图表
   */
  const generateChart = () => {
    if (familyTree.members.length > 0) {
      updateChartDefinition(familyTree.members);
      setShowChart(true);
    }
  };

  return {
    familyTree,
    setFamilyTree: setFamilyTreeData,
    chartDefinition,
    showChart,
    isLoading,
    error,
    loadData,
    loadFromDatabase,
    loadFromLocalStorage,
    updateChartDefinition,
    saveToLocalStorage,
    clearFamilyTree,
    generateChart
  };
}
