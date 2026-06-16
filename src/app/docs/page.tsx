import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { DOCS_PAGES } from '@/lib/constants';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-slate-900">Documentation</h1>
          </div>
          <p className="text-lg text-slate-600">
            Learn how to use Smart Helmet and understand all monitoring metrics and alert systems
          </p>
        </div>

        {/* Navigation Links */}
        <div className="grid md:grid-cols-2 gap-6">
          {DOCS_PAGES.map((page) => (
            <Link
              key={page.slug}
              href={`/docs/${page.slug}`}
              className="group bg-white rounded-lg border-2 border-slate-200 p-6 hover:border-orange-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-500 transition-colors">
                    {page.title}
                  </h3>
                  <p className="text-slate-600 mt-2">{page.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors mt-1 flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-4">Quick Tips</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• All gas measurements are in real-time and updated every 10 seconds</li>
            <li>• Critical alerts require immediate action and escalation</li>
            <li>• Customize alert thresholds in Settings based on your operations</li>
            <li>• Check gateway connectivity regularly for reliable monitoring</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
