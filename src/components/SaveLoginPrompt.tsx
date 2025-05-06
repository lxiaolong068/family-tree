"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LockKeyhole, LogIn, Database, CloudOff } from 'lucide-react';

interface SaveLoginPromptProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const SaveLoginPrompt: React.FC<SaveLoginPromptProps> = ({ open, onClose, onLogin }) => {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <LockKeyhole className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Login Required</DialogTitle>
          </div>
          <DialogDescription>
            You need to login to save your family tree to the cloud database.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <div className="flex items-start gap-3 mb-3">
              <Database className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Cloud Storage Benefits</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Saving to the cloud allows you to access your family tree from any device and ensures your data is securely backed up.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CloudOff className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Local Storage Only</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  If you choose not to login, your data will only be saved in your browser's local storage, which can be lost if you clear your browser data.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Continue Without Login
          </Button>
          <Button onClick={onLogin} className="w-full sm:w-auto gap-2">
            <LogIn className="h-4 w-4" />
            Login Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveLoginPrompt;
