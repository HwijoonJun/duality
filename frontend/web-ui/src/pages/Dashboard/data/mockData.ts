import { ClipboardList, Search, Settings, Upload } from 'lucide-react';

import type {
NavItem,
SearchResult,
TestItem,
TestType,
UploadItem,
UserProfile,
} from '../types';

export const mockUser: UserProfile = {
name: 'Alex Johnson',
email: 'alex.johnson@university.edu',
avatar: 'AJ',
joinDate: 'September 2024',
university: 'State University',
};

export const mockTests: TestItem[] = [
{
	id: 1,
	className: 'CS 101',
	title: 'Introduction to Algorithms',
	type: 'Midterm',
	term: 'Spring 2026',
	professor: 'Dr. Smith',
	date: 'Mar 12, 2026',
	files: 3,
	starred: true,
	fileList: [
	{
		id: 'f1a',
		name: 'cs101_midterm_p1.jpg',
		type: 'image',
		size: '1.2 MB',
		previewUrl:
		'https://images.unsplash.com/photo-1642952469120-eed4b65104be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHNjaWVuY2UlMjBhbGdvcml0aG0lMjBkaWFncmFtJTIwbm90ZXN8ZW58MXx8fHwxNzc1MTg3NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
	},
	{
		id: 'f1b',
		name: 'cs101_midterm_p2.jpg',
		type: 'image',
		size: '980 KB',
		previewUrl:
		'https://images.unsplash.com/photo-1609155035300-15e1ffa95f12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGFtJTIwcGFwZXIlMjBtYXRoZW1hdGljcyUyMGhhbmR3cml0dGVufGVufDF8fHx8MTc3NTE4NzQ4OHww&ixlib=rb-4.1.0&q=80&w=1080',
	},
	{ id: 'f1c', name: 'cs101_study_guide.pdf', type: 'pdf', size: '2.4 MB' },
	],
},
{
	id: 2,
	className: 'MATH 201',
	title: 'Calculus II',
	type: 'Final',
	term: 'Spring 2026',
	professor: 'Prof. Lee',
	date: 'Mar 5, 2026',
	files: 2,
	starred: false,
	fileList: [
	{
		id: 'f2a',
		name: 'math201_final_exam.jpg',
		type: 'image',
		size: '840 KB',
		previewUrl:
		'https://images.unsplash.com/photo-1609155035300-15e1ffa95f12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGFtJTIwcGFwZXIlMjBtYXRoZW1hdGljcyUyMGhhbmR3cml0dGVufGVufDF8fHx8MTc3NTE4NzQ4OHww&ixlib=rb-4.1.0&q=80&w=1080',
	},
	{ id: 'f2b', name: 'math201_formula_sheet.pdf', type: 'pdf', size: '560 KB' },
	],
},
{
	id: 3,
	className: 'PHYS 110',
	title: 'Classical Mechanics',
	type: 'Quiz',
	term: 'Spring 2026',
	professor: 'Dr. Nguyen',
	date: 'Feb 28, 2026',
	files: 1,
	starred: true,
	fileList: [
	{
		id: 'f3a',
		name: 'phys110_quiz_scan.jpg',
		type: 'image',
		size: '1.8 MB',
		previewUrl:
		'https://images.unsplash.com/photo-1758685848061-3080d0780285?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwZm9ybXVsYSUyMHdoaXRlYm9hcmQlMjBsZWN0dXJlfGVufDF8fHx8MTc3NTE4NzQ4OXww&ixlib=rb-4.1.0&q=80&w=1080',
	},
	],
},
{
	id: 4,
	className: 'ENG 205',
	title: 'Technical Writing',
	type: 'Practice Problems',
	term: 'Fall 2025',
	professor: 'Prof. Martinez',
	date: 'Jan 15, 2026',
	files: 5,
	starred: false,
	fileList: [
	{
		id: 'f4a',
		name: 'eng205_practice_set1.jpg',
		type: 'image',
		size: '720 KB',
		previewUrl:
		'https://images.unsplash.com/photo-1609155035300-15e1ffa95f12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGFtJTIwcGFwZXIlMjBtYXRoZW1hdGljcyUyMGhhbmR3cml0dGVufGVufDF8fHx8MTc3NTE4NzQ4OHww&ixlib=rb-4.1.0&q=80&w=1080',
	},
	{
		id: 'f4b',
		name: 'eng205_practice_set2.jpg',
		type: 'image',
		size: '650 KB',
		previewUrl:
		'https://images.unsplash.com/photo-1642952469120-eed4b65104be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHNjaWVuY2UlMjBhbGdvcml0aG0lMjBkaWFncmFtJTIwbm90ZXN8ZW58MXx8fHwxNzc1MTg3NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
	},
	{ id: 'f4c', name: 'eng205_answer_key.pdf', type: 'pdf', size: '1.1 MB' },
	{ id: 'f4d', name: 'eng205_rubric.pdf', type: 'pdf', size: '320 KB' },
	{
		id: 'f4e',
		name: 'https://purdue.edu/owl/eng205',
		type: 'url',
		size: '—',
		url: 'https://purdue.edu/owl/eng205',
	},
	],
},
{
	id: 5,
	className: 'BIO 102',
	title: 'Cell Biology',
	type: 'Midterm',
	term: 'Fall 2025',
	professor: 'Dr. Patel',
	date: 'Dec 10, 2025',
	files: 4,
	starred: false,
	fileList: [
	{
		id: 'f5a',
		name: 'bio102_midterm_p1.jpg',
		type: 'image',
		size: '2.1 MB',
		previewUrl:
		'https://images.unsplash.com/photo-1631816290138-9f0f79cada3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9sb2d5JTIwY2VsbCUyMG1pY3Jvc2NvcGUlMjBzdHVkeSUyMG5vdGVzfGVufDF8fHx8MTc3NTE4NzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
	},
	{
		id: 'f5b',
		name: 'bio102_midterm_p2.jpg',
		type: 'image',
		size: '1.9 MB',
		previewUrl:
		'https://images.unsplash.com/photo-1631816290138-9f0f79cada3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9sb2d5JTIwY2VsbCUyMG1pY3Jvc2NvcGUlMjBzdHVkeSUyMG5vdGVzfGVufDF8fHx8MTc3NTE4NzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
	},
	{ id: 'f5c', name: 'bio102_study_notes.pdf', type: 'pdf', size: '3.2 MB' },
	{ id: 'f5d', name: 'bio102_lab_report.pdf', type: 'pdf', size: '890 KB' },
	],
},
{
	id: 6,
	className: 'CHEM 150',
	title: 'Organic Chemistry I',
	type: 'Final',
	term: 'Fall 2025',
	professor: 'Dr. Kim',
	date: 'Nov 30, 2025',
	files: 2,
	starred: true,
	fileList: [
	{
		id: 'f6a',
		name: 'chem150_final_scan.jpg',
		type: 'image',
		size: '1.4 MB',
		previewUrl:
		'https://images.unsplash.com/photo-1717501218003-3c89682cfb3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBvcmdhbmljJTIwbW9sZWN1bGVzJTIwdGV4dGJvb2t8ZW58MXx8fHwxNzc1MTg3NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
	},
	{ id: 'f6b', name: 'chem150_reaction_guide.pdf', type: 'pdf', size: '980 KB' },
	],
},
];

