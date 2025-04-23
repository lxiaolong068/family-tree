"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Member } from '@/types/family-tree';

interface MemberFormProps {
  currentMember: Partial<Member>;
  onInputChange: (field: keyof Member, value: string) => void;
  onAddMember: () => void;
  onGenerateChart: () => void;
  onSaveToDatabase: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({
  currentMember,
  onInputChange,
  onAddMember,
  onGenerateChart,
  onSaveToDatabase
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add Family Member</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <Input
              id="name"
              placeholder="Enter name"
              value={currentMember.name || ''}
              onChange={(e) => onInputChange('name', e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="relation" className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
            <Input
              id="relation"
              placeholder="e.g. father, mother, son"
              value={currentMember.relation || ''}
              onChange={(e) => onInputChange('relation', e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              id="gender"
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={currentMember.gender || 'male'}
              onChange={(e) => onInputChange('gender', e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
            <Input
              id="birthDate"
              type="date"
              value={currentMember.birthDate || ''}
              onChange={(e) => onInputChange('birthDate', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <Button onClick={onAddMember} className="w-full sm:w-auto">Add Member</Button>
        <div className="flex-1 sm:flex-none"></div>
        <Button variant="outline" onClick={onGenerateChart} className="w-full sm:w-auto">Generate Chart</Button>
        <Button variant="secondary" onClick={onSaveToDatabase} className="w-full sm:w-auto">Save to Database</Button>
      </CardFooter>
    </Card>
  );
};

export default MemberForm;
