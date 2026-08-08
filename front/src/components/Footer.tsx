import { Link } from "react-router";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/YoussifAllam", placeholder: false },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/youssif-hassan-495697249/", placeholder: false },
  { label: "Medium", href: "https://medium.com/@youssifhassan011", placeholder: false },
  { label: "Codeforces", href: "https://codeforces.com/profile/youssif.hassan", placeholder: false },
  { label: "LeetCode", href: "https://leetcode.com/u/youssifhassan011/", placeholder: false },
  { label: "Kaggle", href: "https://www.kaggle.com/youssifhassan", placeholder: false },
];

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#243044] bg-[#0B1120]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[#3776AB]">{'>'}</span>
              <span className="font-semibold text-[#F8FAFC]">Youssif Hassan</span>
            </div>
            <p className="text-[#64748B] text-sm font-mono mb-4">Python Backend Developer</p>
            <a
              href="mailto:youssifhassan011@gmail.com"
              className="text-sm text-[#94A3B8] hover:text-[#4B9CD3] transition-colors"
            >
              youssifhassan011@gmail.com
            </a>
            <p className="text-xs text-[#64748B] mt-1">Cairo, Egypt</p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-mono text-[#64748B] uppercase tracking-widest mb-4">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[#94A3B8] hover:text-[#4B9CD3] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Profiles */}
          <div>
            <h3 className="text-xs font-mono text-[#64748B] uppercase tracking-widest mb-4">
              Profiles
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#94A3B8] hover:text-[#4B9CD3] transition-colors flex items-center gap-1.5"
                    aria-label={`${link.label}${link.placeholder ? " (edit URL in code)" : ""}`}
                  >
                    {link.label}
                    {link.placeholder && (
                      <span className="text-[10px] font-mono text-[#64748B]">(edit URL)</span>
                    )}
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className="opacity-40">
                      <path d="M3.5 3a.5.5 0 000 1H7.29L3.15 8.15a.5.5 0 10.7.7L8 4.71V8.5a.5.5 0 001 0v-5a.5.5 0 00-.5-.5h-5z"/>
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1a2538] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#64748B] font-mono">
            © {year} Youssif Hassan. Designed around Python. Engineered for clarity.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] status-pulse" aria-hidden="true" />
            <span className="text-xs font-mono text-[#64748B]">Available for opportunities</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
