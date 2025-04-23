"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUserFamilyTrees } from '@/lib/family-tree-utils';

interface FamilyTreeItem {
  id: number;
  name: string;
}

interface FamilyTreeListProps {
  userId: string;
}

export default function FamilyTreeList({ userId }: FamilyTreeListProps) {
  const [familyTrees, setFamilyTrees] = useState<FamilyTreeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFamilyTrees = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // API call to fetch user's family trees
        const response = await fetch(`/api/family-trees?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch family trees');
        }
        
        const data = await response.json();
        setFamilyTrees(data.familyTrees || []);
      } catch (err) {
        console.error('Error fetching family trees:', err);
        setError(err instanceof Error ? err.message : 'Failed to load family trees');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFamilyTrees();
  }, [userId]);

  const navigateToFamilyTree = (id: number) => {
    router.push(`/generator?id=${id}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center">Loading your family trees...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-red-500">Error: {error}</p>
          <Button 
            variant="outline" 
            className="mt-4 mx-auto block"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Family Trees</CardTitle>
        <CardDescription>
          View and manage your saved family trees
        </CardDescription>
      </CardHeader>
      <CardContent>
        {familyTrees.length > 0 ? (
          <div className="space-y-4">
            {familyTrees.map((tree) => (
              <div 
                key={tree.id} 
                className="p-4 border rounded-md hover:bg-gray-50 transition-colors flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{tree.name || `Family Tree #${tree.id}`}</h3>
                </div>
                <Button 
                  onClick={() => navigateToFamilyTree(tree.id)}
                  size="sm"
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't created any family trees yet.</p>
            <Button 
              onClick={() => router.push('/generator')}
              className="mx-auto"
            >
              Create Your First Family Tree
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
