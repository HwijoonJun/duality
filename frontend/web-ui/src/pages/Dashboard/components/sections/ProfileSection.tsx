import { FileText } from 'lucide-react';

import { mockTests, mockUploads, mockUser } from '../../data/mockData';
import type { SectionKey } from '../../types';

interface ProfileSectionProps {
onNavigate: (section: SectionKey) => void;
}

export function ProfileSection({ onNavigate }: ProfileSectionProps) {
return (
	<div>
	<div className="mb-6">
		<h2 className="text-[22px]">Profile</h2>
		<p className="text-[13px] text-[#999] mt-0.5">Your account overview</p>
	</div>
	<div className="space-y-4">
		<div className="bg-white rounded-xl border border-[#e5e5e5] p-8 shadow-sm flex items-center gap-6">
		<div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-[24px] flex-shrink-0">
			{mockUser.avatar}
		</div>
		<div>
			<h3 className="text-[20px]">{mockUser.name}</h3>
			<p className="text-[14px] text-[#666] mt-0.5">{mockUser.email}</p>
			<p className="text-[13px] text-[#999] mt-0.5">
			{mockUser.university} · Member since {mockUser.joinDate}
			</p>
		</div>
		</div>

		<div className="grid grid-cols-3 gap-4">
		{[
			{ label: 'Tests Saved', value: mockTests.length },
			{ label: 'Files Uploaded', value: mockUploads.length },
			{ label: 'Starred', value: mockTests.filter(test => test.starred).length },
		].map(stat => (
			<div
			key={stat.label}
			className="bg-white rounded-xl border border-[#e5e5e5] p-5 shadow-sm text-center"
			>
			<p className="text-[28px]">{stat.value}</p>
			<p className="text-[13px] text-[#999] mt-1">{stat.label}</p>
			</div>
		))}
		</div>

		<div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm">
		<h3 className="text-[15px] mb-4">Recent Activity</h3>
		<div className="space-y-3">
			{mockTests.slice(0, 3).map(test => (
			<div
				key={test.id}
				className="flex items-center justify-between py-2 border-b border-[#f5f5f5] last:border-0"
			>
				<div className="flex items-center gap-3">
				<div className="w-8 h-8 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
					<FileText className="w-4 h-4 text-[#999]" />
				</div>
				<div>
					<p className="text-[13px] text-black">{test.title}</p>
					<p className="text-[12px] text-[#999]">
					{test.className} · {test.type}
					</p>
				</div>
				</div>
				<span className="text-[12px] text-[#999]">{test.date}</span>
			</div>
			))}
		</div>
		<button
			onClick={() => onNavigate('my_tests')}
			className="mt-4 text-[13px] text-black hover:underline"
		>
			View all →
		</button>
		</div>
	</div>
	</div>
);
}
