import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import PageLayout from "@/components/PageLayout";

const HomePage = () => {
  return (
    <PageLayout 
      title="Family Tree Website"
      description="Welcome to the Family Tree Website, a free and easy-to-use family tree creation tool. We are dedicated to helping you easily create, display, and share your family history."
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          Here, you can find genealogy knowledge, rich family tree templates, and a simple-to-use family tree generator.
        </p>
        <Link href="/generator">
          <Button>Start Creating</Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default HomePage;
