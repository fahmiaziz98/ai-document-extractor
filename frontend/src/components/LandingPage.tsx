import React from 'react';
import {
  Bot,
  Zap,
  Shield,
  Database,
  ArrowRight,
  CheckCircle2,
  ScanLine,
  Layout,
  Code2,
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand text-white p-1.5 rounded-lg">
              <Bot className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              AI Doc Extractor
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={onStart}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-light/50 rounded-full blur-3xl -z-10 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl -z-10 opacity-60"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light border border-blue-100 text-brand text-xs font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
            </span>
            Powered by Groq
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Extract Data from <br className="hidden sm:block" />
            <span className="text-brand">Any Document</span> Instantly
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Stop manual data entry. Define your schema, upload PDFs or images, and let our
            intelligent AI extract structured data with high accuracy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-brand text-white text-base font-semibold rounded-xl hover:bg-sky-400 transition-all shadow-xl shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Start Extracting Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-slate-400 grayscale opacity-70 animate-in fade-in duration-1000 delay-500">
            {/* Mock Logos for social proof */}
            <div className="flex items-center gap-2 font-semibold">
              <Shield className="w-5 h-5" /> Secure
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Zap className="w-5 h-5" /> Fast
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Code2 className="w-5 h-5" /> JSON Ready
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-slate-500 text-lg">
              Turn unstructured documents into structured JSON in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Layout className="w-8 h-8 text-brand" />,
                title: '1. Upload Document',
                desc: 'Drag and drop any PDF, invoice, receipt, or ID card. We support standard formats like JPG, PNG, and PDF.',
              },
              {
                icon: <ScanLine className="w-8 h-8 text-purple-500" />,
                title: '2. Define Schema',
                desc: 'Tell the AI what you want to find. Create fields for dates, names, amounts, or tables using our visual builder.',
              },
              {
                icon: <Database className="w-8 h-8 text-green-500" />,
                title: '3. Get Data',
                desc: 'The AI analyzes the document and returns clean, structured JSON data mapped exactly to your schema.',
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Why Choose Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Why use AI for <br />
                <span className="text-brand">Document Processing?</span>
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Traditional OCR is brittle and requires strict templates. Our LLM-based approach
                understands context, layout, and messy data just like a human would, but at machine
                speed.
              </p>

              <div className="space-y-4">
                {[
                  'No templates required - works on unseen layouts',
                  'Extracts from handwritten notes and low-quality scans',
                  'Automatically formats dates and numbers',
                  'Understand complex tables and line items',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onStart}
                className="mt-10 text-brand font-semibold hover:text-sky-600 flex items-center gap-2 group"
              >
                Try extracting a document now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand to-purple-500 rounded-2xl blur-2xl opacity-20"></div>
              <div className="relative bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-800">
                {/* Code Mockup */}
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-2 text-xs text-slate-500 font-mono">
                    extraction_result.json
                  </span>
                </div>
                <pre className="font-mono text-xs sm:text-sm text-blue-300 leading-relaxed overflow-x-auto">
                  {`{
  "invoice_number": "INV-2024-001",
  "date": "2024-03-15",
  "vendor": {
    "name": "Acme Corp",
    "verified": true
  },
  "line_items": [
    {
      "desc": "Consulting Services",
      "amount": 1500.00
    },
    {
      "desc": "Software License",
      "amount": 299.00
    }
  ],
  "total": 1799.00
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                <Bot className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900">AI Doc Extractor</span>
            </div>

            <div className="flex gap-8 text-sm text-slate-500">
              <a href="#" className="hover:text-brand transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-brand transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-brand transition-colors">
                API Docs
              </a>
              <a href="#" className="hover:text-brand transition-colors">
                Contact
              </a>
            </div>

            <div className="text-sm text-slate-400">
              © 2024 AI Doc Extractor. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
