import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // 虽然这里没直接用 Link 组件，但下载链接本质是链接
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// 模板数据 - 实际应用中图片和文件应放在 public 目录下
const templatesData = [
  { id: 1, title: "经典世系图", imgSrc: "/template1.jpg", downloadUrl: "/template1.docx", alt: "经典世系图模板" },
  { id: 2, title: "现代简约风", imgSrc: "/template2.jpg", downloadUrl: "/template2.xlsx", alt: "现代简约风模板" },
  { id: 3, title: "图文并茂版", imgSrc: "/template3.jpg", downloadUrl: "/template3.pdf", alt: "图文并茂版模板" },
];

const TemplatesPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">家谱模板展示</h1>
      <p className="text-gray-700 mb-4">
        我们为您准备了多种家谱模板，您可以根据自己的需求选择合适的模板进行下载和使用。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templatesData.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 建议使用 next/image 优化图片加载 */}
              {/* 需要在 next.config.js 中配置允许的 image domains */}
              {/* 假设图片尺寸为 400x300 */}
              <div className="relative w-full h-48 mb-2">
                 <Image
                   src={template.imgSrc}
                   alt={template.alt}
                   layout="fill" // 或者 width={400} height={300}
                   objectFit="cover" // 保持图片比例并覆盖容器
                   className="rounded-md" // 可选：添加圆角
                 />
              </div>
            </CardContent>
            <CardFooter>
              {/* download 属性提示浏览器下载文件 */}
              <a
                href={template.downloadUrl}
                download // 添加 download 属性
                className="text-blue-500 hover:underline"
              >
                下载模板
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;