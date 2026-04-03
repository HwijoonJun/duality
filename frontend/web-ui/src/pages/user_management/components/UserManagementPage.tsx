import { useEffect, useState } from "react";
import type { JSX } from "react";
import { apiFetch, ApiError } from "../../../services/api";
import { useAuthStore } from "../../../store/authStore";
import type { UserInfo } from "../../../types/auth";
import AuthService from "../../../services/auth.service";

export default function UserManagementPage(): JSX.Element {

const user = useAuthStore((state) => state.user);
const setUser = useAuthStore((state) => state.setUser);
const clearAuth = useAuthStore((state) => state.clearAuth);

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

function handleLogout(): void {
	clearAuth();
	AuthService.logout();
}

return (
	<div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
	<div className="mx-auto max-w-4xl">
		<div className="mb-8 flex items-start justify-between gap-4">
		<div>
			<h1 className="text-3xl font-semibold tracking-tight">
			User Management
			</h1>
			<p className="mt-2 text-sm text-slate-400">
			This page shows the currently authenticated user.
			</p>
		</div>

		<button
			onClick={handleLogout}
			className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
		>
			Logout
		</button>
		</div>

		{loading && (
		<div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-300">
			Loading user...
		</div>
		)}

		{!loading && error && (
		<div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
			{error}
		</div>
		)}

		{!loading && !error && user && (
		<div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl">
			<div className="border-b border-slate-800 px-6 py-5">
			<h2 className="text-lg font-semibold text-slate-100">
				Account Info
			</h2>
			</div>

			<div className="grid gap-4 p-6 sm:grid-cols-3">
			<div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
				<p className="text-xs uppercase tracking-wide text-slate-500">
				ID
				</p>
				<p className="mt-2 text-base font-medium text-slate-100">
				{user.id}
				</p>
			</div>

			<div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
				<p className="text-xs uppercase tracking-wide text-slate-500">
				Username
				</p>
				<p className="mt-2 text-base font-medium text-slate-100">
				{user.username}
				</p>
			</div>

			<div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
				<p className="text-xs uppercase tracking-wide text-slate-500">
				Email
				</p>
				<p className="mt-2 text-base font-medium text-slate-100 break-all">
				{user.email}
				</p>
			</div>
			</div>
		</div>
		)}
	</div>
	</div>
);
}