"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import LoginDialog from './LoginDialog';

const navItems = [
  { href: "/knowledge", label: "Knowledge" },
  { href: "/templates", label: "Templates" },
  { href: "/generator", label: "Generator" },
  { href: "/drag-editor", label: "Drag Editor" },
];

const Navbar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);

  return (
    <nav className="bg-gray-100 py-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          Family Tree
        </Link>
        <div className="flex items-center">
          <ul className="flex space-x-6 mr-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-gray-600 hover:text-blue-600 transition-colors",
                    pathname === item.href && "text-blue-600 font-semibold"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span className="text-sm text-gray-700">{user?.name}</span>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user?.profileImage} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          ) : (
            <Button onClick={() => setShowLoginDialog(true)}>
              Login
            </Button>
          )}
        </div>
      </div>

      <LoginDialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
    </nav>
  );
};

export default Navbar;