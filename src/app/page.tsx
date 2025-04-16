import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 p-6">
      <h1 className="text-4xl font-bold mb-4 text-blue-800">Family Tree Website</h1>
      <p className="text-lg text-gray-700 max-w-xl text-center mb-8">
        Build, visualize, and share your family history. Create beautiful family trees with ease, explore templates, and learn about genealogy.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full justify-center items-center">
        <Link href="/generator" className="w-full sm:w-auto">
          <Button className="min-w-[180px] px-6 py-3 text-base font-semibold whitespace-nowrap">
            Family Tree Generator
          </Button>
        </Link>
        <Link href="/templates" className="w-full sm:w-auto">
          <Button variant="outline" className="min-w-[140px] px-6 py-3 text-base font-semibold whitespace-nowrap">
            Templates
          </Button>
        </Link>
        <Link href="/knowledge" className="w-full sm:w-auto">
          <Button variant="ghost" className="min-w-[180px] px-6 py-3 text-base font-semibold whitespace-nowrap">
            Genealogy Knowledge
          </Button>
        </Link>
      </div>
      <footer className="text-gray-400 text-sm mt-12">
        &copy; {new Date().getFullYear()} Family Tree Project. Powered by Next.js & Shadcn UI.
      </footer>
    </main>
  );
}
