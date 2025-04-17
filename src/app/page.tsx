import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"

const HomePage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">家谱网站</h1>
      <p className="text-gray-700 mb-4">
        欢迎来到家谱网站，一个免费、易用的家谱制作工具。我们致力于帮助您轻松创建、展示和分享您的家族历史。
      </p>
      <p className="text-gray-700 mb-4">
        在这里，您可以找到家谱知识科普、丰富的家谱模板，以及简单易用的家谱生成器。
      </p>
      <Link href="/generator">
        <Button>开始制作家谱</Button>
      </Link>
    </div>
  );
};

export default HomePage;
