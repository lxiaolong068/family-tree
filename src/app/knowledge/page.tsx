import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const KnowledgePage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">家谱知识科普</h1>
      <p className="text-gray-700 mb-4">
        家谱，又称族谱、宗谱等，是记录家族世系和重要人物事迹的书籍。
      </p>
      <h2 className="text-2xl font-bold mb-2">如何制作家谱</h2>
      <ol className="list-decimal list-inside text-gray-700 mb-4">
        <li>收集家族成员信息</li>
        <li>确定家谱的格式和内容</li>
        <li>编写家谱</li>
        <li>校对和完善家谱</li>
        <li>印刷和保存家谱</li>
      </ol>
      <h2 className="text-2xl font-bold mb-2">常见问题（FAQ）</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>家谱应该包含哪些内容？</AccordionTrigger>
          <AccordionContent>
            通常包括：谱序、凡例、世系图、家谱正文（成员信息）、家规家训、传记、艺文著述等。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>如何查找家族成员信息？</AccordionTrigger>
          <AccordionContent>
            可以通过询问长辈、查阅旧物（信件、照片）、户籍档案、地方志、图书馆、网络资源等途径。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>家谱的保存方式有哪些？</AccordionTrigger>
          <AccordionContent>
            纸质印刷、电子文档（Word、PDF）、专门的家谱软件、在线家谱平台等。注意防潮、防火、防虫。
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default KnowledgePage;