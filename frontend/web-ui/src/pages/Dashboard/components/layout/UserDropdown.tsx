import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';

import { mockUser } from '../../data/mockData';
import type { SectionKey } from '../../types';

import { useAuthStore } from "../../../../store/authStore";
import { apiFetch, ApiError } from '../../../../services/api';
import type { UserInfo } from '../../../../types/auth';

interface UserDropdownProps {
	onNavigate: (section: SectionKey) => void;
	onLogout: () => void;
}

export function UserDropdown({ onNavigate, onLogout }: UserDropdownProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const user = useAuthStore((state) => state.user);

	const setUser = useAuthStore((state) => state.setUser);
	//const clearAuth = useAuthStore((state) => state.clearAuth);
	
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");


	useEffect(() => {
		let ignore = false;
	
		async function loadCurrentUser(): Promise<void> {
		setLoading(true);
		setError("");
	
		try {
			const data = await apiFetch<UserInfo>("/auth/me/", {
			method: "GET",
			});
	
			if (!ignore) {
			setUser(data);
			}
		} catch (error) {
			if (!ignore) {
			if (error instanceof ApiError) {
				setError(error.message);
			} else {
				setError("Failed to load user.");
			}
			}
		} finally {
			if (!ignore) {
			setLoading(false);
			}
		}
		}
	
		loadCurrentUser();
	
		return () => {
		ignore = true;
		};
	}, [setUser]);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	return (
		<div ref={ref} className="relative">
			{!loading && !error && user &&(
				<button
					onClick={() => setOpen(prev => !prev)}
					className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#f5f5f5] transition-colors"
				>	
					<div className="w-8 rounded-full bg-black text-white flex items-center justify-center text-[11px]">
						<img src="https://peurtwpqjoapzezkhrfq.supabase.co/storage/v1/object/public/assests/default_user_image.jpeg" alt={mockUser.avatar}
							className="rounded-full border-0"
							/>
					</div>
					<span className="text-[14px]">{user.username}</span>
					<ChevronDown className={`w-3.5 h-3.5 text-[#999] transition-transform ${open ? 'rotate-180' : ''}`} />
				</button>	
			)}

			{open && !loading && !error && user &&(
				<div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-[#e5e5e5] shadow-lg overflow-hidden z-50">
					<div className="px-4 py-3 border-b border-[#f0f0f0]">
						<p className="text-[13px] text-black">{}</p>
						<p className="text-[12px] text-[#999] truncate">{user.email}</p>
					</div>
					<div className="py-1">
						<button
							onClick={() => {
								onNavigate('profile');
								setOpen(false);
							}}
							className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-black hover:bg-[#f5f5f5] transition-colors"
							>
							<User className="w-4 h-4 text-[#999]" />
							Profile
						</button>
						<button
							onClick={() => {
								onNavigate('settings');
								setOpen(false);
							}}
							className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-black hover:bg-[#f5f5f5] transition-colors"
							>
							<Settings className="w-4 h-4 text-[#999]" />
							Settings
						</button>
						<div className="my-1 border-t border-[#f0f0f0]" />
						<button
							onClick={() => {
								onLogout();
								setOpen(false);
							}}
							className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
							>
							<LogOut className="w-4 h-4" />
							Log out
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
