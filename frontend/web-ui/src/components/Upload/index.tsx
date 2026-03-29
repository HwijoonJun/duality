import React, { useState } from "react";
import { Globe } from 'lucide-react';

import { UploadFile } from "./UploadFile";
import { UploadDetails } from "./UploadDetails";

export const Upload = () => {
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [className, setClassName] = useState('');
  const [term, setTerm] = useState('');
  const [professor, setProfessor] = useState('');
  const [type, setType] = useState('');
  const [uploadResult, setUploadResult] = useState<{
    type: 'url' | 'file';
    content: string;
    preview?: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (url) {
      setUploadResult({
        type: 'url',
        content: url,
        preview: url
      });
    } else if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setUploadResult({
        type: 'file',
        content: selectedFile.name,
        preview: fileUrl
      });
    }
  };

  const handleClearResult = () => {
    setUploadResult(null);
    setUrl('');
    setSelectedFile(null);
    setClassName('');
    setTerm('');
    setProfessor('');
    setType('');
  };

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col">
        
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        {!uploadResult ? (
            <div className="w-full max-w-[900px]">
                <h1 className="text-center text-[32px] leading-tight mb-16">
                    Upload content
                </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Class Information Section */}
              <UploadDetails />

              {/* Upload URL Section */}
              <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded bg-transparent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <img src="../../src/assets/crowdmark-logo-icon.png" alt="Link icon" className="w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://app.crowdmark.com/score/"
                      className="w-full text-[14px] text-black placeholder:text-[#999] focus:outline-none mb-1"
                    />
                    <p className="text-[12px] text-[#999]">Enter a Crowdmark Sharable URL to upload</p>
                  </div>
                </div>
              </div>

              {/* Upload File Section */}
              <UploadFile />
              
            </form>
          </div>
        ) : (
          <div className="w-full max-w-[520px]">
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-8 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="text-[24px] mb-3">Upload Successful!</h2>
              <p className="text-[14px] text-[#666] mb-6">
                {uploadResult.type === 'url'
                  ? 'Your URL has been processed successfully.'
                  : `Your file "${uploadResult.content}" has been uploaded.`
                }
              </p>

              {uploadResult.preview && (
                <div className="mb-6 rounded-lg overflow-hidden border border-[#e5e5e5]">
                  <img
                    src={uploadResult.preview}
                    alt="Upload preview"
                    className="w-full h-auto max-h-80 object-contain"
                  />
                </div>
              )}

              <div className="p-4 bg-[#f9f9f9] rounded-lg mb-6 text-left">
                <p className="text-[12px] text-[#999] mb-1">Source</p>
                <p className="text-[13px] break-all">{uploadResult.content}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClearResult}
                  className="flex-1 px-4 py-2.5 text-[13px] rounded-lg border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors"
                >
                  Upload Another
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(uploadResult.preview || uploadResult.content);
                  }}
                  className="flex-1 px-4 py-2.5 text-[13px] rounded-lg bg-black text-white hover:bg-[#333] transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
    )

}