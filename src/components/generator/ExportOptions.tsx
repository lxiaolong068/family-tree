"use client";

import React, { useRef, useState } from 'react';
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
import { handleClientError } from '@/lib/error-handler';

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
  // 导出状态管理
  const [isExporting, setIsExporting] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);
  
  // 导出为PNG图片
  const exportAsPNG = async () => {
    if (!chartRef.current || isExporting) return;
    
    try {
      // 设置导出状态
      setIsExporting(true);
      
      // 使用html2canvas生成图片
      const chartElement = chartRef.current;
      const canvas = await html2canvas(chartElement, {
        scale: 2, // 提高分辨率
        backgroundColor: '#ffffff',
        logging: false,
        removeContainer: true,
        // 改进克隆函数，使用更安全的选择器
        onclone: (clonedDoc) => {
          // 按照类名或元素结构查找，而不是使用ref属性
          const chartContainers = clonedDoc.querySelectorAll('.overflow-x-auto');
          chartContainers.forEach(container => {
            if (container instanceof HTMLElement) {
              container.style.overflow = 'visible';
            }
          });
          return Promise.resolve();
        }
      });
      
      // 转换为数据URL并下载
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${familyTreeName || 'family-tree'}.png`;
      link.click();
    } catch (error: unknown) {
      console.error('导出PNG失败:', error);
      alert(handleClientError(error));
    } finally {
      // 恢复状态
      setIsExporting(false);
    }
  };
  
  // 导出为PDF
  const exportAsPDF = async () => {
    if (!chartRef.current || isExporting) return;
    
    try {
      // 设置导出状态
      setIsExporting(true);
      
      // 使用html2canvas生成图片
      const chartElement = chartRef.current;
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        removeContainer: true,
        // 改进克隆函数，使用更安全的选择器
        onclone: (clonedDoc) => {
          // 按照类名或元素结构查找，而不是使用ref属性
          const chartContainers = clonedDoc.querySelectorAll('.overflow-x-auto');
          chartContainers.forEach(container => {
            if (container instanceof HTMLElement) {
              container.style.overflow = 'visible';
            }
          });
          return Promise.resolve();
        }
      });
      
      // 获取图片数据
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
    } catch (error: unknown) {
      console.error('导出PDF失败:', error);
      alert(handleClientError(error));
    } finally {
      // 恢复状态
      setIsExporting(false);
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
                disabled={disabled || isExporting} 
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? '导出中...' : '导出'}
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
