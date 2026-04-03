import { navItems } from '../../data/mockData';
import type { SectionKey } from '../../types';

interface SidebarProps {
active: SectionKey;
onNavigate: (section: SectionKey) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
const sidebarActive = ['my_tests', 'test_detail'].includes(active)
	? 'my_tests'
	: ['upload_new', 'my_uploads'].includes(active)
	? 'my_uploads'
	: active;

return (
	<aside className="w-56 flex-shrink-0 flex flex-col">
	<nav className="space-y-0.5">
		{navItems.map(({ key, label, icon: Icon }) => (
		<button
			key={key}
			onClick={() => onNavigate(key)}
			className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
			sidebarActive === key
				? 'bg-black text-white'
				: 'text-[#555] hover:bg-[#f0f0f0]'
			}`}
		>
			<Icon className="w-4 h-4 flex-shrink-0" />
			{label}
		</button>
		))}
	</nav>
	</aside>
);
}
