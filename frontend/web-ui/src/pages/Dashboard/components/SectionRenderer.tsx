import type { SectionKey, TestItem } from '../types';

import { MyTestsSection } from './sections/MyTestsSection';
import { MyUploadsSection } from './sections/MyUploadsSection';
import { ProfileSection } from './sections/ProfileSection';
import { SearchTestsSection } from './sections/SearchTestsSection';
import { SettingsSection } from './sections/SettingsSection';
import { TestDetailSection } from './sections/TestDetailSection';
import { UploadNewSection } from './sections/UploadNewSection';

interface SectionRendererProps {
	activeSection: SectionKey;
	viewingTest: TestItem | null;
	onViewTest: (test: TestItem) => void;
	onBackFromTest: () => void;
	onSetSection: (section: SectionKey) => void;
	onNavigate: (section: SectionKey) => void;
}

export function SectionRenderer({
	activeSection,
	viewingTest,
	onViewTest,
	onBackFromTest,
	onSetSection,
	onNavigate,
}: SectionRendererProps) {
	if (activeSection === 'test_detail' && viewingTest) {
		return <TestDetailSection test={viewingTest} onBack={onBackFromTest} />;
}

switch (activeSection) {
	case 'my_tests':
	return <MyTestsSection onViewTest={onViewTest} />;
	case 'my_uploads':
	return <MyUploadsSection onUploadNew={() => onSetSection('upload_new')} />;
	case 'upload_new':
	return <UploadNewSection onSuccess={() => onSetSection('my_uploads')} />;
	case 'search_tests':
	return <SearchTestsSection onViewTest={onViewTest} />;
	case 'settings':
	return <SettingsSection />;
	case 'profile':
	return <ProfileSection onNavigate={onNavigate} />;
	default:
	return <MyTestsSection onViewTest={onViewTest} />;
}
}
