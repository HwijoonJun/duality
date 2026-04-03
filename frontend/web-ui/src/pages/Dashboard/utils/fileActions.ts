import type { TestFile } from '../types';

export const handleFileDownload = (file: TestFile): void => {
	if (file.type === 'url' && file.url) {
		window.open(file.url, '_blank', 'noopener,noreferrer');
		return;
	}

	if (file.previewUrl) {
		const a = document.createElement('a');
		a.href = file.previewUrl;
		a.download = file.name;
		a.target = '_blank';
		a.click();
		return;
	}

	window.alert(`Downloading ${file.name}...`);
};
