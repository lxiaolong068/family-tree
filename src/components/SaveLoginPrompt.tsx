"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
          <DialogTitle>Login Required</DialogTitle>
          <DialogDescription>
            You need to login to save your family tree to the database. Login now to continue.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end gap-3 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onLogin}>
            Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveLoginPrompt;
