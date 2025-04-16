"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Family member node type
 */
export interface FamilyMember {
  id: string; // unique identifier
  name: string; // member name
  gender?: "male" | "female";
  parentId?: string | null; // parent node id
  children?: FamilyMember[];
}

/**
 * Family Tree Generator Page (Drag-and-drop editor prototype)
 * Supports adding members, (future) drag-and-drop relationship editing, and visualization preview (Mermaid.js planned)
 */
const initialData: FamilyMember[] = [
  { id: "1", name: "Ancestor", gender: "male", parentId: null, children: [] },
];

export default function FamilyTreeGenerator() {
  const [members, setMembers] = useState<FamilyMember[]>(initialData);

  // Add new member (simple version, can be extended to form input)
  const handleAddMember = () => {
    const name = prompt("Enter the new member's name:");
    if (!name) return;
    setMembers((prev) => [
      ...prev,
      { id: Date.now().toString(), name, parentId: null, children: [] },
    ]);
  };

  // Placeholder for drag-and-drop and relationship editing (to be implemented with dnd-kit or react-dnd)
  // TODO: Implement drag-and-drop to adjust parent-child relationships

  return (
    <div className="p-6 max-w-3xl mx-auto min-h-screen flex flex-col items-center justify-start">
      <h1 className="text-3xl font-bold mb-4 text-blue-800">Family Tree Generator (Drag-and-drop Prototype)</h1>
      <p className="mb-6 text-gray-700 text-center max-w-xl">
        Add family members, edit relationships (drag-and-drop coming soon), and visualize your family tree.<br />
        This is an early prototype. More features and better UI are on the way!
      </p>
      <Button onClick={handleAddMember} className="mb-6 px-6 py-2">
        Add New Member
      </Button>
      <ul className="space-y-2 w-full mb-8">
        {members.map((member) => (
          <li
            key={member.id}
            className="border rounded p-3 flex items-center justify-between bg-white shadow-sm"
          >
            <span className="font-medium text-gray-800">{member.name}</span>
            {/* Placeholder for drag handle and actions */}
            <span className="text-xs text-gray-400">ID: {member.id}</span>
          </li>
        ))}
      </ul>
      {/* Placeholder: Mermaid.js visualization area */}
      <div className="mt-8 p-4 bg-gray-50 rounded border text-gray-500 w-full text-center">
        <span>(Drag-and-drop editing, tree visualization, import/export, and more coming soon!)</span>
      </div>
    </div>
  );
}
