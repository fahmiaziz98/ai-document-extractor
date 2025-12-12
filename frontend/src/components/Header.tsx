import React from 'react';
import { Bot, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onGoHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all mr-1"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <div
              className={`flex items-center gap-2 ${onGoHome ? 'cursor-pointer group' : ''}`}
              onClick={onGoHome}
            >
              <div className="bg-brand/10 p-2 rounded-lg group-hover:bg-brand/20 transition-colors">
                <Bot className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-brand transition-colors">
                  AI Doc Extractor
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium border border-green-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Gemini 2.5 Active
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
