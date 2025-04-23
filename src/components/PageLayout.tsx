"use client";

import React, { ReactNode } from 'react';

interface PageLayoutProps {
  /**
   * 页面标题
   */
  title: string;
  
  /**
   * 页面描述文本（可选）
   */
  description?: string;
  
  /**
   * 内容区域的子元素
   */
  children: ReactNode;
  
  /**
   * 额外的CSS类名
   */
  className?: string;
  
  /**
   * 页面头部右侧的操作按钮或内容
   */
  actions?: ReactNode;
}

/**
 * 通用页面布局组件
 * 
 * 提供统一的页面标题、描述和内容区域布局
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
