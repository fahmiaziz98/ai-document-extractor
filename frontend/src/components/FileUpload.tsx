import React, { useCallback, useState } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ file, setFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (validTypes.includes(file.type)) {
      setFile(file);
    } else {
      alert('Invalid file type. Please upload PDF, JPG, PNG, or WEBP.');
    }
  };

  if (file) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
          <FileIcon className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="font-medium text-slate-800 text-lg truncate max-w-full px-4">{file.name}</h3>
        <p className="text-sm text-slate-400 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

        <div className="flex gap-3 w-full">
          <div className="flex-1 flex items-center justify-center gap-2 bg-green-50 border border-green-100 text-green-700 py-2 rounded-lg text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Ready to Process
          </div>
          <button
            onClick={() => setFile(null)}
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200 p-8 flex flex-col items-center justify-center text-center h-full min-h-[250px]
        ${
          isDragging
            ? 'border-accent bg-accent/5 scale-[1.01]'
            : 'border-slate-300 hover:border-accent/50 hover:bg-slate-50 bg-white'
        }
      `}
    >
      <div className="bg-slate-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
        <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-accent' : 'text-slate-400'}`} />
      </div>

      <h3 className="text-lg font-semibold text-slate-700 mb-1">Upload Document</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-[240px]">
        Drag & drop PDF, JPG, PNG or WEBP here, or click to browse
      </p>

      <label className="cursor-pointer">
        <input
          type="file"
          className="hidden"
          accept=".pdf, .jpg, .jpeg, .png, .webp"
          onChange={handleFileInput}
        />
        <span className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all active:scale-95">
          Browse Files
        </span>
      </label>
    </div>
  );
};

export default FileUpload;
