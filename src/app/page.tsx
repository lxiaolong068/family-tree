import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"

const HomePage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Family Tree Website</h1>
      <p className="text-gray-700 mb-4">
        Welcome to the Family Tree Website, a free and easy-to-use family tree creation tool. We are dedicated to helping you easily create, display, and share your family history.
      </p>
      <p className="text-gray-700 mb-4">
        Here, you can find genealogy knowledge, rich family tree templates, and a simple-to-use family tree generator.
      </p>
      <Link href="/generator">
        <Button>Start Creating</Button>
      </Link>
    </div>
  );
};

export default HomePage;
