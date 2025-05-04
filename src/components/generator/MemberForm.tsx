"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <CardDescription>
          Fill in the basic information for the family member. You can add complex relationships after adding the member.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="additional">Additional Info</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-4">
            <div className="grid gap-4">
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
            </div>
          </TabsContent>

          <TabsContent value="additional" className="mt-4">
            <div className="grid gap-4">
              <div>
                <label htmlFor="deathDate" className="block text-sm font-medium text-gray-700 mb-1">Death Date</label>
                <Input
                  id="deathDate"
                  type="date"
                  value={currentMember.deathDate || ''}
                  onChange={(e) => onInputChange('deathDate', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Input
                  id="description"
                  placeholder="Additional information about this person"
                  value={currentMember.description || ''}
                  onChange={(e) => onInputChange('description', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
