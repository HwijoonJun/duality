import { FileText, Image, Link, Upload } from 'lucide-react';

import { mockUploads } from '../../data/mockData';

interface MyUploadsSectionProps {
onUploadNew: () => void;
}

export function MyUploadsSection({ onUploadNew }: MyUploadsSectionProps) {
const iconFor = (type: string) => {
	if (type === 'pdf') return <FileText className="w-4 h-4 text-red-400" />;
	if (type === 'image') return <Image className="w-4 h-4 text-blue-400" />;
	return <Link className="w-4 h-4 text-green-400" />;
};

return (
	<div>
	<div className="flex items-center justify-between mb-6">
		<div>
		<h2 className="text-[22px]">My Uploads</h2>
		<p className="text-[13px] text-[#999] mt-0.5">{mockUploads.length} files uploaded</p>
		</div>
		<button
		onClick={onUploadNew}
		className="flex items-center gap-2 px-4 py-2 text-[13px] rounded-lg bg-black text-white hover:bg-[#333] transition-colors"
		>
		<Upload className="w-3.5 h-3.5" />
		Upload New
		</button>
	</div>

	<div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden">
		<div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-[#f0f0f0] text-[12px] text-[#999]">
		<span>Type</span>
		<span>Name</span>
		<span>Class</span>
		<span>Size</span>
		<span>Date</span>
		</div>
		{mockUploads.map((file, index) => (
		<div
			key={file.id}
			className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3.5 items-center text-[13px] hover:bg-[#fafafa] transition-colors cursor-pointer ${
			index < mockUploads.length - 1 ? 'border-b border-[#f5f5f5]' : ''
			}`}
		>
			<span>{iconFor(file.type)}</span>
			<span className="truncate text-black">{file.name}</span>
			<span className="text-[#999] text-[12px] whitespace-nowrap">{file.className}</span>
			<span className="text-[#999] text-[12px] whitespace-nowrap">{file.size}</span>
			<span className="text-[#999] text-[12px] whitespace-nowrap">{file.date}</span>
		</div>
		))}
	</div>
	</div>
);
}
