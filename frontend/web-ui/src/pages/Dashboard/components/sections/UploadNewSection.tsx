import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { ArrowLeft, CheckCircle, FileText, Globe, Image, X } from 'lucide-react';

import { contentTypes } from '../../data/mockData';

interface UploadNewSectionProps {
onSuccess: () => void;
}

export function UploadNewSection({ onSuccess }: UploadNewSectionProps) {
const [url, setUrl] = useState('');
const [description, setDescription] = useState('');
const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
const [className, setClassName] = useState('');
const [term, setTerm] = useState('');
const [professor, setProfessor] = useState('');
const [type, setType] = useState('');
const [showReview, setShowReview] = useState(false);
const [done, setDone] = useState(false);

const resetForm = () => {
	setDone(false);
	setShowReview(false);
	setUrl('');
	setDescription('');
	setSelectedFiles([]);
	setClassName('');
	setTerm('');
	setProfessor('');
	setType('');
};

const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
	const files = e.currentTarget.files;

	if (!files) return;

	setSelectedFiles(prev => [...prev, ...Array.from(files)]);
};

const removeFile = (idx: number) => {
	setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
};

if (done) {
	return (
	<div className="flex flex-col items-center justify-center py-24">
		<div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
		<CheckCircle className="w-8 h-8 text-green-600" />
		</div>
		<h2 className="text-[22px] mb-2">Upload Successful!</h2>
		<p className="text-[14px] text-[#666] mb-6">
		{selectedFiles.length > 0 ? `${selectedFiles.length} file(s) added to ` : 'Content added to '}
		<span className="text-black">{className || 'your library'}</span>.
		</p>
		<div className="flex gap-3">
		<button
			onClick={resetForm}
			className="px-4 py-2 text-[13px] rounded-lg border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors"
		>
			Upload More
		</button>
		<button
			onClick={onSuccess}
			className="px-4 py-2 text-[13px] rounded-lg bg-black text-white hover:bg-[#333] transition-colors"
		>
			Go to My Uploads
		</button>
		</div>
	</div>
	);
}

if (showReview) {
	return (
	<div>
		<button
		onClick={() => setShowReview(false)}
		className="flex items-center gap-1.5 text-[13px] text-[#666] hover:text-black transition-colors mb-6"
		>
		<ArrowLeft className="w-4 h-4" /> Back to Edit
		</button>
		<h2 className="text-[22px] mb-6">Review Upload</h2>
		<div className="bg-white rounded-xl border border-[#e5e5e5] p-8 shadow-sm max-w-[800px]">
		<div className="mb-6 pb-6 border-b border-[#e5e5e5]">
			<h3 className="text-[15px] mb-4">Class Information</h3>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[14px]">
			<div>
				<span className="text-[#999] text-[12px]">Class</span>
				<p>{className || 'N/A'}</p>
			</div>
			<div>
				<span className="text-[#999] text-[12px]">Term</span>
				<p>{term || 'N/A'}</p>
			</div>
			<div>
				<span className="text-[#999] text-[12px]">Professor</span>
				<p>{professor || 'N/A'}</p>
			</div>
			<div>
				<span className="text-[#999] text-[12px]">Type</span>
				<p>{type || 'N/A'}</p>
			</div>
			</div>
		</div>

		{url && (
			<div className="mb-6 pb-6 border-b border-[#e5e5e5]">
			<h3 className="text-[15px] mb-2">URL</h3>
			<p className="text-[14px] text-[#666] break-all">{url}</p>
			</div>
		)}

		{description && (
			<div className="mb-6 pb-6 border-b border-[#e5e5e5]">
			<h3 className="text-[15px] mb-2">Description</h3>
			<p className="text-[14px] text-[#666]">{description}</p>
			</div>
		)}

		{selectedFiles.length > 0 && (
			<div className="mb-6">
			<h3 className="text-[15px] mb-3">Files ({selectedFiles.length})</h3>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
				{selectedFiles.map((file, idx) => {
				const isImage = file.type.startsWith('image/');
				return (
					<div key={idx} className="border border-[#e5e5e5] rounded-lg overflow-hidden">
					{isImage ? (
						<img
						src={URL.createObjectURL(file)}
						alt={file.name}
						className="w-full h-36 object-cover"
						/>
					) : (
						<div className="w-full h-36 bg-[#f9f9f9] flex items-center justify-center">
						<FileText className="w-10 h-10 text-[#ccc]" />
						</div>
					)}
					<div className="p-3">
						<p className="text-[12px] text-black truncate">{file.name}</p>
						<p className="text-[11px] text-[#999]">{(file.size / 1024).toFixed(1)} KB</p>
					</div>
					</div>
				);
				})}
			</div>
			</div>
		)}

		<div className="flex gap-3 pt-4 border-t border-[#e5e5e5]">
			<button
			onClick={() => setShowReview(false)}
			className="flex-1 px-6 py-3 rounded-lg border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors text-[14px]"
			>
			Back to Edit
			</button>
			<button
			onClick={() => setDone(true)}
			className="flex-1 px-6 py-3 rounded-lg bg-black text-white hover:bg-[#333] transition-colors text-[14px]"
			>
			Confirm Upload
			</button>
		</div>
		</div>
	</div>
	);
}

