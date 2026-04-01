import React, { useState } from 'react';

export const UploadDetails = () => {
    const [className, setClass] = useState('');
    const [term, setTerm] = useState('');
    const [professor, setProfessor] = useState('');
    const [type, setType] = useState('');

    const contentTypes = ['Quiz', 'Midterm', 'Final', 'Practice Problems'];


    return (
    <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label htmlFor="className" className="block text-[13px] text-[#666] mb-2">
                    Class Name
                </label>
                <input
                    id="className"
                    type="text"
                    value={className}
                    onChange={(e) => setClass(e.target.value)}
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
    )
}