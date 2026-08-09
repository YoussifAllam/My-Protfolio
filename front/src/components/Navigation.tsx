import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import DownloadCV from "./DownloadCV";
import { useDialog } from "../hooks/useDialog";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" },
];

// Python-inspired Y mark
function YMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L4 8v3l8-5 8 5V8L12 2z"
        fill="#4B9CD3"
        opacity="0.9"
      />
      <path
        d="M12 10v12"
        stroke="#FFD343"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="6" cy="14" r="1.5" fill="#4B9CD3" opacity="0.6" />
      <circle cx="18" cy="14" r="1.5" fill="#4B9CD3" opacity="0.6" />
      <path d="M6 14 L12 10 L18 14" stroke="#4B9CD3" strokeWidth="1.5" opacity="0.5" fill="none" />
    </svg>
  );
}

export default function Navigation() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Focus trap + Escape + scroll lock + focus restore. Previously this overlay
  // declared aria-modal="true" with none of that actually implemented — it was
  // a modal in markup only.
  const overlayRef = useDialog<HTMLDivElement>(menuOpen, () => setMenuOpen(false));

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#080D18]/95 backdrop-blur-md border-b border-[#243044]"
            : "bg-transparent"
        }`}
        role="banner"
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            aria-label="Youssif Hassan — Home"
          >
            <YMark />
            <div className="flex flex-col leading-none">
              <span className="text-[#F8FAFC] font-semibold text-sm tracking-wide group-hover:text-[#4B9CD3] transition-colors">
                Youssif Hassan
              </span>
              <span className="font-mono text-2xs text-[#7C8BA3] tracking-wider">
                python_backend_dev
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`px-3 py-2 rounded-sm text-sm font-medium transition-all duration-150 active:bg-[#3776AB]/20 ${
                    isActive(link.to)
                      ? "text-[#4B9CD3] bg-[#3776AB]/10"
                      : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]"
                  }`}
                  aria-current={isActive(link.to) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <DownloadCV variant="primary" />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors active:opacity-70"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay. z-[60] — above the z-50 header, which is why it
          needs its own close button below: raising it above the header takes
          the hamburger toggle out of reach. */}
      {menuOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[60] bg-[#080D18]/98 backdrop-blur-sm flex flex-col pt-6 px-6 pb-8"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors active:opacity-70"
              aria-label="Close menu"
            >
              <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <ul className="flex flex-col gap-1 flex-1" role="list">
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`block px-4 py-3.5 rounded-lg text-base font-medium transition-colors active:bg-[#172033] ${
                    isActive(link.to)
                      ? "text-[#4B9CD3] bg-[#3776AB]/10 border border-[#3776AB]/20"
                      : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <DownloadCV variant="block" />
        </div>
      )}
    </>
  );
}
