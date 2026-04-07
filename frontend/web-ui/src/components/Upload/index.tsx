import { useEffect, useState } from 'react';
import { FileText, X } from 'lucide-react';
import axios from 'axios';

import FileUploadService from "../../services/FileUpload.service"

// Types
interface UploadFormProps {
  url: string;
  setUrl: (url: string) => void;
  submitError: string;
  description: string;
  selectedFiles: File[];
  className: string;
  setClassName: (name: string) => void;
  term: string;
  setTerm: (term: string) => void;
  professor: string;
  setProfessor: (prof: string) => void;
  type: string;
  setType: (type: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

interface ReviewPageProps {
  url: string;
  description: string;
  selectedFiles: File[];
  className: string;
  term: string;
  professor: string;
  type: string;
  onBack: () => void;
  onConfirm: () => void;
}

interface SuccessPageProps {
  className: string;
  type: string;
  fileCount: number;
  onReset: () => void;
}

// Upload Form Component
function UploadFormPage({
  url,
  setUrl,
  submitError,
  description,
  selectedFiles,
  className,
  setClassName,
  term,
  setTerm,
  professor,
  setProfessor,
  type,
  setType,
  onSubmit,
  onFileChange,
  onRemoveFile,
}: UploadFormProps) {
  const contentTypes = ['Quiz', 'Midterm', 'Final', 'Practice Problems'];

  return (
    <div className="w-full max-w-[900px]">
      <h1 className="text-center text-[32px] leading-tight mb-16">
        Upload content
      </h1>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Course Information Section */}
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="className" className="block text-[13px] text-[#666] mb-2">
                Course
              </label>
              <input
                id="className"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. CS 101"
                className="w-full px-3 py-2 text-[14px] text-black placeholder:text-[#999] border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label htmlFor="term" className="block text-[13px] text-[#666] mb-2">
                Term
              </label>
              <input
                id="term"
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. Fall 2026"
                className="w-full px-3 py-2 text-[14px] text-black placeholder:text-[#999] border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label htmlFor="professor" className="block text-[13px] text-[#666] mb-2">
                Professor
              </label>
              <input
                id="professor"
                type="text"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                placeholder="e.g. Dr. Smith"
                className="w-full px-3 py-2 text-[14px] text-black placeholder:text-[#999] border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-[13px] text-[#666] mb-2">
                Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 text-[14px] text-black border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select type</option>
                {contentTypes.map((contentType) => (
                  <option key={contentType} value={contentType}>
                    {contentType}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* URL Upload Section */}
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded bg-transparent flex items-center justify-center flex-shrink-0 mt-0.5">
                  { /* image source from supabase image  */ }
                <img src="https://peurtwpqjoapzezkhrfq.supabase.co/storage/v1/object/public/assests/crowdmark-logo-icon.png" alt="Link icon" className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://app.crowdmark.com/..."
                className="w-full text-[14px] text-black placeholder:text-[#999] focus:outline-none mb-1"
              />
              <p className="text-[12px] text-[#999]">Enter a URL to upload</p>
              {submitError && <p className="text-[12px] text-red-600 mt-1">{submitError}</p>}
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm">

          {/* File Upload Button */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#666] hover:text-black transition-colors w-fit">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={onFileChange}
                multiple
                className="hidden"
              />
              <span className="text-lg">+</span>
              <span className="px-2 py-1 border border-[#e5e5e5] rounded">
                Upload Files
              </span>
            </label>
            <p className="text-[11px] text-[#999] mt-2">Select multiple files at once</p>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="pb-4 border-b border-[#f0f0f0]">
              <p className="text-[13px] text-[#666] mb-3">{selectedFiles.length} file(s) selected:</p>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-[#f9f9f9] rounded">
                    <span className="text-[13px] text-black truncate flex-1">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveFile(index)}
                      className="ml-2 text-[#999] hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={!url && selectedFiles.length === 0 && !description}
              className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#333] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}


const PreviewImage = () => {
  const getStoredImageUrls = (): string[] => {
    const stored = localStorage.getItem("imageUrls");

    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter((url): url is string => typeof url === "string");
      }
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "response" in parsed &&
        typeof (parsed as { response?: unknown }).response === "object" &&
        (parsed as { response?: unknown }).response !== null
      ) {
        const response = (parsed as { response: { public_urls?: unknown } }).response;
        if (Array.isArray(response.public_urls)) {
          return response.public_urls.filter((url): url is string => typeof url === "string");
        }
      }
      return [];
    } catch {
      return [];
    }
  };

  const [imageUrls, setImageUrls] = useState<string[]>(() => getStoredImageUrls());

  useEffect(() => {
    const syncImages = () => setImageUrls(getStoredImageUrls());
    window.addEventListener("storage", syncImages);
    syncImages();

    return () => {
      window.removeEventListener("storage", syncImages);
    };
  }, []);

  if (imageUrls.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-[18px] mb-2">Processed Images</h3>
        <p className="text-[14px] text-[#666]">No images found in local storage yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-[18px] mb-4">Processed Images ({imageUrls.length})</h3>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {imageUrls.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="mb-4 break-inside-avoid border border-[#e5e5e5] rounded-sm overflow-hidden bg-white"
          >
            <img
              src={url}
              alt={`Processed upload ${index + 1}`}
              className="block w-full h-auto"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Review Page Component
function ReviewPage({
  url,
  selectedFiles,
  className,
  term,
  professor,
  type,
  onBack,
  onConfirm,
}: ReviewPageProps) {
  return (
    <div className="w-full max-w-[900px]">
      <h1 className="text-center text-[32px] leading-tight mb-8">
        Review your upload
      </h1>

      <div className="bg-white rounded-xl border border-[#e5e5e5] p-8 shadow-sm">
        {/* Class Information */}
        <div className="mb-6 pb-6 border-b border-[#e5e5e5]">
          <h3 className="text-[18px] mb-4">Class Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[14px]">
            <div>
              <span className="text-[#999]">Class:</span>
              <p className="text-black">{className || 'N/A'}</p>
            </div>
            <div>
              <span className="text-[#999]">Term:</span>
              <p className="text-black">{term || 'N/A'}</p>
            </div>
            <div>
              <span className="text-[#999]">Professor:</span>
              <p className="text-black">{professor || 'N/A'}</p>
            </div>
            <div>
              <span className="text-[#999]">Type:</span>
              <p className="text-black">{type || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* URL */}
        {url && (
          <div className="mb-6 pb-6 border-b border-[#e5e5e5]">
            <h3 className="text-[18px] mb-2">URL</h3>
            <p className="text-[14px] text-[#666] break-all">{url}</p>
          </div>
        )}

        {/* Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[18px] mb-4">Files ({selectedFiles.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedFiles.map((file, index) => {
                const isImage = file.type.startsWith('image/');
                const isPDF = file.type === 'application/pdf';
                const fileUrl = URL.createObjectURL(file);

                return (
                  <div key={index} className="border border-[#e5e5e5] rounded-lg overflow-hidden">
                    {isImage ? (
                      <img
                        src={fileUrl}
                        alt={file.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : isPDF ? (
                      <div className="w-full h-48 bg-[#f9f9f9] flex items-center justify-center">
                        <FileText className="w-12 h-12 text-[#999]" />
                      </div>
                    ) : null}
                    <div className="p-3 bg-white">
                      <p className="text-[13px] text-black truncate">{file.name}</p>
                      <p className="text-[11px] text-[#999]">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <PreviewImage />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-[#e5e5e5]">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 rounded-lg border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors text-[14px]"
          >
            Back to Edit
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-lg bg-black text-white hover:bg-[#333] transition-colors text-[14px]"
          >
            Confirm Upload
          </button>
        </div>
      </div>
    </div>
  );
}

// Success Page Component
function SuccessPage({ className, type, fileCount, onReset }: SuccessPageProps) {
  return (
    <div className="w-full max-w-[520px]">
      <div className="bg-white rounded-xl border border-[#e5e5e5] p-8 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-[24px] mb-3">Upload Successful!</h2>
        <p className="text-[14px] text-[#666] mb-6">
          Your {fileCount} file(s) have been uploaded successfully.
        </p>

        <div className="p-4 bg-[#f9f9f9] rounded-lg mb-6 text-left">
          <p className="text-[12px] text-[#999] mb-1">Summary</p>
          <p className="text-[13px]">Class: {className || 'N/A'}</p>
          <p className="text-[13px]">Type: {type || 'N/A'}</p>
          <p className="text-[13px]">Files: {fileCount}</p>
        </div>

        <button
          onClick={onReset}
          className="w-full px-4 py-2.5 text-[13px] rounded-lg bg-black text-white hover:bg-[#333] transition-colors"
        >
          Upload More Content
        </button>
      </div>
    </div>
  );
}

// Main App Component
export default function Upload() {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [className, setClassName] = useState('');
  const [term, setTerm] = useState('');
  const [professor, setProfessor] = useState('');
  const [type, setType] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const getUploadErrorMessage = (data: unknown): string | null => {
    if (!data || typeof data !== "object") {
      return null;
    }

    const payload = data as Record<string, unknown>;
    const messageCandidates = [
      payload.CM_url,
      payload.detail,
      payload.message,
      payload.non_field_errors,
    ];

    for (const candidate of messageCandidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate;
      }

      if (Array.isArray(candidate)) {
        const firstText = candidate.find((item): item is string => typeof item === "string" && item.trim().length > 0);
        if (firstText) {
          return firstText;
        }
      }
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    try {
      const { message, response } = await FileUploadService.sendCMUrl(url);
      console.log("API message:", message);
      console.log("Public URLs:", response.public_urls);
      console.log("Uploaded files:", response.uploads);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage = getUploadErrorMessage(error.response?.data);
        setSubmitError(serverMessage ?? "Unable to process this Crowdmark URL. Please verify the link is directly shareable.");
      } else {
        setSubmitError("Unable to process this Crowdmark URL. Please try again.");
      }
      console.error("Failed to process Crowdmark URL", error);
      return;
    }

    setShowPreview(true);
  };

  const handleConfirmUpload = () => {
    setUploadComplete(true);
    console.log('Final upload confirmed:', {
      url,
      description,
      files: selectedFiles,
      className,
      term,
      professor,
      type
    });
  };

  const handleClearResult = () => {
    setUploadComplete(false);
    setShowPreview(false);
    setUrl('');
    setDescription('');
    setSelectedFiles([]);
    setClassName('');
    setTerm('');
    setProfessor('');
    setType('');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">

      {/* Announcement Bar */}
      <div className="w-full py-2.5 bg-white border-b border-[#e5e5e5] text-center">
        <p className="text-[13px] text-[#666]">
          Sign up now!→
        </p>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        {!showPreview && !uploadComplete ? (
          <UploadFormPage
            url={url}
            setUrl={(nextUrl) => {
              setUrl(nextUrl);
              if (submitError) {
                setSubmitError('');
              }
            }}
            submitError={submitError}
            description={description}
            selectedFiles={selectedFiles}
            className={className}
            setClassName={setClassName}
            term={term}
            setTerm={setTerm}
            professor={professor}
            setProfessor={setProfessor}
            type={type}
            setType={setType}
            onSubmit={handleSubmit}
            onFileChange={handleFileChange}
            onRemoveFile={removeFile}
          />
        ) : showPreview && !uploadComplete ? (
          <ReviewPage
            url={url}
            description={description}
            selectedFiles={selectedFiles}
            className={className}
            term={term}
            professor={professor}
            type={type}
            onBack={() => setShowPreview(false)}
            onConfirm={handleConfirmUpload}
          />
        ) : (
          <SuccessPage
            className={className}
            type={type}
            fileCount={selectedFiles.length}
            onReset={handleClearResult}
          />
        )}
      </main>

    </div>
  );
}
