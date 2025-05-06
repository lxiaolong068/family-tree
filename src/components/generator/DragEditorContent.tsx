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

const DragEditorContent = () => {
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
    actions: [] as { label: string; onClick: () => void; variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" }[]
  });

  const router = useRouter();

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Load data from database or local storage
  const loadData = async () => {
    // Get family tree ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const familyTreeId = urlParams.get('id');

    if (isDatabaseConfigured() && familyTreeId) {
      try {
        // Load from database
        const loadedFamilyTree = await loadFamilyTreeFromDatabase(Number(familyTreeId));
        if (loadedFamilyTree) {
          console.log('Loaded family tree from database:', loadedFamilyTree);
          setFamilyTree(loadedFamilyTree);
        } else {
          // If not found in database, try loading from local storage
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Failed to load family tree from database:', error);
        // If database loading fails, try loading from local storage
        loadFromLocalStorage();
      }
    } else {
      // Database not configured or no ID parameter, load directly from local storage
      loadFromLocalStorage();
    }
  };

  // Load from local storage
  const loadFromLocalStorage = () => {
    const savedFamilyTree = loadFamilyTreeFromLocalStorage();
    if (savedFamilyTree && savedFamilyTree.members.length > 0) {
      console.log('Loaded family tree from local storage:', savedFamilyTree);
      setFamilyTree(savedFamilyTree);
    }
  };

  // Update family tree
  const handleUpdateFamilyTree = (updatedFamilyTree: FamilyTree) => {
    setFamilyTree(updatedFamilyTree);
    // Save to local storage (as backup)
    saveFamilyTreeToLocalStorage(updatedFamilyTree);
  };

  // Save to database
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
      // Save to database
      const result = await saveFamilyTreeToDatabase(familyTree);

      if (result && result.id) {
        console.log('Family tree saved to database with ID:', result.id);

        // Create URL (for sharing)
        const url = new URL(window.location.href);
        url.searchParams.set('id', result.id.toString());

        // Update URL (without refreshing the page)
        window.history.replaceState({}, "", url.toString());

        // Show success dialog
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
      console.error('Failed to save family tree to database:', error);

      // Check if authentication is required
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
        // Other errors
        setErrorDialogData({
          title: "Save Failed",
          description: error instanceof Error ? error.message : "An unknown error occurred while saving the family tree",
          actions: []
        });
      }

      setErrorDialogOpen(true);
    }
  };

  // Dialog control
  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        Drag & Drop Family Tree Editor
      </h1>

      <Card className="mb-6 shadow-md border-primary/10">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <CardTitle className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Instructions
          </CardTitle>
          <CardDescription className="text-gray-600">
            Create relationships between family members by dragging and dropping. Drag one member onto another to establish a parent-child relationship.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={loadData} className="gap-2 hover:bg-blue-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 12a9 9 0 0 0 15 6.7L21 16"></path>
                <path d="M21 22v-6h-6"></path>
              </svg>
              Reload
            </Button>
            <Button onClick={handleSaveToDatabase} className="gap-2 bg-primary hover:bg-primary/90 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save to Database
            </Button>
            <Link href="/generator" passHref>
              <Button variant="secondary" className="gap-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5"></path>
                  <path d="M12 19l-7-7 7-7"></path>
                </svg>
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

      {/* Success dialog */}
      <SuccessDialog
        isOpen={successDialogOpen}
        onClose={handleCloseSuccessDialog}
        title={successDialogData.title}
        description={successDialogData.description}
        familyTreeId={successDialogData.familyTreeId}
        familyTreeUrl={successDialogData.familyTreeUrl}
      />

      {/* Error dialog */}
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

export default DragEditorContent;
