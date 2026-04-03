export const AppFooter = () => {
  return (
    <footer className="w-full border-t border-[#e5e5e5] bg-white">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-[14px] mb-4">About</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[13px] text-[#666] hover:text-black transition-colors">Our Story</a></li>
                <li><a href="#" className="text-[13px] text-[#666] hover:text-black transition-colors">Team</a></li>
                <li><a href="#" className="text-[13px] text-[#666] hover:text-black transition-colors">Careers</a></li>
                <li><a href="#" className="text-[13px] text-[#666] hover:text-black transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-[14px] mb-4">Contact</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[13px] text-[#666] hover:text-black transition-colors">Support</a></li>
                <li><a href="#" className="text-[13px] text-[#666] hover:text-black transition-colors">Sales</a></li>
                <li><a href="#" className="text-[13px] text-[#666] hover:text-black transition-colors">Partnerships</a></li>
                <li><a href="#" className="text-[13px] text-[#666] hover:text-black transition-colors">Press</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-[14px] mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[13px] text-[#666] hover:text-black transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-[13px] text-[#666] hover:text-black transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-[13px] text-[#666] hover:text-black transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-[14px] mb-4">Follow Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[13px] text-[#666] hover:text-black transition-colors">LinkedIn</a></li>
                <li><a href="#" className="text-[13px] text-[#666] hover:text-black transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#e5e5e5] text-center">
            <p className="text-[13px] text-[#999]">
              © 2026 Duality. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
  );
}
