import React from 'react';

export default function TestBasicPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">基本Tailwind测试</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">基本样式卡片</h2>
          <p className="text-gray-600 mb-4">
            这是一个只使用基本Tailwind类的卡片，不使用任何shadcn-ui组件。
          </p>
          <div className="flex gap-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
              普通按钮
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded border border-gray-300">
              轮廓按钮
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded">
              危险按钮
            </button>
          </div>
        </div>
        
        <div className="bg-purple-600 text-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">颜色测试卡片</h2>
          <p className="mb-4">
            这个卡片使用了紫色背景，测试颜色是否正确应用。
          </p>
          <div className="flex gap-2">
            <div className="w-12 h-12 bg-blue-500 rounded-md"></div>
            <div className="w-12 h-12 bg-purple-500 rounded-md"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
            <div className="w-12 h-12 bg-red-500 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 