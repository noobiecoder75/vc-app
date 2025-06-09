import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle, FileText, Image, BarChart3, Brain, Database } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.js?url";
import { analyzeStartupContent, StartupAnalysis } from '../lib/openaiClient';
import { insertStartupData, DatabaseInsertResult } from '../lib/databaseService';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface ProcessedContent {
  type: string;
  content: string;
  metadata?: any;
}

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [savingToDb, setSavingToDb] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'bucket-error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<string>('');
  const [processedContent, setProcessedContent] = useState<ProcessedContent | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<StartupAnalysis | null>(null);
  const [dbResult, setDbResult] = useState<DatabaseInsertResult | null>(null);
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
          const headers = lines[0]?.split(',').map(h => h.trim().replace(/"/g, '')) || [];
          const rowCount = lines.length - 1;
          
          // Parse data for better analysis
          const rows = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const row: Record<string, string> = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            return row;
          });
          
          // Generate summary
          const sampleData = rows.slice(0, 3).map(row => 
            headers.map(h => `${h}: ${row[h]}`).join(', ')
          ).join('\n');
          
          const content = `CSV Analysis:
- Total rows: ${rowCount}
- Columns: ${headers.length}
- Headers: ${headers.join(', ')}

Sample data:
${sampleData}

Full CSV content:
${csvData}`;
          
          console.log(`✅ CSV processed successfully: ${rowCount} rows, ${headers.length} columns`);
          resolve({
            type: 'csv',
            content,
            metadata: { headers, rowCount, sampleRows: rows.slice(0, 5), fullData: rows }
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

  const processPDF = async (file: File): Promise<ProcessedContent> => {
    try {
      console.log(`📄 Processing PDF file: ${file.name} (${file.size} bytes)`);
      
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      console.log(`📄 PDF loaded successfully, ${pdf.numPages} pages`);
      
      let fullText = '';
      const pages = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter((item): item is any => 'str' in item)
          .map((item: any) => item.str)
          .join(' ');
        pages.push(`Page ${i}:\n${pageText}`);
        fullText += pageText + '\n';
      }
      
      const wordCount = fullText.split(/\s+/).filter(word => word.length > 0).length;
      
      const content = `PDF Document Analysis:
- Pages: ${pdf.numPages}
- Word count: ${wordCount}
- Character count: ${fullText.length}

Extracted content:
${fullText}`;
      
      console.log(`✅ PDF processed successfully: ${pdf.numPages} pages, ${wordCount} words`);
      return {
        type: 'pdf',
        content,
        metadata: { 
          pageCount: pdf.numPages, 
          wordCount, 
          charCount: fullText.length,
          pages: pages.slice(0, 3), // First 3 pages for metadata
          fullText
        }
      };
    } catch (error) {
      logError('PDF Processing', error, { fileName: file.name, fileSize: file.size });
      throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const processImage = async (file: File): Promise<ProcessedContent> => {
    try {
      console.log(`🖼️ Processing Image file: ${file.name} (${file.size} bytes) - Starting OCR`);
      const worker = await createWorker('eng');
      const { data: { text, confidence } } = await worker.recognize(file);
      await worker.terminate();
      
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      
      const content = `Image OCR Analysis:
- Detected text confidence: ${confidence.toFixed(1)}%
- Word count: ${wordCount}
- Character count: ${text.length}

Extracted text:
${text || 'No text detected in image'}`;
      
      console.log(`✅ Image OCR completed: ${text.length} characters extracted with ${confidence.toFixed(1)}% confidence`);
      return {
        type: 'image',
        content,
        metadata: { 
          size: file.size, 
          charCount: text.length, 
          wordCount,
          confidence,
          ocrText: text
        }
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
          const rawContent = e.target?.result as string;
          
          const lines = rawContent.split('\n');
          const wordCount = rawContent.split(/\s+/).filter(word => word.length > 0).length;
          const paragraphs = rawContent.split('\n\n').filter(p => p.trim().length > 0);
          
          const content = `Text File Analysis:
- Lines: ${lines.length}
- Paragraphs: ${paragraphs.length}
- Word count: ${wordCount}
- Character count: ${rawContent.length}

Full content:
${rawContent}`;
          
          console.log(`✅ TXT processed successfully: ${wordCount} words, ${lines.length} lines`);
          resolve({
            type: 'txt',
            content,
            metadata: { 
              wordCount, 
              charCount: rawContent.length, 
              lineCount: lines.length,
              paragraphCount: paragraphs.length,
              fullText: rawContent
            }
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
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return processPDF(file);
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
        supportedTypes: ['CSV', 'TXT', 'PDF', 'Images']
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
      'text/plain',
      'text/csv',
      'application/pdf'
    ];
    const allowedExtensions = ['.txt', '.csv', '.pdf', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    
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
      setErrorMessage('Unsupported file type. Please upload a CSV, TXT, PDF, or Image file.');
      return;
    }

    setUploading(true);
    setProcessing(true);
    setAiAnalyzing(false);
    setSavingToDb(false);
    setUploadStatus('idle');
    setErrorMessage('');
    setProcessedContent(null);
    setAiAnalysis(null);
    setDbResult(null);

    try {
      console.log(`🔄 Starting file processing pipeline for: ${file.name}`);
      
      // Step 1: Process the file content
      const processed = await processFile(file);
      setProcessedContent(processed);
      setProcessing(false);
      
      console.log(`✅ File content processed successfully`, {
        type: processed.type,
        contentLength: processed.content.length,
        metadata: processed.metadata
      });

      // Step 2: Analyze with ChatGPT
      setAiAnalyzing(true);
      console.log(`🤖 Starting AI analysis...`);
      
      try {
        const analysis = await analyzeStartupContent(
          processed.content, 
          processed.type, 
          processed.metadata
        );
        setAiAnalysis(analysis);
        console.log(`✅ AI analysis completed:`, analysis);
      } catch (aiError) {
        logError('AI Analysis', aiError, { processedContent: processed });
        console.warn('⚠️ AI analysis failed, continuing without it:', aiError);
        setAiAnalysis({});
      }
      setAiAnalyzing(false);

      // Step 3: Save to database
      setSavingToDb(true);
      console.log(`💾 Starting database save...`);
      
      const dbInsertResult = await insertStartupData(aiAnalysis || {});
      setDbResult(dbInsertResult);
      setSavingToDb(false);

      // Step 4: Upload to Supabase Storage
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
          uploadData
        };
        
        // Check if it's a bucket not found error
        if (uploadError.message.includes('Bucket not found') || 
            uploadError.message.includes('bucket') || 
            uploadError.message.includes('404')) {
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

      // Save metadata to uploads_queue table
      const dbPayload = {
        file_url: publicUrl,
        input_type: processed.type,
        company_id: dbResult?.companyId || null,
        status: 'done',
        parsed_json: {
          ...processed.metadata,
          aiAnalysis: aiAnalysis || {},
          dbResult: dbResult || {}
        },
        raw_text: processed.content
      };
      
      console.log(`💾 Saving to uploads_queue:`, dbPayload);
      
      const { error: dbError } = await supabase
        .from('uploads_queue')
        .insert([dbPayload]);

      if (dbError) {
        logError('Database Insert', dbError, {
          payload: dbPayload,
          table: 'uploads_queue'
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
        currentStep: processing ? 'processing' : aiAnalyzing ? 'ai-analysis' : savingToDb ? 'database-save' : uploading ? 'upload' : 'unknown'
      });
      
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred during upload.');
    } finally {
      setUploading(false);
      setProcessing(false);
      setAiAnalyzing(false);
      setSavingToDb(false);
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
        return <BarChart3 className="w-8 h-8 text-green-600" />;
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-600" />;
      case 'image':
        return <Image className="w-8 h-8 text-blue-600" />;
      case 'txt':
      default:
        return <FileText className="w-8 h-8 text-purple-600" />;
    }
  };

  const getCurrentStatus = () => {
    if (processing) return 'Processing file content...';
    if (aiAnalyzing) return 'Analyzing with AI...';
    if (savingToDb) return 'Saving to database...';
    if (uploading) return 'Uploading to storage...';
    return 'Upload your startup documents';
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
          accept=".txt,.csv,.pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="text-center">
          {uploading ? (
            <div>
              <div className="animate-spin mx-auto w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">{getCurrentStatus()}</p>
              
              {/* Progress indicators */}
              <div className="mt-4 space-y-2">
                <div className={`flex items-center justify-center space-x-2 text-sm ${processing ? 'text-blue-600' : processedContent ? 'text-green-600' : 'text-gray-400'}`}>
                  <FileText className="w-4 h-4" />
                  <span>File Processing</span>
                  {processedContent && <CheckCircle className="w-4 h-4" />}
                </div>
                
                <div className={`flex items-center justify-center space-x-2 text-sm ${aiAnalyzing ? 'text-blue-600' : aiAnalysis ? 'text-green-600' : 'text-gray-400'}`}>
                  <Brain className="w-4 h-4" />
                  <span>AI Analysis</span>
                  {aiAnalysis && <CheckCircle className="w-4 h-4" />}
                </div>
                
                <div className={`flex items-center justify-center space-x-2 text-sm ${savingToDb ? 'text-blue-600' : dbResult ? 'text-green-600' : 'text-gray-400'}`}>
                  <Database className="w-4 h-4" />
                  <span>Database Save</span>
                  {dbResult && <CheckCircle className="w-4 h-4" />}
                </div>
              </div>
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
            <span className="bg-gray-100 px-3 py-1 rounded-full">CSV</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">TXT</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">PDF</span>
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
              <p className="text-green-800 font-medium">Upload and analysis successful!</p>
              <p className="text-green-700 text-sm mb-3">
                File "{uploadedFile}" has been processed and analyzed with AI.
              </p>
              
              {/* File Processing Results */}
              {processedContent && (
                <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                  <div className="flex items-center mb-2">
                    {getFileIcon(processedContent.type)}
                    <span className="ml-2 font-medium text-gray-900 capitalize">
                      {processedContent.type} Content Analysis
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto whitespace-pre-wrap">
                    {processedContent.content.substring(0, 300)}
                    {processedContent.content.length > 300 && '...'}
                  </div>
                </div>
              )}

              {/* AI Analysis Results */}
              {aiAnalysis && Object.keys(aiAnalysis).length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                  <div className="flex items-center mb-2">
                    <Brain className="w-6 h-6 text-blue-600" />
                    <span className="ml-2 font-medium text-gray-900">AI Analysis Results</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {aiAnalysis.company && (
                      <div>
                        <span className="font-medium text-gray-700">Company: </span>
                        <span className="text-gray-600">{aiAnalysis.company.name || 'Detected'}</span>
                      </div>
                    )}
                    {aiAnalysis.founders && aiAnalysis.founders.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Founders: </span>
                        <span className="text-gray-600">{aiAnalysis.founders.length} detected</span>
                      </div>
                    )}
                    {aiAnalysis.metrics && aiAnalysis.metrics.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Metrics: </span>
                        <span className="text-gray-600">{aiAnalysis.metrics.length} KPIs extracted</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Database Results */}
              {dbResult && (
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center mb-2">
                    <Database className="w-6 h-6 text-purple-600" />
                    <span className="ml-2 font-medium text-gray-900">Database Results</span>
                  </div>
                  <div className="text-sm">
                    {dbResult.success ? (
                      <div>
                        <p className="text-green-600 font-medium mb-1">✅ Data saved successfully!</p>
                        {dbResult.insertedTables.length > 0 && (
                          <p className="text-gray-600">
                            Updated tables: {dbResult.insertedTables.join(', ')}
                          </p>
                        )}
                        {dbResult.companyId && (
                          <p className="text-gray-600">Company ID: {dbResult.companyId}</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-amber-600 font-medium mb-1">⚠️ Partial save</p>
                        {dbResult.errors.length > 0 && (
                          <div className="text-gray-600">
                            {dbResult.errors.slice(0, 2).map((error, i) => (
                              <p key={i} className="text-xs">• {error}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
              {errorMessage || 'Please ensure your file is a supported format and try again.'}
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