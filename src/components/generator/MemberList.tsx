"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Member } from '@/types/family-tree';

interface MemberListProps {
  members: Member[];
  onDeleteMember: (id: string) => void;
  onClearFamilyTree: () => void;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  onDeleteMember,
  onClearFamilyTree
}) => {
  if (members.length === 0) {
    return null;
  }

  return (
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
              {members.map((member) => (
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
                      onClick={() => onDeleteMember(member.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <Button variant="destructive" onClick={onClearFamilyTree}>Clear Family Tree</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberList;
