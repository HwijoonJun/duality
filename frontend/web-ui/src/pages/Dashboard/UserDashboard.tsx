import { SectionRenderer } from './components/SectionRenderer';
import { Sidebar } from './components/layout/Sidebar';
import { useDashboardState } from '../../hooks/useDashboardState';

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import type { UserInfo } from "../../types/auth";

import { DashboardHeader } from "../../components/Header/dashboard.header"

export default function UserDashboard() {

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


	const {
		activeSection,
		viewingTest,
		handleBackFromTest,
		handleNavigate,
		handleViewTest,
		setActiveSection,
	} = useDashboardState();

	return (
		<div className="min-h-screen bg-[#fafafa] flex flex-col">
			{/** Header */}
			<DashboardHeader />

			{!loading && !error && (

				<div className="flex flex-1">
					<div className="w-56 flex-shrink-0 border-r border-[#e5e5e5] bg-white px-3 py-5">
						<div className="mb-5 px-3">
						<p className="text-[11px] text-[#bbb] uppercase tracking-wider">Dashboard</p>
						</div>
						<Sidebar active={activeSection} onNavigate={handleNavigate} />
					</div>

					<main className="flex-1 px-8 py-8 overflow-y-auto min-h-0">
						<SectionRenderer
						activeSection={activeSection}
						viewingTest={viewingTest}
						onViewTest={handleViewTest}
						onBackFromTest={handleBackFromTest}
						onSetSection={setActiveSection}
						onNavigate={handleNavigate}
						/>
					</main>
				</div>
			)}
			
		</div>
	);
}
