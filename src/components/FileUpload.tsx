import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle, FileText, Image, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';

interface ProcessedContent {
  type: string;
  content: string;
  metadata?: any;
}

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'bucket-error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<string>('');
  const [processedContent, setProcessedContent] = useState<ProcessedContent | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const logError = (operation: string, error: any, context?: any) => {
    const errorDetails = {
      operation,
      timestamp: new Date().toISOString(),
      error: {
        message: error?.message || 'Unknown error',
        name: error?.name || 'UnknownError',
        stack: error?.stack || 'No stack trace available',
        code: error?.code || 'NO_CODE',
        statusCode: error?.statusCode || 'NO_STATUS',
        details: error?.details || 'No additional details'
      },
      context: context || {},
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.group(`🔴 FileUpload Error - ${operation}`);
    console.error('Error Details:', errorDetails);
    console.error('Original Error Object:', error);
    if (context) {
      console.error('Context:', context);
    }
    console.groupEnd();

    return errorDetails;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const processCSV = async (file: File): Promise<ProcessedContent> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          console.log(`📄 Processing CSV file: ${file.name} (${file.size} bytes)`);
          const csvData = e.target?.result as string;
          const lines = csvData.split('\n').filter(line => line.trim());
          const headers = lines[0]?.split(',').map(h => h.trim()) || [];
          const rowCount = lines.length - 1;
          
          console.log(`✅ CSV processed successfully: ${rowCount} rows, ${headers.length} columns`);
          resolve({
            type: 'csv',
            content: `CSV file with ${rowCount} rows and ${headers.length} columns. Headers: ${headers.join(', ')}. Preview: ${lines.slice(0, 3).join('\n')}`,
            metadata: { headers, rowCount }
          });
        } catch (error) {
          logError('CSV Processing', error, { fileName: file.name, fileSize: file.size });
          reject(error);
        }
      };
      reader.onerror = (error) => {
        logError('CSV FileReader', error, { fileName: file.name, fileSize: file.size });
        reject(new Error('Failed to read CSV file'));
      };
      reader.readAsText(file);
    });
  };

  const processXLSX = async (file: File): Promise<ProcessedContent> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          console.log(`📊 Processing XLSX file: ${file.name} (${file.size} bytes)`);
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetNames = workbook.SheetNames;
          const firstSheet = workbook.Sheets[sheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
          console.log(`✅ XLSX processed successfully: ${sheetNames.length} sheets, ${jsonData.length} rows in first sheet`);
          resolve({
            type: 'xlsx',
            content: `Excel file with ${sheetNames.length} sheet(s). Sheet names: ${sheetNames.join(', ')}. First sheet has ${jsonData.length} rows.`,
            metadata: { sheetNames, rowCount: jsonData.length }
          });
        } catch (error) {
          logError('XLSX Processing', error, { fileName: file.name, fileSize: file.size });
          reject(error);
        }
      };
      reader.onerror = (error) => {
        logError('XLSX FileReader', error, { fileName: file.name, fileSize: file.size });
        reject(new Error('Failed to read XLSX file'));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const processDOCX = async (file: File): Promise<ProcessedContent> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          console.log(`📝 Processing DOCX file: ${file.name} (${file.size} bytes)`);
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          
          console.log(`✅ DOCX processed successfully: ${result.value.length} characters extracted`);
          resolve({
            type: 'docx',
            content: result.value,
            metadata: { wordCount: result.value.split(' ').length, charCount: result.value.length }
          });
        } catch (error) {
          logError('DOCX Processing', error, { fileName: file.name, fileSize: file.size });
          reject(error);
        }
      };
      reader.onerror = (error) => {
        logError('DOCX FileReader', error, { fileName: file.name, fileSize: file.size });
        reject(new Error('Failed to read DOCX file'));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const processPDF = async (file: File): Promise<ProcessedContent> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          console.log(`📄 Processing PDF file: ${file.name} (${file.size} bytes)`);
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          // For now, we'll use a simple PDF text extraction
          // In a real implementation, you'd use pdf-parse here
          const text = `PDF file processed. File size: ${(file.size / 1024).toFixed(2)} KB. This would contain extracted text from the PDF.`;
          
          console.log(`✅ PDF processed successfully (placeholder): ${file.size} bytes`);
          resolve({
            type: 'pdf',
            content: text,
            metadata: { size: file.size, pages: 'Unknown' }
          });
        } catch (error) {
          logError('PDF Processing', error, { fileName: file.name, fileSize: file.size });
          reject(error);
        }
      };
      reader.onerror = (error) => {
        logError('PDF FileReader', error, { fileName: file.name, fileSize: file.size });
        reject(new Error('Failed to read PDF file'));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const processPPTX = async (file: File): Promise<ProcessedContent> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          console.log(`📊 Processing PPTX file: ${file.name} (${file.size} bytes)`);
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          // For now, we'll provide a placeholder
          // In a real implementation, you'd use pptx-parser here
          const text = `PowerPoint presentation processed. File size: ${(file.size / 1024).toFixed(2)} KB. This would contain extracted text from slides.`;
          
          console.log(`✅ PPTX processed successfully (placeholder): ${file.size} bytes`);
          resolve({
            type: 'pptx',
            content: text,
            metadata: { size: file.size, slides: 'Unknown' }
          });
        } catch (error) {
          logError('PPTX Processing', error, { fileName: file.name, fileSize: file.size });
          reject(error);
        }
      };
      reader.onerror = (error) => {
        logError('PPTX FileReader', error, { fileName: file.name, fileSize: file.size });
        reject(new Error('Failed to read PPTX file'));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const processImage = async (file: File): Promise<ProcessedContent> => {
    try {
      console.log(`🖼️ Processing Image file: ${file.name} (${file.size} bytes) - Starting OCR`);
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      
      console.log(`✅ Image OCR completed: ${text.length} characters extracted`);
      return {
        type: 'image',
        content: text || 'No text detected in image',
        metadata: { size: file.size, charCount: text.length }
      };
    } catch (error) {
      logError('Image OCR Processing', error, { fileName: file.name, fileSize: file.size });
      throw new Error(`Failed to process image with OCR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const processTXT = async (file: File): Promise<ProcessedContent> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          console.log(`📝 Processing TXT file: ${file.name} (${file.size} bytes)`);
          const content = e.target?.result as string;
          
          console.log(`✅ TXT processed successfully: ${content.length} characters`);
          resolve({
            type: 'txt',
            content,
            metadata: { wordCount: content.split(' ').length, charCount: content.length }
          });
        } catch (error) {
          logError('TXT Processing', error, { fileName: file.name, fileSize: file.size });
          reject(error);
        }
      };
      reader.onerror = (error) => {
        logError('TXT FileReader', error, { fileName: file.name, fileSize: file.size });
        reject(new Error('Failed to read TXT file'));
      };
      reader.readAsText(file);
    });
  };

  const processFile = async (file: File): Promise<ProcessedContent> => {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    console.log(`🔄 Starting file processing for: ${file.name}`, {
      type: fileType,
      size: file.size,
      lastModified: new Date(file.lastModified).toISOString()
    });

    if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
      return processCSV(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileName.endsWith('.xlsx')) {
      return processXLSX(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      return processDOCX(file);
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return processPDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || fileName.endsWith('.pptx')) {
      return processPPTX(file);
    } else if (fileType.startsWith('image/') || fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) {
      return processImage(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return processTXT(file);
    } else {
      const unsupportedError = new Error(`Unsupported file type: ${fileType} for file: ${fileName}`);
      logError('File Type Validation', unsupportedError, { 
        fileName, 
        fileType, 
        fileSize: file.size,
        supportedTypes: ['PDF', 'DOCX', 'XLSX', 'PPTX', 'CSV', 'TXT', 'Images']
      });
      throw unsupportedError;
    }
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    
    console.log(`📥 File upload initiated:`, {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      lastModified: new Date(file.lastModified).toISOString()
    });
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv'
    ];
    const allowedExtensions = ['.pdf', '.docx', '.xlsx', '.pptx', '.txt', '.csv', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    
    const isValidType = allowedTypes.includes(file.type) || 
                       file.type.startsWith('image/') ||
                       allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isValidType) {
      const validationError = `Unsupported file type. File: ${file.name}, Type: ${file.type}`;
      logError('File Type Validation', new Error(validationError), {
        fileName: file.name,
        fileType: file.type,
        allowedTypes,
        allowedExtensions
      });
      setUploadStatus('error');
      setErrorMessage('Unsupported file type. Please upload a PDF, DOCX, XLSX, PPTX, CSV, TXT, or Image file.');
      return;
    }

    setUploading(true);
    setProcessing(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      console.log(`🔄 Starting file processing pipeline for: ${file.name}`);
      
      // Process the file content
      const processed = await processFile(file);
      setProcessedContent(processed);
      
      console.log(`✅ File content processed successfully`, {
        type: processed.type,
        contentLength: processed.content.length,
        metadata: processed.metadata
      });

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      console.log(`☁️ Starting Supabase upload: ${fileName}`);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file);

      if (uploadError) {
        const context = {
          fileName: file.name,
          fileSize: file.size,
          storageFileName: fileName,
          bucket: 'uploads',
          supabaseUrl: supabase.supabaseUrl,
          uploadData
        };
        
        // Check if it's a bucket not found error
        if (uploadError.message.includes('Bucket not found') || 
            uploadError.message.includes('bucket') || 
            uploadError.statusCode === '404') {
          logError('Supabase Storage - Bucket Not Found', uploadError, context);
          setUploadStatus('bucket-error');
          return;
        }
        
        logError('Supabase Storage Upload', uploadError, context);
        throw uploadError;
      }

      console.log(`✅ Supabase upload successful:`, uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);
        
      console.log(`🔗 Public URL generated: ${publicUrl}`);

      // Save metadata to database including processed content
      const dbPayload = {
        file_name: file.name,
        file_url: publicUrl,
        file_type: processed.type,
        processed_content: processed.content,
        metadata: processed.metadata
      };
      
      console.log(`💾 Saving to database:`, dbPayload);
      
      const { error: dbError } = await supabase
        .from('uploads')
        .insert([dbPayload]);

      if (dbError) {
        logError('Database Insert', dbError, {
          payload: dbPayload,
          table: 'uploads'
        });
        throw dbError;
      }

      console.log(`✅ Database save successful`);
      setUploadStatus('success');
      setUploadedFile(file.name);
      
    } catch (error) {
      const errorDetails = logError('File Upload Pipeline', error, {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        currentStep: uploading ? 'upload' : processing ? 'processing' : 'unknown'
      });
      
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred during upload.');
    } finally {
      setUploading(false);
      setProcessing(false);
      console.log(`🏁 File upload pipeline completed for: ${file.name}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'csv':
      case 'xlsx':
        return <BarChart3 className="w-8 h-8 text-green-600" />;
      case 'image':
        return <Image className="w-8 h-8 text-blue-600" />;
      case 'pdf':
      case 'docx':
      case 'pptx':
      case 'txt':
      default:
        return <FileText className="w-8 h-8 text-purple-600" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.docx,.xlsx,.pptx,.txt,.csv,.jpg,.jpeg,.png,.gif,.bmp,.webp"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="text-center">
          {uploading ? (
            <div>
              <div className="animate-spin mx-auto w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">
                {processing ? 'Processing file content...' : 'Uploading...'}
              </p>
            </div>
          ) : (
            <Upload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
          )}
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {uploading ? 'Processing...' : 'Upload Your Startup Documents'}
          </h3>
          
          <p className="text-gray-600 mb-4">
            Drag and drop your files here, or click to browse
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span className="bg-gray-100 px-3 py-1 rounded-full">PDF</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">DOCX</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">XLSX</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">PPTX</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">CSV</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">TXT</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">Images</span>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {uploadStatus === 'success' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">Upload successful!</p>
              <p className="text-green-700 text-sm mb-3">
                File "{uploadedFile}" has been uploaded and processed successfully.
              </p>
              
              {processedContent && (
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center mb-2">
                    {getFileIcon(processedContent.type)}
                    <span className="ml-2 font-medium text-gray-900 capitalize">
                      {processedContent.type} Content Preview
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                    {processedContent.content.substring(0, 300)}
                    {processedContent.content.length > 300 && '...'}
                  </div>
                  {processedContent.metadata && (
                    <div className="mt-2 text-xs text-gray-500">
                      {JSON.stringify(processedContent.metadata)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {uploadStatus === 'bucket-error' && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
            <div>
              <p className="text-amber-800 font-medium">Storage Setup Required</p>
              <p className="text-amber-700 text-sm mb-3">
                The Supabase storage bucket 'uploads' was not found. Please set up your Supabase project:
              </p>
              <ol className="text-amber-700 text-sm space-y-1 ml-4 list-decimal">
                <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-amber-800 underline hover:text-amber-900">Supabase Dashboard</a></li>
                <li>Navigate to Storage section</li>
                <li>Create a new bucket named 'uploads'</li>
                <li>Configure the bucket to allow public access for file uploads</li>
                <li>Set up Row Level Security policies to allow authenticated users to upload files</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Upload failed</p>
            <p className="text-red-700 text-sm">
              {errorMessage || 'Please ensure your file is a supported format (PDF, DOCX, XLSX, PPTX, CSV, TXT, or Image) and try again.'}
            </p>
            <p className="text-red-600 text-xs mt-2">
              Check the browser console for detailed error information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;