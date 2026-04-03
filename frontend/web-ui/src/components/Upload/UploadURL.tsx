import { useState } from 'react';

export const UploadURL = () => {
    const [url, setUrl] = useState('');

    return (
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
                    placeholder="https://app.crowdmark.com/score/..."
                    className="w-full text-[14px] text-black placeholder:text-[#999] focus:outline-none mb-1"
                />
                <p className="text-[12px] text-[#999]">Enter a Crowdmark Sharable URL to upload</p>
                </div>
            </div>
        </div>
    )
}
