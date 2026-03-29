import React, { useState } from 'react';

export const UploadFile = () => {
    const [url] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };



    return (
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm">
                {/* File Upload Button */}
                <div className="flex items-center gap-3 pb-4 border-b border-[#f0f0f0]">
                  <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#666] hover:text-black transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="text-lg">+</span>
                    <span className="px-2 py-1 border border-[#e5e5e5] rounded">
                      {selectedFile ? selectedFile.name : 'Upload File'}
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={!url && !selectedFile && !description}
                    className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#333] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
              </div>
    )

}