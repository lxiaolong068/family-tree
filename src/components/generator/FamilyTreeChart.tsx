"use client";

import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import MermaidChart from '@/components/MermaidChart';
import { GitBranch, ZoomIn, ZoomOut, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  // 图表缩放功能
  const [zoom, setZoom] = React.useState(1);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  return (
    <Card className={`${className} shadow-md`}>
      <CardHeader className="bg-muted/50 rounded-t-xl flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <GitBranch className="h-5 w-5 text-primary" />
            Family Tree Chart
          </CardTitle>
          <CardDescription>
            Visual representation of your family relationships
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                  <span className="sr-only">Zoom Out</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={handleResetZoom}
          >
            {Math.round(zoom * 100)}%
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={handleZoomIn}
                  disabled={zoom >= 2}
                >
                  <ZoomIn className="h-4 w-4" />
                  <span className="sr-only">Zoom In</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-0 border-y">
        <div
          className="overflow-auto max-h-[500px] p-4"
          ref={chartContainerRef}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-in-out'
          }}
        >
          {chartDefinition ? (
            <MermaidChart
              chartDefinition={chartDefinition}
              className="min-h-[300px] mx-auto"
            />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-muted/20 rounded-lg p-8 text-center">
              <GitBranch className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground font-medium">No family tree data yet</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Add family members and establish relationships between them to visualize your family tree.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 rounded-b-xl py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            The family tree chart is automatically generated based on member relationships.
            Different colors represent different types of relationships.
          </p>
        </div>

        {chartDefinition && (
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1 text-xs h-7"
          >
            <Download className="h-3 w-3" />
            Export
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});

FamilyTreeChart.displayName = 'FamilyTreeChart';

export default FamilyTreeChart;
