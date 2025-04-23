"use client";

import { useState } from 'react';
import { logger } from '@/lib/logger';

/**
 * Error dialog action type
 */
export interface ErrorAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

/**
 * Error dialog configuration
 */
export interface ErrorDialogData {
  title: string;
  description?: string;
  actions?: ErrorAction[];
}

/**
 * Custom hook for centralized error handling
 */
export function useErrorHandling() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<ErrorDialogData>({ title: '' });

  /**
   * Show error dialog with specified data
   */
  const showError = (data: ErrorDialogData) => {
    setDialogData(data);
    setIsDialogOpen(true);
    
    // Log error to console
    logger.error(`Error: ${data.title}`, data.description || '');
  };

  /**
   * Show confirmation dialog
   */
  const showConfirmation = (
    title: string, 
    description: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    destructive = true
  ) => {
    setDialogData({
      title,
      description,
      actions: [
        {
          label: cancelLabel,
          onClick: () => {
            if (onCancel) onCancel();
          },
          variant: "outline"
        },
        {
          label: confirmLabel,
          onClick: onConfirm,
          variant: destructive ? "destructive" : "default"
        }
      ]
    });
    setIsDialogOpen(true);
  };

  /**
   * Close error dialog
   */
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  /**
   * Handle error automatically
   * @param err - Error object or string
   * @param title - Optional title override
   */
  const handleError = (err: unknown, title = 'Error Occurred') => {
    const errorMessage = err instanceof Error ? err.message : String(err);
    
    showError({
      title,
      description: errorMessage
    });
    
    // Return consistent error response format
    return {
      success: false,
      error: errorMessage
    };
  };

  return {
    isDialogOpen,
    dialogData,
    showError,
    showConfirmation,
    closeDialog,
    handleError
  };
}
