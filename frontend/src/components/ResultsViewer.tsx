import React, { useState } from 'react';
import { ProcessingResponse } from '../types';
import { Check, Copy, Code, List, ChevronDown, ChevronRight, Zap } from 'lucide-react';

interface ResultsViewerProps {
  result: ProcessingResponse | null;
  isLoading: boolean;
}

const ResultsViewer: React.FC<ResultsViewerProps> = ({ result, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'formatted' | 'json'>('formatted');
  const [showRawText, setShowRawText] = useState(false);

  const handleCopy = () => {
    if (result?.data) {
      navigator.clipboard.writeText(JSON.stringify(result.data, null, 2));
    }
  };

  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-slate-400">-</span>;
    }

    if (typeof value === 'boolean') {
      return <span className={value ? 'text-green-600' : 'text-red-600'}>{value.toString()}</span>;
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return (
          <div className="space-y-2">
            {value.map((item, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                {typeof item === 'object' ? (
                  <div className="space-y-1">
                    {Object.entries(item).map(([k, v]) => (
                      <div key={k} className="flex gap-2 text-xs">
                        <span className="text-slate-500 font-medium min-w-fit">{k}:</span>
                        <span className="text-slate-700 break-words flex-1">{renderValue(v)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-700">{String(item)}</span>
                )}
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1 text-xs">
            {Object.entries(value).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-slate-500 font-medium min-w-fit">{k}:</span>
                <span className="text-slate-700 break-words flex-1">{renderValue(v)}</span>
              </div>
            ))}
          </div>
        );
      }
    }

    return <span className="text-slate-700">{String(value)}</span>;
  };

  if (isLoading) {
    return (
      <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-accent rounded-full animate-spin"></div>
          <Zap className="w-6 h-6 text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Processing Document</h3>
        <p className="text-slate-500 mt-2 max-w-sm">
          OCR + Llama-3.3-70B analyzing the document structure and extracting fields according to your schema...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full bg-slate-50 rounded-xl border border-slate-200 border-dashed p-8 flex flex-col items-center justify-center text-center text-slate-400">
        <List className="w-12 h-12 mb-4 opacity-50" />
        <p className="font-medium">No results yet</p>
        <p className="text-sm mt-1">Configure schema and process a file to see extracted data.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('formatted')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'formatted'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Formatted
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'json'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              JSON View
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {result.usage && (
            <span className="text-xs text-slate-400 hidden sm:inline-block">
              {result.usage.inputTokens} in / {result.usage.outputTokens} out
            </span>
          )}
          <button
            onClick={handleCopy}
            className="text-slate-500 hover:text-accent p-1.5 rounded-md hover:bg-slate-100 transition-colors"
            title="Copy JSON"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-0">
        {activeTab === 'formatted' ? (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Extracted Data</h3>
            <div className="grid gap-4">
              {result.data && Object.entries(result.data).map(([key, value]) => (
                <div key={key} className="group flex flex-col sm:flex-row sm:items-start border-b border-slate-100 pb-3 last:border-0 hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-colors">
                  <span className="text-sm font-medium text-slate-500 w-1/3 shrink-0 py-1">{key}</span>
                  <div className="text-sm text-slate-800 font-medium break-words w-full">
                    {renderValue(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-900 min-h-full">
            <pre className="text-xs sm:text-sm text-green-400 font-mono overflow-x-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200">
        <button
          onClick={() => setShowRawText(!showRawText)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            <span>Debug: Raw Model Response</span>
          </div>
          {showRawText ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {showRawText && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 max-h-48 overflow-y-auto">
            <p className="text-xs text-slate-600 font-mono whitespace-pre-wrap">
              {result.rawText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsViewer;