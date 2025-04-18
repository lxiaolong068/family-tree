"use client";

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Member, FamilyTree } from '@/types/family-tree';
import MermaidChart from '@/components/MermaidChart';
import {
  generateMermaidChart,
  generateUniqueId,
  buildFamilyRelations,
  createNewFamilyTree,
  addMemberToFamilyTree,
  saveFamilyTreeToLocalStorage,
  loadFamilyTreeFromLocalStorage
} from '@/lib/family-tree-utils';

const GeneratorPage = () => {
  // 家谱数据状态
  const [familyTree, setFamilyTree] = useState<FamilyTree>(createNewFamilyTree());
  // 当前编辑的成员
  const [currentMember, setCurrentMember] = useState<Partial<Member>>({
    name: '',
    relation: '',
    gender: 'male'
  });
  // Mermaid图表定义
  const [chartDefinition, setChartDefinition] = useState<string>('');
  // 是否显示家谱图
  const [showChart, setShowChart] = useState<boolean>(false);

  // 加载保存的家谱数据
  useEffect(() => {
    const savedFamilyTree = loadFamilyTreeFromLocalStorage();
    if (savedFamilyTree && savedFamilyTree.members.length > 0) {
      setFamilyTree(savedFamilyTree);
      setShowChart(true);
      updateChartDefinition(savedFamilyTree.members);
    }
  }, []);

  // 更新图表定义
  const updateChartDefinition = (members: Member[]) => {
    const updatedMembers = buildFamilyRelations(members);
    const chartDef = generateMermaidChart(updatedMembers);
    setChartDefinition(chartDef);
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
    if (!currentMember.name || !currentMember.relation) {
      alert('请输入成员姓名和关系');
      return;
    }

    const updatedFamilyTree = addMemberToFamilyTree(familyTree, currentMember);
    setFamilyTree(updatedFamilyTree);
    setCurrentMember({ name: '', relation: '', gender: 'male' });
    updateChartDefinition(updatedFamilyTree.members);
    setShowChart(true);

    // 保存到本地存储
    saveFamilyTreeToLocalStorage(updatedFamilyTree);
  };

  // 删除成员
  const handleDeleteMember = (id: string) => {
    const updatedMembers = familyTree.members.filter(member => member.id !== id);
    const updatedFamilyTree = {
      ...familyTree,
      members: updatedMembers,
      updatedAt: new Date().toISOString()
    };
    setFamilyTree(updatedFamilyTree);
    updateChartDefinition(updatedMembers);
    saveFamilyTreeToLocalStorage(updatedFamilyTree);
  };

  // 生成家谱图
  const handleGenerateChart = () => {
    updateChartDefinition(familyTree.members);
    setShowChart(true);
  };

  // 清空家谱
  const handleClearFamilyTree = () => {
    if (confirm('确定要清空家谱数据吗？此操作不可恢复。')) {
      const newFamilyTree = createNewFamilyTree();
      setFamilyTree(newFamilyTree);
      setChartDefinition('');
      setShowChart(false);
      saveFamilyTreeToLocalStorage(newFamilyTree);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">家谱生成器</h1>
      <p className="text-gray-700 mb-4">
        输入家族成员信息，生成您的专属家谱。
      </p>

      {/* 添加成员表单 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>添加家族成员</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">姓名</label>
              <Input
                id="name"
                type="text"
                placeholder="请输入姓名"
                value={currentMember.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="relation" className="block text-sm font-medium mb-1">关系</label>
              <Input
                id="relation"
                type="text"
                placeholder="例如：父亲, 母亲, 儿子, 女儿"
                value={currentMember.relation}
                onChange={(e) => handleInputChange('relation', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1">性别</label>
              <select
                id="gender"
                className="w-full h-9 rounded-md border border-input px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={currentMember.gender}
                onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female' | 'other')}
              >
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium mb-1">出生日期 (可选)</label>
              <Input
                id="birthDate"
                type="date"
                value={currentMember.birthDate || ''}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddMember} className="mr-2">添加成员</Button>
          <Button variant="outline" onClick={handleGenerateChart}>生成家谱图</Button>
        </CardFooter>
      </Card>

      {/* 成员列表 */}
      {familyTree.members.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>家族成员列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">姓名</th>
                    <th className="text-left py-2 px-4">关系</th>
                    <th className="text-left py-2 px-4">性别</th>
                    <th className="text-left py-2 px-4">出生日期</th>
                    <th className="text-left py-2 px-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {familyTree.members.map((member) => (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{member.name}</td>
                      <td className="py-2 px-4">{member.relation}</td>
                      <td className="py-2 px-4">
                        {member.gender === 'male' ? '男' : member.gender === 'female' ? '女' : '其他'}
                      </td>
                      <td className="py-2 px-4">{member.birthDate || '-'}</td>
                      <td className="py-2 px-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          删除
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {familyTree.members.length > 0 && (
              <div className="mt-4 text-right">
                <Button variant="destructive" onClick={handleClearFamilyTree}>清空家谱</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 家谱图 */}
      {showChart && chartDefinition && (
        <Card>
          <CardHeader>
            <CardTitle>家谱图</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <MermaidChart chartDefinition={chartDefinition} className="min-h-[300px]" />
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              提示：家谱图会根据成员关系自动生成。如果关系不明确，可能无法正确显示所有连接。
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default GeneratorPage;
