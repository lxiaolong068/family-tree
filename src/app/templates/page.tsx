import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // 虽然这里没直接用 Link 组件，但下载链接本质是链接
import Script from 'next/script';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Family Tree Templates | Free Downloadable Templates",
  description: "Download free family tree templates in various styles. Choose from classic genealogy charts, modern minimalist designs, and illustrated versions.",
  keywords: "family tree templates, genealogy templates, family tree chart templates, free family tree templates",
};

// Template data - images and files should be placed in the public directory in actual application
const templatesData = [
  { id: 1, title: "Classic Genealogy Chart", imgSrc: "/template1.jpg", downloadUrl: "/template1.docx", alt: "Classic genealogy chart template" },
  { id: 2, title: "Modern Minimalist Style", imgSrc: "/template2.jpg", downloadUrl: "/template2.xlsx", alt: "Modern minimalist style template" },
  { id: 3, title: "Illustrated Version", imgSrc: "/template3.jpg", downloadUrl: "/template3.pdf", alt: "Illustrated version template" },
];

const TemplatesPage = () => {
  return (
    <PageLayout
      title="Family Tree Templates"
      description="We have prepared various family tree templates for you. You can choose the appropriate template for download and use according to your needs."
    >
      {/* Structured Data for SEO */}
      <Script
        id="schema-templates"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Family Tree Templates",
            "description": "Download free family tree templates in various styles. Choose from classic genealogy charts, modern minimalist designs, and illustrated versions.",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": templatesData.map((template, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "DigitalDocument",
                  "name": template.title,
                  "description": `${template.title} family tree template for download`,
                  "image": `https://www.family-tree.cc${template.imgSrc}`,
                  "url": `https://www.family-tree.cc${template.downloadUrl}`,
                  "fileFormat": template.downloadUrl.split('.').pop(),
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  }
                }
              }))
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.family-tree.cc/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Family Tree Templates",
                  "item": "https://www.family-tree.cc/templates/"
                }
              ]
            }
          })
        }}
      />

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
                   fill
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   style={{ objectFit: "cover" }}
                   className="rounded-md"
                 />
              </div>
            </CardContent>
            <CardFooter>
              {/* download 属性提示浏览器下载文件 */}
              <a
                href={template.downloadUrl}
                download // Add download attribute
                className="text-blue-500 hover:underline"
              >
                Download Template
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};

export default TemplatesPage;