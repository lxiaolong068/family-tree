import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestStylesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">样式测试页面</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>基本样式测试</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              这是一个测试卡片，用于检查基本样式是否正确加载。
            </p>
            <div className="flex gap-2">
              <Button variant="default">默认按钮</Button>
              <Button variant="outline">轮廓按钮</Button>
              <Button variant="destructive">危险按钮</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary text-secondary-foreground">
          <CardHeader>
            <CardTitle>颜色测试</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              这个卡片使用了次要颜色，测试颜色变量是否正确应用。
            </p>
            <div className="flex gap-2">
              <div className="w-12 h-12 bg-primary rounded-md"></div>
              <div className="w-12 h-12 bg-secondary rounded-md"></div>
              <div className="w-12 h-12 bg-accent rounded-md"></div>
              <div className="w-12 h-12 bg-destructive rounded-md"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 