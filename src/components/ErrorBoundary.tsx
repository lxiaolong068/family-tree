"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * 错误边界组件
 * 捕获子组件中的JavaScript错误，并显示备用UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新状态，下次渲染时显示备用UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 记录错误信息
    logger.error('组件错误:', error, errorInfo);
  }

  handleReset = (): void => {
    // 重置错误状态
    this.setState({ hasError: false, error: undefined });
    
    // 调用外部重置函数（如果有）
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // 如果提供了自定义的fallback，则使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 否则使用默认的错误UI
      return (
        <Card className="w-full max-w-md mx-auto mt-8 border-red-200">
          <CardHeader className="bg-red-50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-700">Something went wrong</CardTitle>
            </div>
            <CardDescription className="text-red-600">
              An error occurred while rendering this component
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="bg-gray-50 p-3 rounded border text-sm font-mono overflow-auto max-h-32">
              {this.state.error?.message || 'Unknown error'}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * 错误边界包装器
 * 用于在函数组件中使用错误边界
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
): React.FC<P> {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
