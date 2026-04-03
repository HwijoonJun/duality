import { useNavigate } from "react-router-dom";


export const HomeHeader = () => {
	const navigate = useNavigate();

	return (
		<header className="sticky top-0 bottom-0 fixed w-full px-8 py-4 flex items-center justify-between border-b border-[#e5e5e5] bg-white">
			<div className="flex items-center gap-2">
				<span className="text-[25px]" onClick={() => navigate("/")}>
					Duality
				</span>
			</div>
			
			<nav className="hidden md:flex items-center gap-8 text-[14px]">
				<a href="#" className="text-[#666] hover:text-black transition-colors">Features</a>
				<a href="#" className="text-[#666] hover:text-black transition-colors">Resources</a>
				<a href="#" className="text-[#666] hover:text-black transition-colors">Events</a>
				<a href="#" className="text-[#666] hover:text-black transition-colors">Business</a>
				<a href="#" className="text-[#666] hover:text-black transition-colors">About</a>
			</nav>
			
			<div className="flex items-center gap-3" resize-none>
				<button className="px-4 py-2 text-[13px] rounded-lg bg-black text-white hover:bg-[#333] transition-colors" onClick={() => navigate("/login")}>
					Sign in
				</button>
				<button className="px-4 py-2 text-[13px] rounded-lg border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors" onClick={() => navigate("/signup")}>
					Sign up
				</button>
			</div>
		</header>
	)

}