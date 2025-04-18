"use client";

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidChartProps {
  chartDefinition: string;
  className?: string;
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chartDefinition, className }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 初始化mermaid配置
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

    // 渲染图表
    if (chartRef.current) {
      try {
        // 清除之前的内容
        chartRef.current.innerHTML = '';

        // 使用唯一ID避免冲突
        const uniqueId = `mermaid-chart-${Math.random().toString(36).substring(2, 9)}`;

        mermaid.render(uniqueId, chartDefinition).then(({ svg }) => {
          if (chartRef.current) {
            chartRef.current.innerHTML = svg;
          }
        }).catch((error) => {
          console.error('Mermaid chart rendering failed:', error);
          if (chartRef.current) {
            chartRef.current.innerHTML = `<div class="text-red-500">图表渲染失败: ${error instanceof Error ? error.message : String(error)}</div>`;
          }
        });
      } catch (error) {
        console.error('Mermaid chart rendering failed:', error);
        if (chartRef.current) {
          chartRef.current.innerHTML = `<div class="text-red-500">图表渲染失败: ${error instanceof Error ? error.message : String(error)}</div>`;
        }
      }
    }
  }, [chartDefinition]);

  return (
    <div ref={chartRef} className={className}>
      {/* Mermaid图表将在这里渲染 */}
    </div>
  );
};

export default MermaidChart;
