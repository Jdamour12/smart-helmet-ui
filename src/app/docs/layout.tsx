import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Documentation
          </Link>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-8 prose prose-slate max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
