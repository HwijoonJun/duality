import { useState } from 'react';

import type { SectionKey, TestItem } from '../pages/Dashboard/types';


export interface DashboardState {
	activeSection: SectionKey;
	viewingTest: TestItem | null;
	handleViewTest: (test: TestItem) => void;
	handleBackFromTest: () => void;
	handleNavigate: (section: SectionKey) => void;
	setActiveSection: (section: SectionKey) => void;
}

export function useDashboardState(): DashboardState {
	const [activeSection, setActiveSection] = useState<SectionKey>('my_tests');
	const [viewingTest, setViewingTest] = useState<TestItem | null>(null);

const handleViewTest = (test: TestItem) => {
	setViewingTest(test);
	setActiveSection('test_detail');
};

const handleBackFromTest = () => {
	setViewingTest(null);
	setActiveSection('my_tests');
};

const handleNavigate = (section: SectionKey) => {
	if (section !== 'test_detail') {
		setViewingTest(null);
	}

	setActiveSection(section);
};

return {
	activeSection,
	viewingTest,
	handleViewTest,
	handleBackFromTest,
	handleNavigate,
	setActiveSection,
};
}
