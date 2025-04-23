import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-700 text-sm">
              &copy; {new Date().getFullYear()} Family Tree Maker. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/how-to-make-a-family-tree" className="text-sm text-gray-600 hover:text-primary transition-colors">
              How to Make a Family Tree
            </Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;