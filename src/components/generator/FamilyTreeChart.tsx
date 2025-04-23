"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import MermaidChart from '@/components/MermaidChart';

interface FamilyTreeChartProps {
  chartDefinition: string;
}

const FamilyTreeChart: React.FC<FamilyTreeChartProps> = ({
  chartDefinition
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Family Tree Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
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
};

export default FamilyTreeChart;
