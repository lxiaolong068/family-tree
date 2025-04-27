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
    actions: [] as { label: string; onClick: () => void; variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" }[]
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Load data from database or local storage
  const loadData = async () => {
    // Get family tree ID from URL parameters
    const familyTreeId = searchParams.get('id');

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

export default DragEditorPage;
