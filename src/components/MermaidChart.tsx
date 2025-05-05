"use client";

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// 为mermaid.render方法的返回值定义接口
interface MermaidRenderResult {
  svg: string;
  bindFunctions?: (element: Element) => void;
}

interface MermaidChartProps {
  chartDefinition: string;
  className?: string;
  'data-testid'?: string;
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chartDefinition, className, 'data-testid': dataTestId }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Initialize mermaid only once
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        rankSpacing: 80,
        nodeSpacing: 50,
        padding: 15
      },
      logLevel: 'error'
    });
  }, []);

  // Render chart when definition changes
  useEffect(() => {
    if (!chartDefinition || !chartRef.current) return;

    try {
      // Clear previous content
      chartRef.current.innerHTML = '';

      // Use unique ID to avoid conflicts
      const uniqueId = `mermaid-chart-${Math.random().toString(36).substring(2, 9)}`;

      mermaid.render(uniqueId, chartDefinition).then(({ svg }: MermaidRenderResult) => {
        if (chartRef.current) {
          chartRef.current.innerHTML = svg;
        }
      }).catch((error: unknown) => {
        console.error('Mermaid chart rendering failed:', error);
        if (chartRef.current) {
          chartRef.current.innerHTML = `<div class="text-red-500">Chart rendering failed: ${error instanceof Error ? error.message : String(error)}</div>`;
        }
      });
    } catch (error: unknown) {
      console.error('Mermaid chart rendering failed:', error);
      if (chartRef.current) {
        chartRef.current.innerHTML = `<div class="text-red-500">Chart rendering failed: ${error instanceof Error ? error.message : String(error)}</div>`;
      }
    }
  }, [chartDefinition]);

  return (
    <div ref={chartRef} className={className} data-testid={dataTestId}>
      {/* Mermaid chart will be rendered here */}
    </div>
  );
};

export default MermaidChart;
