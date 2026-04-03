import { typeBadgeColors } from '../data/mockData';
import type { TestType } from '../types';

interface TypeBadgeProps {
	type: TestType | string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
	const className =
		(typeBadgeColors[type as TestType] as string | undefined) ??
		'bg-gray-50 text-gray-700 border-gray-100';

	return (
		<span className={`px-2 py-0.5 rounded text-[11px] border ${className}`}>
			{type}
		</span>
	);
}
