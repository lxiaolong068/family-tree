"use client";

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidChartProps {
  chartDefinition: string;
  className?: string;
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chartDefinition, className }) => {
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
        curve: 'basis'
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

      mermaid.render(uniqueId, chartDefinition).then(({ svg }) => {
        if (chartRef.current) {
          chartRef.current.innerHTML = svg;
        }
      }).catch((error) => {
        console.error('Mermaid chart rendering failed:', error);
        if (chartRef.current) {
          chartRef.current.innerHTML = `<div class="text-red-500">Chart rendering failed: ${error instanceof Error ? error.message : String(error)}</div>`;
        }
      });
    } catch (error) {
      console.error('Mermaid chart rendering failed:', error);
      if (chartRef.current) {
        chartRef.current.innerHTML = `<div class="text-red-500">Chart rendering failed: ${error instanceof Error ? error.message : String(error)}</div>`;
      }
    }
  }, [chartDefinition]);

  return (
    <div ref={chartRef} className={className}>
      {/* Mermaid chart will be rendered here */}
    </div>
  );
};

export default MermaidChart;
