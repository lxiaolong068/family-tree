import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  }>;
}

export function ErrorDialog({
  isOpen,
  onClose,
  title,
  description,
  actions = [],
}: ErrorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          {description && (
            <DialogDescription className="mt-2 text-center">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
          {actions.length > 0 ? (
            actions.map((action, index) => (
              <Button 
                key={index} 
                variant={action.variant || "default"} 
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
              >
                {action.label}
              </Button>
            ))
          ) : (
            <Button onClick={onClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