return (
	<div>
	<div className="flex items-center gap-3 mb-6">
		<h2 className="text-[22px]">Upload New Content</h2>
	</div>

	<form
		onSubmit={e => {
		e.preventDefault();
		setShowReview(true);
		}}
		className="space-y-4 max-w-[800px]"
	>
		<div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm">
		<h3 className="text-[14px] text-[#666] mb-4">Class Information</h3>
		<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
			<div>
			<label className="block text-[12px] text-[#999] mb-1.5">Class Name</label>
			<input
				type="text"
				value={className}
				onChange={e => setClassName(e.target.value)}
				placeholder="e.g. CS 101"
				className="w-full px-3 py-2 text-[14px] text-black placeholder:text-[#bbb] border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
			/>
			</div>
			<div>
			<label className="block text-[12px] text-[#999] mb-1.5">Term</label>
			<input
				type="text"
				value={term}
				onChange={e => setTerm(e.target.value)}
				placeholder="e.g. Fall 2026"
				className="w-full px-3 py-2 text-[14px] text-black placeholder:text-[#bbb] border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
			/>
			</div>
			<div>
			<label className="block text-[12px] text-[#999] mb-1.5">Professor</label>
			<input
				type="text"
				value={professor}
				onChange={e => setProfessor(e.target.value)}
				placeholder="e.g. Dr. Smith"
				className="w-full px-3 py-2 text-[14px] text-black placeholder:text-[#bbb] border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
			/>
			</div>
			<div>
			<label className="block text-[12px] text-[#999] mb-1.5">Type</label>
			<select
				value={type}
				onChange={e => setType(e.target.value)}
				className="w-full px-3 py-2 text-[14px] text-black border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
			>
				<option value="">Select type</option>
				{contentTypes.map(item => (
				<option key={item} value={item}>
					{item}
				</option>
				))}
			</select>
			</div>
		</div>
		</div>

		<div className="bg-white rounded-xl border border-[#e5e5e5] p-5 shadow-sm">
		<div className="flex items-center gap-3">
			<div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center flex-shrink-0">
			<Globe className="w-4 h-4 text-white" />
			</div>
			<div className="flex-1">
			<input
				type="url"
				value={url}
				onChange={e => setUrl(e.target.value)}
				placeholder="https://example.com"
				className="w-full text-[14px] text-black placeholder:text-[#bbb] focus:outline-none"
			/>
			<p className="text-[11px] text-[#bbb] mt-0.5">Optional URL to include</p>
			</div>
		</div>
		</div>

		<div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm">
		<textarea
			value={description}
			onChange={e => setDescription(e.target.value)}
			placeholder="Add a description or context..."
			className="w-full text-[14px] text-black placeholder:text-[#bbb] focus:outline-none resize-none h-10 mb-5"
		/>

		<label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#666] hover:text-black transition-colors w-fit mb-1">
			<input
			type="file"
			accept="image/*,.pdf"
			onChange={handleFileChange}
			multiple
			className="hidden"
			/>
			<span className="text-lg leading-none">+</span>
			<span className="px-2 py-1 border border-[#e5e5e5] rounded text-[13px]">Attach Files</span>
		</label>
		<p className="text-[11px] text-[#bbb] mb-4">Images and PDFs supported</p>

		{selectedFiles.length > 0 && (
			<div className="space-y-2 mb-4">
			{selectedFiles.map((file, idx) => (
				<div key={idx} className="flex items-center justify-between p-2.5 bg-[#f9f9f9] rounded-lg">
				<div className="flex items-center gap-2">
					{file.type.startsWith('image/') ? (
					<Image className="w-4 h-4 text-blue-400" />
					) : (
					<FileText className="w-4 h-4 text-red-400" />
					)}
					<span className="text-[13px] text-black truncate max-w-[300px]">{file.name}</span>
					<span className="text-[11px] text-[#999]">{(file.size / 1024).toFixed(1)} KB</span>
				</div>
				<button
					type="button"
					onClick={() => removeFile(idx)}
					className="text-[#bbb] hover:text-red-500 transition-colors ml-2"
				>
					<X className="w-4 h-4" />
				</button>
				</div>
			))}
			</div>
		)}

		<div className="flex justify-end pt-2 border-t border-[#f0f0f0]">
			<button
			type="submit"
			disabled={!url && selectedFiles.length === 0 && !description}
			className="flex items-center gap-2 px-5 py-2 rounded-lg bg-black text-white text-[13px] hover:bg-[#333] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
			>
			Review Upload →
			</button>
		</div>
		</div>
	</form>
	</div>
);
}
