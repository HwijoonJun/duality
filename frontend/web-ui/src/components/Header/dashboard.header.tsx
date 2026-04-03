import { Bell } from 'lucide-react';

import { useNavigate } from "react-router-dom";
import { useDashboardState } from '../../hooks/useDashboardState';
import { UserDropdown } from '../../pages/Dashboard/components/layout/UserDropdown';


import { useAuthStore } from "../../store/authStore";
//import type { User } from "../../types/auth";
import AuthService from "../../services/auth.service";


export const DashboardHeader = () => {
	const navigate = useNavigate();

	//const user = useAuthStore((state) => state.user);
	const clearAuth = useAuthStore((state) => state.clearAuth);

	function handleLogout(): void {
		clearAuth();
		AuthService.logout();
	}

	const {
		handleNavigate,
	} = useDashboardState();

	return (
		<header className="sticky top-0 bottom-0 fixed w-full px-8 py-4 flex items-center justify-between border-b border-[#e5e5e5] bg-white">
			<div className="flex items-center gap-2">
				<span className="text-[25px]" onClick={() => navigate("/")}>
					Duality
				</span>
			</div> 
			
			<div className="flex items-center gap-2" resize-none>
				<button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f5f5f5] transition-colors relative">
					<Bell className="w-4 h-4 text-[#666]" />
					<span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
				</button>
				<UserDropdown onNavigate={handleNavigate} onLogout={handleLogout} />
			</div>
		</header>
	)

}

