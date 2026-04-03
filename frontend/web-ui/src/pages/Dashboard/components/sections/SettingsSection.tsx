import { useState } from 'react';

import { mockUser } from '../../data/mockData';

export function SettingsSection() {
const [name, setName] = useState(mockUser.name);
const [email, setEmail] = useState(mockUser.email);
const [notifications, setNotifications] = useState(true);
const [publicProfile, setPublicProfile] = useState(false);

return (
	<div>
	<div className="mb-6">
		<h2 className="text-[22px]">Settings</h2>
		<p className="text-[13px] text-[#999] mt-0.5">Manage your account preferences</p>
	</div>
	<div className="space-y-4">
		<div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm">
		<h3 className="text-[15px] mb-5">Profile Information</h3>
		<div className="flex items-center gap-4 mb-6">
			<div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-[20px]">
			{mockUser.avatar}
			</div>
			<div>
			<button className="px-3 py-1.5 text-[13px] rounded-lg border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors">
				Change photo
			</button>
			<p className="text-[12px] text-[#999] mt-1">JPG, PNG up to 5MB</p>
			</div>
		</div>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
			<label className="block text-[13px] text-[#666] mb-2">Full Name</label>
			<input
				type="text"
				value={name}
				onChange={e => setName(e.target.value)}
				className="w-full px-3 py-2 text-[14px] text-black border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
			/>
			</div>
			<div>
			<label className="block text-[13px] text-[#666] mb-2">Email</label>
			<input
				type="email"
				value={email}
				onChange={e => setEmail(e.target.value)}
				className="w-full px-3 py-2 text-[14px] text-black border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
			/>
			</div>
			<div>
			<label className="block text-[13px] text-[#666] mb-2">University</label>
			<input
				type="text"
				defaultValue={mockUser.university}
				className="w-full px-3 py-2 text-[14px] text-black border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
			/>
			</div>
		</div>
		<button className="mt-5 px-4 py-2 text-[13px] rounded-lg bg-black text-white hover:bg-[#333] transition-colors">
			Save changes
		</button>
		</div>

		<div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm">
		<h3 className="text-[15px] mb-5">Preferences</h3>
		<div className="space-y-4">
			<div className="flex items-center justify-between">
			<div>
				<p className="text-[14px] text-black">Email Notifications</p>
				<p className="text-[12px] text-[#999]">Receive alerts about new uploads in your classes</p>
			</div>
			<button
				onClick={() => setNotifications(prev => !prev)}
				className={`w-10 h-6 rounded-full transition-colors relative ${notifications ? 'bg-black' : 'bg-[#e5e5e5]'}`}
			>
				<span
				className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications ? 'left-5' : 'left-1'}`}
				/>
			</button>
			</div>
			<div className="flex items-center justify-between pt-4 border-t border-[#f0f0f0]">
			<div>
				<p className="text-[14px] text-black">Public Profile</p>
				<p className="text-[12px] text-[#999]">Allow others to see your uploaded content</p>
			</div>
			<button
				onClick={() => setPublicProfile(prev => !prev)}
				className={`w-10 h-6 rounded-full transition-colors relative ${publicProfile ? 'bg-black' : 'bg-[#e5e5e5]'}`}
			>
				<span
				className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${publicProfile ? 'left-5' : 'left-1'}`}
				/>
			</button>
			</div>
		</div>
		</div>

		<div className="bg-white rounded-xl border border-red-100 p-6 shadow-sm">
		<h3 className="text-[15px] text-red-600 mb-3">Danger Zone</h3>
		<p className="text-[13px] text-[#666] mb-4">Permanently delete your account and all associated data.</p>
		<button className="px-4 py-2 text-[13px] rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
			Delete Account
		</button>
		</div>
	</div>
	</div>
);
}
