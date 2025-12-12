import React, { useState } from 'react';
import Header from '../components/Header';
import SchemaBuilder from '../components/SchemaBuilder';
import FileUpload from '../components/FileUpload';
import ResultsViewer from '../components/ResultsViewer';
import { SchemaField, ProcessingResponse } from '../types';
import { INITIAL_SCHEMA } from '../constants';
import { ArrowRight, AlertCircle } from 'lucide-react';

interface ExtractorProps {
  onBack?: () => void;
}

const Extractor: React.FC<ExtractorProps> = ({ onBack }) => {
  const [fields, setFields] = useState<SchemaField[]>(INITIAL_SCHEMA);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProcessingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!file) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('schema_config', JSON.stringify(fields));

      const apiUrl = process.env.VITE_API_URL;
      const hfToken = process.env.HF_TOKEN;
      const response = await fetch(`${apiUrl}/api/v1/extract`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfToken}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('API request failed');

      const data: ProcessingResponse = await response.json();

      // 3. Update State
      setResult({
        data: data.data, // Adjust based on your API response structure
        rawText: JSON.stringify(data, null, 2),
      });
    } catch (err) {
      console.error(err);
      setError('Failed to process document via API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onGoHome={onBack} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Toast / Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-5 h-full">
          {/* Left Column: Configuration (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex-none">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">1. Upload Document</h2>
              <div className="h-48">
                <FileUpload file={file} setFile={setFile} />
              </div>
            </div>

            <div className="flex-1 min-h-[400px]">
              <h2 className="text-lg font-semibold text-slate-800 mb-3 mt-12">2. Define Schema</h2>
              <div className="h-[calc(100%-2rem)]">
                <SchemaBuilder fields={fields} setFields={setFields} />
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={isLoading || !file}
              className={`
                w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all
                ${
                  isLoading || !file
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
            >
              {isLoading ? 'Processing...' : 'Process Document'}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>

          {/* Right Column: Results (7 cols) */}
          <div className="lg:col-span-6 flex flex-col h-full min-h-[500px]">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">3. Extraction Results</h2>
            <div className="flex-1">
              <ResultsViewer result={result} isLoading={isLoading} filename={file?.name} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Extractor;
