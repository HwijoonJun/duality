import { useState } from 'react';
import { ArrowLeft, BookOpen, Clock, Download, FileText, Globe, User, X } from 'lucide-react';

import type { TestFile, TestItem } from '../../types';
import { handleFileDownload } from '../../utils/fileActions';
import { TypeBadge } from '../TypeBadge';

interface TestDetailSectionProps {
test: TestItem;
onBack: () => void;
}

export function TestDetailSection({ test, onBack }: TestDetailSectionProps) {
const [lightboxFile, setLightboxFile] = useState<TestFile | null>(null);

const imageFiles = test.fileList.filter(file => file.type === 'image');
const otherFiles = test.fileList.filter(file => file.type !== 'image');

return (
	<div>
	<div className="flex items-center gap-3 mb-6">
		<button
		onClick={onBack}
		className="flex items-center gap-1.5 text-[13px] text-[#666] hover:text-black transition-colors"
		>
		<ArrowLeft className="w-4 h-4" />
		Back to My Tests
		</button>
	</div>

	<div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm mb-6">
		<div className="flex items-start justify-between">
		<div>
			<div className="flex items-center gap-2 mb-2">
			<span className="text-[13px] text-[#666]">{test.className}</span>
			<TypeBadge type={test.type} />
			</div>
			<h2 className="text-[22px] mb-3">{test.title}</h2>
			<div className="flex items-center gap-5 text-[13px] text-[#999]">
			<span className="flex items-center gap-1.5">
				<User className="w-3.5 h-3.5" />
				{test.professor}
			</span>
			<span className="flex items-center gap-1.5">
				<BookOpen className="w-3.5 h-3.5" />
				{test.term}
			</span>
			<span className="flex items-center gap-1.5">
				<Clock className="w-3.5 h-3.5" />
				{test.date}
			</span>
			<span className="flex items-center gap-1.5">
				<FileText className="w-3.5 h-3.5" />
				{test.files} file{test.files !== 1 ? 's' : ''}
			</span>
			</div>
		</div>
		<button
			onClick={() => test.fileList.forEach(handleFileDownload)}
			className="flex items-center gap-2 px-4 py-2 text-[13px] rounded-lg bg-black text-white hover:bg-[#333] transition-colors"
		>
			<Download className="w-4 h-4" />
			Download All
		</button>
		</div>
	</div>

	{imageFiles.length > 0 && (
		<div className="mb-6">
		<h3 className="text-[15px] text-[#666] mb-3">
			Images <span className="text-[#bbb]">({imageFiles.length})</span>
		</h3>
		<div className="space-y-4">
			{imageFiles.map((file, idx) => (
			<div
				key={file.id}
				className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden shadow-sm group"
			>
				<div
				className="relative cursor-zoom-in"
				onClick={() => setLightboxFile(file)}
				>
				<img
					src={file.previewUrl}
					alt={file.name}
					className="w-full object-cover max-h-[560px]"
					style={{ display: 'block' }}
				/>
				<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
					<span className="opacity-0 group-hover:opacity-100 bg-white/90 text-black text-[12px] px-3 py-1.5 rounded-lg transition-opacity">
					Click to enlarge
					</span>
				</div>
				</div>
				<div className="flex items-center justify-between px-5 py-3 border-t border-[#f0f0f0]">
				<div className="flex items-center gap-2">
					<span className="text-[13px] text-[#999]">Page {idx + 1}</span>
					<span className="text-[#e0e0e0]">·</span>
					<span className="text-[13px] text-black">{file.name}</span>
					<span className="text-[#e0e0e0]">·</span>
					<span className="text-[12px] text-[#999]">{file.size}</span>
				</div>
				<button
					onClick={() => handleFileDownload(file)}
					className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-lg border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors"
				>
					<Download className="w-3.5 h-3.5" />
					Download
				</button>
				</div>
			</div>
			))}
		</div>
		</div>
	)}

	{otherFiles.length > 0 && (
		<div>
		<h3 className="text-[15px] text-[#666] mb-3">
			Other Files <span className="text-[#bbb]">({otherFiles.length})</span>
		</h3>
		<div className="space-y-2">
			{otherFiles.map(file => (
			<div
				key={file.id}
				className="bg-white rounded-xl border border-[#e5e5e5] px-5 py-4 shadow-sm flex items-center justify-between hover:border-[#d0d0d0] transition-colors"
			>
				<div className="flex items-center gap-3">
				{file.type === 'pdf' ? (
					<div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
					<FileText className="w-5 h-5 text-red-400" />
					</div>
				) : (
					<div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
					<Globe className="w-5 h-5 text-green-500" />
					</div>
				)}
				<div>
					<p className="text-[14px] text-black truncate max-w-[400px]">{file.name}</p>
					<p className="text-[12px] text-[#999]">
					{file.type === 'pdf' ? `PDF · ${file.size}` : 'External URL'}
					</p>
				</div>
				</div>
				<button
				onClick={() => handleFileDownload(file)}
				className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-lg border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors whitespace-nowrap"
				>
				<Download className="w-3.5 h-3.5" />
				{file.type === 'url' ? 'Open Link' : 'Download'}
				</button>
			</div>
			))}
		</div>
		</div>
	)}

	{lightboxFile && (
		<div
		className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
		onClick={() => setLightboxFile(null)}
		>
		<div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
			<button
			onClick={() => setLightboxFile(null)}
			className="absolute -top-10 right-0 text-white/80 hover:text-white flex items-center gap-1.5 text-[13px]"
			>
			<X className="w-5 h-5" /> Close
			</button>
			<img
			src={lightboxFile.previewUrl}
			alt={lightboxFile.name}
			className="w-full max-h-[85vh] object-contain rounded-xl"
			/>
			<div className="mt-3 flex items-center justify-between">
			<span className="text-white/70 text-[13px]">
				{lightboxFile.name} · {lightboxFile.size}
			</span>
			<button
				onClick={() => handleFileDownload(lightboxFile)}
				className="flex items-center gap-1.5 px-4 py-2 text-[13px] rounded-lg bg-white text-black hover:bg-[#f0f0f0] transition-colors"
			>
				<Download className="w-4 h-4" />
				Download
			</button>
			</div>
		</div>
		</div>
	)}
	</div>
);
}
