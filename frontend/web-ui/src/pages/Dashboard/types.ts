import type { LucideIcon } from 'lucide-react';

export type TestType = 'Midterm' | 'Final' | 'Quiz' | 'Practice Problems';

export type FileType = 'image' | 'pdf' | 'url';

export type SectionKey =
	| 'my_tests'
	| 'my_uploads'
	| 'upload_new'
	| 'search_tests'
	| 'settings'
	| 'profile'
	| 'test_detail';

export interface UserProfile {
	name: string;
	email: string;
	avatar: string;
	joinDate: string;
	university: string;
}

export interface TestFile {
	id: string;
	name: string;
	type: FileType;
	size: string;
	url?: string;
	previewUrl?: string;
}

export interface TestItem {
	id: number;
	className: string;
	title: string;
	type: TestType;
	term: string;
	professor: string;
	date: string;
	files: number;
	starred: boolean;
	fileList: TestFile[];
}

export interface UploadItem {
	id: number;
	name: string;
	type: FileType;
	size: string;
	date: string;
	className: string;
}

export interface SearchResult {
	id: number;
	className: string;
	title: string;
	type: TestType;
	term: string;
	professor: string;
	uploader: string;
	date: string;
	files: number;
}

export interface NavItem {
	key: Exclude<SectionKey, 'upload_new' | 'profile' | 'test_detail'>;
	label: string;
	icon: LucideIcon;
}