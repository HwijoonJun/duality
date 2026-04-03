import type { FormEvent } from 'react';
import { useState } from 'react';
import { Clock, Search, Upload, User } from 'lucide-react';

import { mockSearchResults, mockTests } from '../../data/mockData';
import type { TestItem } from '../../types';
import { TypeBadge } from '../TypeBadge';

interface SearchTestsSectionProps {
onViewTest: (test: TestItem) => void;
}

export function SearchTestsSection({ onViewTest }: SearchTestsSectionProps) {
const [query, setQuery] = useState('');

const handleSearch = (e: FormEvent) => {
	e.preventDefault();
};

return (
	<div>
	<div className="mb-6">
		<h2 className="text-[22px]">Search Tests</h2>
		<p className="text-[13px] text-[#999] mt-0.5">Find tests uploaded by the community</p>
	</div>

	<form onSubmit={handleSearch} className="mb-6">
		<div className="bg-white rounded-xl border border-[#e5e5e5] p-4 shadow-sm flex items-center gap-3">
		<Search className="w-4 h-4 text-[#999] flex-shrink-0" />
		<input
			type="text"
			value={query}
			onChange={e => setQuery(e.target.value)}
			placeholder="Search by class name, professor, or type..."
			className="flex-1 text-[14px] text-black placeholder:text-[#999] focus:outline-none"
		/>
		<button
			type="submit"
			className="px-4 py-1.5 text-[13px] rounded-lg bg-black text-white hover:bg-[#333] transition-colors"
		>
			Search
		</button>
		</div>
	</form>

	<div className="flex gap-2 mb-6 flex-wrap">
		{['All Types', 'Midterm', 'Final', 'Quiz', 'Practice Problems'].map(item => (
		<button
			key={item}
			className="px-3 py-1.5 text-[12px] rounded-lg border border-[#e5e5e5] text-[#666] hover:bg-[#f5f5f5] transition-colors"
		>
			{item}
		</button>
		))}
	</div>

	<div className="space-y-3">
		{mockSearchResults.map(result => (
		<div
			key={result.id}
			className="bg-white rounded-xl border border-[#e5e5e5] p-5 shadow-sm hover:shadow-md hover:border-[#d0d0d0] transition-all"
		>
			<div className="flex items-start justify-between">
			<div className="flex-1">
				<div className="flex items-center gap-2 mb-1.5">
				<span className="text-[13px] text-[#666]">{result.className}</span>
				<TypeBadge type={result.type} />
				<span className="text-[12px] text-[#999]">{result.term}</span>
				</div>
				<h3 className="text-[15px] mb-2">{result.title}</h3>
				<div className="flex items-center gap-4 text-[12px] text-[#999]">
				<span className="flex items-center gap-1">
					<User className="w-3 h-3" />
					{result.professor}
				</span>
				<span className="flex items-center gap-1">
					<Upload className="w-3 h-3" />
					{result.uploader}
				</span>
				<span className="flex items-center gap-1">
					<Clock className="w-3 h-3" />
					{result.date}
				</span>
				<span>
					{result.files} file{result.files !== 1 ? 's' : ''}
				</span>
				</div>
			</div>
			<button
				onClick={() => onViewTest(mockTests[0])}
				className="ml-4 px-3 py-1.5 text-[12px] rounded-lg border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors whitespace-nowrap"
			>
				View →
			</button>
			</div>
		</div>
		))}
	</div>
	</div>
);
}
