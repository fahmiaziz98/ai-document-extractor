import React from 'react';
import { Bot, FileText } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-accent/10 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Document Extractor</h1>
              <p className="text-xs text-slate-500 font-medium">Powered by OCR + Llama-3.3-70B</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="hidden md:flex items-center gap-2 text-sm text-slate-600 hover:text-accent transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Documentation</span>
            </a>
            <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium border border-green-200">
              System Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;