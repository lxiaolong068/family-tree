"use client"; // 需要 usePathname hook

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: "/knowledge", label: "Knowledge" },
  { href: "/templates", label: "Templates" },
  { href: "/generator", label: "Generator" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-100 py-4 border-b"> {/* 添加底部边框 */}
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          Family Tree
        </Link>
        <ul className="flex space-x-6"> {/* 增加链接间距 */}
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors",
                  pathname === item.href && "text-blue-600 font-semibold" // 活动链接高亮
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;