export const mockUploads: UploadItem[] = [
{
	id: 1,
	name: 'cs101_midterm_notes.pdf',
	type: 'pdf',
	size: '2.4 MB',
	date: 'Mar 12, 2026',
	className: 'CS 101',
},
{
	id: 2,
	name: 'math201_formula_sheet.png',
	type: 'image',
	size: '840 KB',
	date: 'Mar 5, 2026',
	className: 'MATH 201',
},
{
	id: 3,
	name: 'phys110_quiz1.pdf',
	type: 'pdf',
	size: '1.1 MB',
	date: 'Feb 28, 2026',
	className: 'PHYS 110',
},
{
	id: 4,
	name: 'https://ocw.mit.edu/courses/cs101',
	type: 'url',
	size: '—',
	date: 'Feb 20, 2026',
	className: 'CS 101',
},
{
	id: 5,
	name: 'bio102_cell_diagram.png',
	type: 'image',
	size: '3.2 MB',
	date: 'Dec 10, 2025',
	className: 'BIO 102',
},
{
	id: 6,
	name: 'chem150_reaction_guide.pdf',
	type: 'pdf',
	size: '980 KB',
	date: 'Nov 30, 2025',
	className: 'CHEM 150',
},
];

export const mockSearchResults: SearchResult[] = [
{
	id: 1,
	className: 'CS 301',
	title: 'Data Structures',
	type: 'Midterm',
	term: 'Spring 2026',
	professor: 'Dr. Chen',
	uploader: 'Jordan M.',
	date: 'Mar 18, 2026',
	files: 2,
},
{
	id: 2,
	className: 'MATH 301',
	title: 'Linear Algebra',
	type: 'Final',
	term: 'Spring 2026',
	professor: 'Prof. Williams',
	uploader: 'Sam T.',
	date: 'Mar 14, 2026',
	files: 3,
},
{
	id: 3,
	className: 'PHYS 201',
	title: 'Electromagnetism',
	type: 'Quiz',
	term: 'Spring 2026',
	professor: 'Dr. Brown',
	uploader: 'Casey R.',
	date: 'Mar 9, 2026',
	files: 1,
},
{
	id: 4,
	className: 'CS 401',
	title: 'Machine Learning',
	type: 'Practice Problems',
	term: 'Spring 2026',
	professor: 'Dr. Liu',
	uploader: 'Riley S.',
	date: 'Mar 2, 2026',
	files: 4,
},
];

export const typeBadgeColors: Record<TestType, string> = {
Midterm: 'bg-blue-50 text-blue-700 border-blue-100',
Final: 'bg-purple-50 text-purple-700 border-purple-100',
Quiz: 'bg-green-50 text-green-700 border-green-100',
'Practice Problems': 'bg-amber-50 text-amber-700 border-amber-100',
};

export const testFilters: Array<'All' | TestType> = [
'All',
'Midterm',
'Final',
'Quiz',
'Practice Problems',
];

export const contentTypes: TestType[] = ['Quiz', 'Midterm', 'Final', 'Practice Problems'];

export const navItems: NavItem[] = [
{ key: 'my_tests', label: 'My Tests', icon: ClipboardList },
{ key: 'my_uploads', label: 'My Uploads', icon: Upload },
{ key: 'search_tests', label: 'Search Tests', icon: Search },
{ key: 'settings', label: 'Settings', icon: Settings },
];
