import { useMemo, useState } from 'react';
import { BookOpen, Clock, Filter, MoreHorizontal, Star, User } from 'lucide-react';

import { mockTests, testFilters } from '../../data/mockData';
import type { TestItem } from '../../types';
import { TypeBadge } from '../TypeBadge';

interface MyTestsSectionProps {
onViewTest: (test: TestItem) => void;
}

export function MyTestsSection({ onViewTest }: MyTestsSectionProps) {
const [filter, setFilter] = useState<(typeof testFilters)[number]>('All');

const filteredTests = useMemo(
	() => (filter === 'All' ? mockTests : mockTests.filter(test => test.type === filter)),
	[filter],
);

return (
	<div>
	<div className="flex items-center justify-between mb-6">
		<div>
		<h2 className="text-[22px]">My Tests</h2>
		<p className="text-[13px] text-[#999] mt-0.5">{mockTests.length} items saved</p>
		</div>
		<div className="flex items-center gap-2">
		<Filter className="w-4 h-4 text-[#999]" />
		<div className="flex gap-1 flex-wrap">
			{testFilters.map(item => (
			<button
				key={item}
				onClick={() => setFilter(item)}
				className={`px-3 py-1.5 rounded-lg text-[12px] transition-colors ${
				filter === item
					? 'bg-black text-white'
					: 'border border-[#e5e5e5] text-[#666] hover:bg-[#f5f5f5]'
				}`}
			>
				{item}
			</button>
			))}
		</div>
		</div>
	</div>

	<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
		{filteredTests.map(test => (
		<div
			key={test.id}
			className="bg-white rounded-xl border border-[#e5e5e5] p-5 shadow-sm hover:shadow-md hover:border-[#d0d0d0] transition-all group"
		>
			<div className="flex items-start justify-between mb-3">
			<div className="flex items-center gap-2">
				<span className="text-[13px] text-[#666]">{test.className}</span>
				<TypeBadge type={test.type} />
			</div>
			<div className="flex items-center gap-1">
				{test.starred && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
				<button className="p-1 rounded hover:bg-[#f5f5f5] opacity-0 group-hover:opacity-100 transition-opacity">
				<MoreHorizontal className="w-3.5 h-3.5 text-[#999]" />
				</button>
			</div>
			</div>
			<h3 className="text-[15px] mb-3 leading-snug">{test.title}</h3>
			<div className="space-y-1.5 text-[12px] text-[#999]">
			<div className="flex items-center gap-1.5">
				<User className="w-3 h-3" />
				<span>{test.professor}</span>
			</div>
			<div className="flex items-center gap-1.5">
				<BookOpen className="w-3 h-3" />
				<span>{test.term}</span>
			</div>
			<div className="flex items-center gap-1.5">
				<Clock className="w-3 h-3" />
				<span>{test.date}</span>
			</div>
			</div>
			<div className="mt-4 pt-3 border-t border-[#f0f0f0] flex items-center justify-between">
			<span className="text-[12px] text-[#999]">
				{test.files} file{test.files !== 1 ? 's' : ''}
			</span>
			<button
				onClick={() => onViewTest(test)}
				className="text-[12px] text-black hover:underline flex items-center gap-1"
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
