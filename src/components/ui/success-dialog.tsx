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
import { CheckCircle2 } from "lucide-react";
import { useRouter } from 'next/navigation';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  familyTreeId?: number | string;
  familyTreeUrl?: string;
}

export function SuccessDialog({
  isOpen,
  onClose,
  title,
  description,
  familyTreeId,
  familyTreeUrl,
}: SuccessDialogProps) {
  const router = useRouter();

  const handleCopyLink = () => {
    if (familyTreeUrl) {
      navigator.clipboard.writeText(familyTreeUrl);
      // 可以添加一个复制成功的提示
    }
  };

  const handleNavigate = () => {
    if (familyTreeUrl) {
      router.push(familyTreeUrl);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          {description && (
            <DialogDescription className="mt-2 text-center">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {familyTreeId && familyTreeUrl && (
          <div className="p-4 mt-2 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-700 mb-2">
              You can access this family tree using the following link:
            </p>
            <div className="flex items-center">
              <div className="bg-white border rounded-md py-2 px-3 flex-1 overflow-x-auto text-sm">
                <code className="text-gray-800">{familyTreeUrl}</code>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-2 whitespace-nowrap"
                onClick={handleCopyLink}
              >
                Copy Link
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {familyTreeUrl && (
            <Button onClick={handleNavigate}>
              Open Family Tree
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
