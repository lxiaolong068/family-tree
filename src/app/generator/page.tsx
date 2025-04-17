"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Member {
  name: string;
  relation: string;
}

const GeneratorPage = () => {
  const [members, setMembers] = useState<Member[]>([{ name: '', relation: '' }]);

  const handleAddMember = () => {
    setMembers([...members, { name: '', relation: '' }]);
  };

  const handleInputChange = (index: number, field: keyof Member, value: string) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">家谱生成器</h1>
      <p className="text-gray-700 mb-4">
        输入家族成员信息，生成您的专属家谱。
      </p>
      {members.map((member, index) => (
        <div key={index} className="flex items-center mb-4 space-x-2">
          <Input
            type="text"
            placeholder="姓名"
            value={member.name}
            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
            className="flex-1"
          />
          <Input
            type="text"
            placeholder="关系 (例如：父亲, 母亲, 儿子, 女儿)"
            value={member.relation}
            onChange={(e) => handleInputChange(index, 'relation', e.target.value)}
            className="flex-1"
          />
          {/* 考虑添加删除按钮 */}
        </div>
      ))}
      <Button onClick={handleAddMember}>
        添加成员
      </Button>
      <div className="mt-4">
        {/* 家谱树状结构展示 */}
        <p className="text-gray-700">
          家谱结构将在后续版本中实现。
        </p>
      </div>
    </div>
  );
};

export default GeneratorPage;
