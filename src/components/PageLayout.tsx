"use client";

import React, { ReactNode } from 'react';

interface PageLayoutProps {
  /**
   * Page title
   */
  title: string;

  /**
   * Page description text (optional)
   */
  description?: string;

  /**
   * Child elements for the content area
   */
  children: ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Action buttons or content for the right side of the page header
   */
  actions?: ReactNode;
}

/**
 * Common page layout component
 *
 * Provides a unified layout for page title, description, and content area
 */
export function PageLayout({
  title,
  description,
  children,
  className = "",
  actions
}: PageLayoutProps) {
  return (
    <div className={`container mx-auto py-10 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-gray-700 mt-2">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
