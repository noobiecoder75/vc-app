import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle, FileText, Image, BarChart3, Brain, Database, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { createWorker } from 'tesseract.js';
import { analyzeStartupContent, StartupAnalysis } from '../lib/openaiClient';
import { insertStartupData, DatabaseInsertResult } from '../lib/databaseService';
import LiveKPIChart from './LiveKPIChart';
import FeatureGate from './FeatureGate';
import { useFeatureGateWithUsage } from '../hooks/useFeatureGate';

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
  const [aiError, setAiError] = useState<string>('');
  const [dbResult, setDbResult] = useState<DatabaseInsertResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showKPIChart, setShowKPIChart] = useState(false);

  // Feature gating for validations
  const validationGate = useFeatureGateWithUsage('validations');

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
        supportedTypes: ['CSV', 'TXT', 'Images']
      });
      throw unsupportedError;
    }
  };

  // Helper function to check if analysis object is empty or has no meaningful data
  const isAnalysisEmpty = (analysis: StartupAnalysis): boolean => {
    if (!analysis || typeof analysis !== 'object') return true;
    
    // Check if object is completely empty
    if (Object.keys(analysis).length === 0) return true;
    
    // Check if all properties are empty/null/undefined
    const hasCompany = analysis.company && typeof analysis.company === 'object' && 
                      (analysis.company.name || analysis.company.pitch_deck_summary);
    const hasFounders = analysis.founders && Array.isArray(analysis.founders) && analysis.founders.length > 0;
    const hasMetrics = analysis.metrics && Array.isArray(analysis.metrics) && analysis.metrics.length > 0;
    const hasPitchDeck = analysis.pitch_deck && typeof analysis.pitch_deck === 'object';
    const hasFinancialModel = analysis.financial_model && typeof analysis.financial_model === 'object';
    const hasVcFitReport = analysis.vc_fit_report && typeof analysis.vc_fit_report === 'object';
    const hasGoToMarket = analysis.go_to_market && typeof analysis.go_to_market === 'object';
    
    return !(hasCompany || hasFounders || hasMetrics || hasPitchDeck || hasFinancialModel || hasVcFitReport || hasGoToMarket);
  };

  // Create basic analysis from processed content if AI fails
  const createBasicAnalysis = (processed: ProcessedContent): StartupAnalysis => {
    const analysis: StartupAnalysis = {};

    // Try to extract basic company info from content
    const content = processed.content.toLowerCase();
    
    // Create a basic company entry
    analysis.company = {
      name: processed.metadata?.fileName || 'Startup from Upload',
      pitch_deck_summary: `Processed ${processed.type} file with ${processed.metadata?.wordCount || 0} words`
    };

    // If it's CSV data, try to create metrics
    if (processed.type === 'csv' && processed.metadata?.fullData) {
      analysis.metrics = [];
      const rows = processed.metadata.fullData.slice(0, 10); // First 10 rows
      
      rows.forEach((row: any, index: number) => {
        Object.entries(row).forEach(([key, value]: [string, any]) => {
          const numValue = parseFloat(value);
          if (!isNaN(numValue) && key.toLowerCase().includes('revenue' || 'users' || 'growth' || 'conversion')) {
            analysis.metrics?.push({
              metric_name: key,
              metric_value: numValue,
              metric_unit: key.toLowerCase().includes('revenue') ? 'USD' : key.toLowerCase().includes('rate') ? '%' : 'count'
            });
          }
        });
      });
    }

    return analysis;
  };

  const handleFiles = async (files: FileList) => {
    // Check feature gate before proceeding
    if (!validationGate.allowed) {
      setUploadStatus('error');
      setErrorMessage(`You've reached your validation limit. ${validationGate.unlimited ? 'Upgrade to continue.' : `You've used ${validationGate.currentUsage} of ${validationGate.limitValue} validations this month.`}`);
      return;
    }

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
      'text/csv'
    ];
    const allowedExtensions = ['.txt', '.csv', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    
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
      setErrorMessage('Unsupported file type. Please upload a CSV, TXT, or Image file.');
      return;
    }

    setUploading(true);
    setProcessing(true);
    setAiAnalyzing(false);
    setSavingToDb(false);
    setUploadStatus('idle');
    setErrorMessage('');
    setAiError('');
    setProcessedContent(null);
    setAiAnalysis(null);
    setDbResult(null);
    setShowKPIChart(false);

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

      // Step 2: Try AI analysis, but continue even if it fails
      setAiAnalyzing(true);
      console.log(`🤖 Starting AI analysis...`);
      
      let finalAnalysis: StartupAnalysis;
      
      try {
        const analysis = await analyzeStartupContent(
          processed.content, 
          processed.type, 
          processed.metadata
        );
        
        // Check if the analysis is empty and throw error to trigger fallback
        if (isAnalysisEmpty(analysis)) {
          throw new Error('AI returned empty analysis - no meaningful data extracted');
        }
        
        setAiAnalysis(analysis);
        finalAnalysis = analysis;
        console.log(`✅ AI analysis completed:`, analysis);
      } catch (aiError) {
        logError('AI Analysis', aiError, { processedContent: processed });
        console.warn('⚠️ AI analysis failed, creating basic analysis instead:', aiError);
        
        // Set error message for user
        const errorMsg = aiError instanceof Error ? aiError.message : 'Unknown AI error';
        setAiError(`AI analysis unavailable: ${errorMsg}. Using basic analysis instead.`);
        
        // Create basic analysis from processed content
        finalAnalysis = createBasicAnalysis(processed);
        setAiAnalysis(finalAnalysis);
      }
      setAiAnalyzing(false);

      // Step 3: Save to database (now with either AI or basic analysis)
      setSavingToDb(true);
      console.log(`💾 Starting database save with analysis:`, finalAnalysis);
      
      const dbInsertResult = await insertStartupData(finalAnalysis);
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
          aiAnalysis: finalAnalysis || {},
          dbResult: dbResult || {},
          aiError: aiError || null
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
      
      // Track feature usage after successful analysis
      await validationGate.useFeature(1);
      
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

  // Show KPI Chart if requested
  if (showKPIChart && dbResult?.companyId) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setShowKPIChart(false)}
            className="px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 rounded-lg transition-colors"
          >
            ← Back to Upload
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Live KPI Dashboard</h2>
        </div>
        <LiveKPIChart 
          companyId={dbResult.companyId} 
          companyName={aiAnalysis?.company?.name}
        />
      </div>
    );
  }

  return (
    <FeatureGate
      featureName="validations"
      featureDisplayName="Startup Validations"
      requiredPlan="Professional"
      showUsage={true}
    >
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
            accept=".txt,.csv,.jpg,.jpeg,.png,.gif,.bmp,.webp"
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
                  
                  <div className={`flex items-center justify-center space-x-2 text-sm ${aiAnalyzing ? 'text-blue-600' : aiAnalysis ? 'text-green-600' : aiError ? 'text-amber-600' : 'text-gray-400'}`}>
                    <Brain className="w-4 h-4" />
                    <span>{aiError ? 'Basic Analysis' : 'AI Analysis'}</span>
                    {aiAnalysis && <CheckCircle className="w-4 h-4" />}
                    {aiError && <AlertCircle className="w-4 h-4" />}
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
              <span className="bg-gray-100 px-3 py-1 rounded-full">Images</span>
            </div>
          </div>
        </div>

        {/* AI Error Warning */}
        {aiError && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
              <div>
                <p className="text-amber-800 font-medium">AI Analysis Unavailable</p>
                <p className="text-amber-700 text-sm mb-2">{aiError}</p>
                <p className="text-amber-600 text-xs">
                  To enable AI analysis, make sure you have set your OpenAI API key in the environment variables.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {uploadStatus === 'success' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
              <div className="flex-1">
                <p className="text-green-800 font-medium">Upload and analysis successful!</p>
                <p className="text-green-700 text-sm mb-3">
                  File "{uploadedFile}" has been processed and analyzed.
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
                      <span className="ml-2 font-medium text-gray-900">
                        {aiError ? 'Basic Analysis Results' : 'AI Analysis Results'}
                      </span>
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
                  <div className="bg-white rounded-lg p-4 border border-purple-200 mb-4">
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

                {/* KPI Chart Button */}
                {dbResult?.companyId && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowKPIChart(true)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold flex items-center justify-center"
                    >
                      <TrendingUp className="w-5 h-5 mr-2" />
                      View Live KPI Dashboard
                    </button>
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
    </FeatureGate>
  );
};

export default FileUpload;