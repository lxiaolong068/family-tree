"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FamilyTreeList from '@/components/profile/FamilyTreeList';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  // If not authenticated and not loading, redirect to home
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect from useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user?.profileImage} alt={user?.name} />
              <AvatarFallback className="text-xl">{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-3 w-full text-center">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Name</h3>
                <p className="text-lg font-medium">{user?.name}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => router.push('/generator')}
            >
              Create New Family Tree
            </Button>
          </CardFooter>
        </Card>

        {/* Family Trees List */}
        <div className="md:col-span-2">
          <FamilyTreeList userId={user?.id} />
        </div>
      </div>
    </div>
  );
}
