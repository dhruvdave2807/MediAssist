
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`p-8 sm:p-10 border-4 border-dashed rounded-2xl text-center transition-colors duration-300 ${
        dragActive ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-white'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept=".pdf,.png,.jpg,.jpeg,.txt"
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <UploadIcon className="w-16 h-16 text-teal-500" />
        <p className="text-xl font-semibold text-gray-700">
          Drag & Drop your report here
        </p>
        <p className="text-gray-500">or</p>
        <button
          type="button"
          onClick={onButtonClick}
          disabled={disabled}
          className="px-8 py-3 bg-teal-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Browse Files
        </button>
        <p className="text-sm text-gray-500 mt-2">
          {fileName ? `Selected: ${fileName}` : 'Supports: PDF, PNG, JPG, TXT'}
        </p>
      </div>
    </div>
  );
};
