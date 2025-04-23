"use client";

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportOptionsProps {
  familyTreeName: string;
  chartRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  familyTreeName, 
  chartRef,
  disabled = false
}) => {
  // 导出为PNG图片
  const exportAsPNG = async () => {
    if (!chartRef.current) return;
    
    try {
      // 显示加载状态
      const chartElement = chartRef.current;
      chartElement.classList.add('relative');
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'absolute inset-0 bg-black/20 flex items-center justify-center z-10';
      loadingDiv.innerHTML = '<div class="text-white font-bold">Exporting...</div>';
      chartElement.appendChild(loadingDiv);
      
      // 等待DOM更新
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 使用html2canvas生成图片
      const canvas = await html2canvas(chartElement, {
        scale: 2, // 提高分辨率
        backgroundColor: '#ffffff',
        logging: false,
        removeContainer: true,
        // 确保可见性
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('div[ref="chartRef"]') as HTMLElement;
          if (clonedElement) {
            clonedElement.classList.remove('overflow-x-auto');
            clonedElement.style.overflow = 'visible';
          }
          return Promise.resolve();
        }
      });
      
      // 移除加载状态显示
      chartElement.removeChild(loadingDiv);
      chartElement.classList.remove('relative');
      
      // 转换为数据URL并下载
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${familyTreeName || 'family-tree'}.png`;
      link.click();
    } catch (error) {
      console.error('Export as PNG failed:', error);
      alert('Failed to export as PNG. Please try again.');
    }
  };
  
  // 导出为PDF
  const exportAsPDF = async () => {
    if (!chartRef.current) return;
    
    try {
      // 显示加载状态
      const chartElement = chartRef.current;
      chartElement.classList.add('relative');
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'absolute inset-0 bg-black/20 flex items-center justify-center z-10';
      loadingDiv.innerHTML = '<div class="text-white font-bold">Exporting...</div>';
      chartElement.appendChild(loadingDiv);
      
      // 等待DOM更新
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 使用html2canvas生成图片
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        removeContainer: true,
        // 确保可见性
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('div[ref="chartRef"]') as HTMLElement;
          if (clonedElement) {
            clonedElement.classList.remove('overflow-x-auto');
            clonedElement.style.overflow = 'visible';
          }
          return Promise.resolve();
        }
      });
      
      // 移除加载状态显示
      chartElement.removeChild(loadingDiv);
      chartElement.classList.remove('relative');
      
      const imgData = canvas.toDataURL('image/png');
      
      // 创建PDF文档
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
      });
      
      // 获取画布尺寸并调整PDF尺寸
      const imgWidth = 280; // PDF宽度减去页边距
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // 添加图片到PDF
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // 下载PDF
      pdf.save(`${familyTreeName || 'family-tree'}.pdf`);
    } catch (error) {
      console.error('Export as PDF failed:', error);
      alert('Failed to export as PDF. Please try again.');
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle>Export Family Tree</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                disabled={disabled} 
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportAsPNG}>
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportAsPDF}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {disabled && (
            <p className="text-sm text-muted-foreground">
              Add family members to enable export
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
