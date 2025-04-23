"use client";

import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import MermaidChart from '@/components/MermaidChart';

interface FamilyTreeChartProps {
  chartDefinition: string;
  className?: string;
}

const FamilyTreeChart = forwardRef<HTMLDivElement, FamilyTreeChartProps>(({ 
  chartDefinition,
  className
}, ref) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  // 使用useImperativeHandle暴露内部的ref给父组件
  useImperativeHandle(ref, () => chartContainerRef.current as HTMLDivElement);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Family Tree Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto" ref={chartContainerRef}>
          {chartDefinition ? (
            <MermaidChart chartDefinition={chartDefinition} className="min-h-[300px]" />
          ) : (
            <div className="flex items-center justify-center min-h-[300px] bg-gray-50 rounded-md">
              <p className="text-gray-500">No family tree data yet</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Tip: The family tree chart is automatically generated based on member relationships. If relationships are unclear, not all connections may display correctly.
        </p>
      </CardFooter>
    </Card>
  );
});

FamilyTreeChart.displayName = 'FamilyTreeChart';

export default FamilyTreeChart;
