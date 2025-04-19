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
  loadFamilyTreeFromLocalStorage,
  saveFamilyTreeToDatabase,
  loadFamilyTreeFromDatabase
} from '@/lib/family-tree-utils';
import { isDatabaseConfigured } from '@/db';

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
    // 首先尝试从数据库加载（如果有家谱ID在URL中）
    const loadFromDatabase = async () => {
      // 从 URL 参数中获取家谱ID
      const urlParams = new URLSearchParams(window.location.search);
      const familyTreeId = urlParams.get('id');

      if (familyTreeId) {
        try {
          const dbFamilyTree = await loadFamilyTreeFromDatabase(parseInt(familyTreeId));
          if (dbFamilyTree) {
            console.log('从数据库加载家谱成功:', dbFamilyTree);
            setFamilyTree(dbFamilyTree);
            setShowChart(true);
            updateChartDefinition(dbFamilyTree.members);
            return true; // 标记已从数据库加载成功
          }
        } catch (error) {
          console.error('从数据库加载家谱失败:', error);
        }
      }
      return false; // 标记未从数据库加载成功
    };

    // 如果数据库加载失败，则尝试从本地存储加载
    const loadData = async () => {
      const loadedFromDb = await loadFromDatabase();

      // 如果没有从数据库加载成功，则尝试从本地存储加载
      if (!loadedFromDb) {
        const savedFamilyTree = loadFamilyTreeFromLocalStorage();
        if (savedFamilyTree && savedFamilyTree.members.length > 0) {
          console.log('从本地存储加载家谱成功:', savedFamilyTree);
          setFamilyTree(savedFamilyTree);
          setShowChart(true);
          updateChartDefinition(savedFamilyTree.members);
        }
      }
    };

    loadData();
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

    // Check if there is a family tree ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const familyTreeId = urlParams.get('id');

    if (familyTreeId) {
      // If there is an ID parameter, save to database
      saveFamilyTreeToDatabase(updatedFamilyTree);
    } else {
      // If there is no ID parameter, save to local storage
      saveFamilyTreeToLocalStorage(updatedFamilyTree);
    }
  };

  // Delete member
  const handleDeleteMember = (id: string) => {
    const updatedMembers = familyTree.members.filter(member => member.id !== id);
    const updatedFamilyTree = {
      ...familyTree,
      members: updatedMembers,
      updatedAt: new Date().toISOString()
    };
    setFamilyTree(updatedFamilyTree);
    updateChartDefinition(updatedMembers);

    // Check if there is a family tree ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const familyTreeId = urlParams.get('id');

    if (familyTreeId) {
      // If there is an ID parameter, save to database
      saveFamilyTreeToDatabase(updatedFamilyTree);
    } else {
      // If there is no ID parameter, save to local storage
      saveFamilyTreeToLocalStorage(updatedFamilyTree);
    }
  };

  // Generate family tree chart
  const handleGenerateChart = () => {
    updateChartDefinition(familyTree.members);
    setShowChart(true);
  };

  // Clear family tree
  const handleClearFamilyTree = () => {
    if (confirm('Are you sure you want to clear the family tree data? This operation cannot be undone.')) {
      const newFamilyTree = createNewFamilyTree();
      setFamilyTree(newFamilyTree);
      setChartDefinition('');
      setShowChart(false);

      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('familyTree');
      }

      // If there is a family tree ID in the URL, also save to database
      const urlParams = new URLSearchParams(window.location.search);
      const familyTreeId = urlParams.get('id');
      if (familyTreeId) {
        saveFamilyTreeToDatabase(newFamilyTree);
      } else {
        // If there is no ID parameter, remove all parameters from the URL
        window.history.pushState({}, '', window.location.pathname);
      }
    }
  };

  // Save to database
  const handleSaveToDatabase = async () => {
    try {
      console.log('Starting to save family tree to database...');
      console.log('Database configuration status:', isDatabaseConfigured());

      // Check if database is configured
      if (!isDatabaseConfigured()) {
        alert('Database not configured, please check environment variable settings.');
        return;
      }

      // Check if family tree is empty
      if (familyTree.members.length === 0) {
        alert('Family tree is empty, please add members first.');
        return;
      }

      // First test database connection
      try {
        console.log('Testing database connection...');
        const testResponse = await fetch('/api/db-test');
        const testResult = await testResponse.json();
        console.log('Database connection test result:', testResult);

        if (!testResult.success) {
          alert('Database connection test failed: ' + (testResult.message || testResult.error));
          return;
        }
      } catch (testError) {
        console.error('Database connection test failed:', testError);
      }

      // Use API route to save family tree
      try {
        console.log('Trying to save family tree via API...');
        const response = await fetch('/api/save-family-tree', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ familyTree }),
        });

        const result = await response.json();
        console.log('Save result:', result);

        if (result.success && result.familyTreeId) {
          // Update URL to include family tree ID
          const url = new URL(window.location.href);
          url.searchParams.set('id', result.familyTreeId.toString());
          window.history.pushState({}, '', url.toString());

          // Clear local storage, because now we use the database
          if (typeof window !== 'undefined') {
            localStorage.removeItem('familyTree');
          }

          alert('Family tree has been successfully saved to the cloud!\n\nYou can access this family tree using the following link:\n' + url.toString());
        } else {
          // Display error message
          let errorMessage = 'Save failed\n';
          if (result.error) {
            errorMessage += '\nError: ' + result.error;
          }
          if (result.message) {
            errorMessage += '\nMessage: ' + result.message;
          }
          if (result.code) {
            errorMessage += '\nCode: ' + result.code;
          }

          alert(errorMessage);
        }
      } catch (apiError: any) {
        console.error('API call error:', apiError);
        alert('Save failed: ' + (apiError.message || 'Unknown error') + '\n\nPlease check the console for details.');
      }
    } catch (error: any) {
      console.error('Failed to save to database:', error);
      alert('Save failed: ' + (error.message || 'Unknown error') + '\n\nPlease check the console for details.');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Family Tree Generator</h1>
      <p className="text-gray-700 mb-4">
        Enter family member information to generate your personalized family tree.
      </p>

      {/* Add member form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Family Member</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <Input
                id="name"
                type="text"
                placeholder="Enter name"
                value={currentMember.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="relation" className="block text-sm font-medium mb-1">Relationship</label>
              <Input
                id="relation"
                type="text"
                placeholder="e.g., father, mother, son, daughter"
                value={currentMember.relation}
                onChange={(e) => handleInputChange('relation', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1">Gender</label>
              <select
                id="gender"
                className="w-full h-9 rounded-md border border-input px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={currentMember.gender}
                onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female' | 'other')}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium mb-1">Birth Date (Optional)</label>
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
          <Button onClick={handleAddMember} className="mr-2">Add Member</Button>
          <Button variant="outline" onClick={handleGenerateChart} className="mr-2">Generate Chart</Button>
          <Button variant="secondary" onClick={handleSaveToDatabase}>Save to Cloud</Button>
        </CardFooter>
      </Card>

      {/* Member list */}
      {familyTree.members.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Family Member List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Relationship</th>
                    <th className="text-left py-2 px-4">Gender</th>
                    <th className="text-left py-2 px-4">Birth Date</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {familyTree.members.map((member) => (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{member.name}</td>
                      <td className="py-2 px-4">{member.relation}</td>
                      <td className="py-2 px-4">
                        {member.gender === 'male' ? 'Male' : member.gender === 'female' ? 'Female' : 'Other'}
                      </td>
                      <td className="py-2 px-4">{member.birthDate || '-'}</td>
                      <td className="py-2 px-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {familyTree.members.length > 0 && (
              <div className="mt-4 text-right">
                <Button variant="destructive" onClick={handleClearFamilyTree}>Clear Family Tree</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Family tree chart */}
      {showChart && chartDefinition && (
        <Card>
          <CardHeader>
            <CardTitle>Family Tree Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <MermaidChart chartDefinition={chartDefinition} className="min-h-[300px]" />
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              Tip: The family tree chart is automatically generated based on member relationships. If relationships are unclear, not all connections may display correctly.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default GeneratorPage;
