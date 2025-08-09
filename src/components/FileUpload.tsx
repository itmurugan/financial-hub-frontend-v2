import React, { useState } from 'react';
import { Upload, FileText, Image, FileSpreadsheet, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { UploadedFile, Transaction } from '../types';

interface FileUploadProps {
  onTransactionsExtracted: (transactions: Transaction[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onTransactionsExtracted }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [processingFile, setProcessingFile] = useState<string | null>(null);


  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `file-${Date.now()}-${i}`;
      
      setProcessingFile(file.name);
      
      // Add file to list with processing status
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        type: file.type,
        uploadDate: new Date(),
        status: 'processing',
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      
      try {
        // Upload file to API for processing
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          const extractedTransactions = result.transactions || [];
          
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, status: 'completed', extractedTransactions } 
              : f
          ));
          
          onTransactionsExtracted(extractedTransactions);
        } else {
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, status: 'error' } 
              : f
          ));
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error' } 
            : f
        ));
      } finally {
        setProcessingFile(null);
      }
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-5 w-5" />;
    if (type.includes('image')) return <Image className="h-5 w-5" />;
    if (type.includes('csv') || type.includes('excel')) return <FileSpreadsheet className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === 'error') return <AlertCircle className="h-5 w-5 text-red-500" />;
    return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Data Ingestion & AI Extraction</h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop your files here, or{' '}
          <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
            browse
            <input
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.csv,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </label>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports PDF, CSV, JPG, PNG (Bank statements, receipts, transaction exports)
        </p>
      </div>

      {processingFile && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Loader className="h-5 w-5 text-blue-600 animate-spin mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-900">AI Processing in Progress</p>
              <p className="text-sm text-blue-700">
                Using Gemini AI to extract and categorize transactions from {processingFile}...
              </p>
            </div>
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Uploaded Files</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {uploadedFiles.map(file => (
              <li key={file.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getFileIcon(file.type)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded {file.uploadDate.toLocaleString()}
                        {file.extractedTransactions && 
                          ` • ${file.extractedTransactions.length} transactions extracted`}
                      </p>
                    </div>
                  </div>
                  {getStatusIcon(file.status)}
                </div>
                {file.status === 'completed' && file.extractedTransactions && (
                  <div className="mt-3 bg-green-50 rounded p-3">
                    <p className="text-sm text-green-800">
                      ✓ AI successfully extracted and categorized {file.extractedTransactions.length} transactions
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-amber-900 mb-2">AI-Powered Features (Simulated)</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Automatic OCR for scanned documents and receipts</li>
          <li>• Intelligent transaction categorization using Gemini AI</li>
          <li>• Learning from your corrections for improved accuracy</li>
          <li>• Multi-format support (PDF, CSV, Images)</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;