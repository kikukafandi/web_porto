'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  placeholder?: string;
  currentImage?: string | null;
}

export function FileUpload({ onFileSelect, accept = "image/*", placeholder = "Choose image...", currentImage }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-purple-400 bg-purple-400/10' 
            : 'border-gray-600 hover:border-purple-400/50 hover:bg-purple-400/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {preview ? (
          <div className="space-y-4">
            <img 
              src={preview} 
              alt="Preview" 
              className="mx-auto max-h-48 rounded-lg object-cover"
            />
            <p className="text-sm text-gray-400">Click or drag to change image</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">{placeholder}</p>
              <p className="text-sm text-gray-400 mt-1">
                Drag & drop or click to select
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}