import { Link } from "react-router";
import { SOCIAL_LINKS, CONTACT_EMAIL, LOCATION } from "../data/social";
import { useApi } from "../hooks/useApi";
import { getSummary } from "../lib/api";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  // The footer renders on every page and must never show a loading state or
  // flash empty — the static fallback (last-known-good values) is shown
  // immediately and silently swapped for live data once the (cached, shared
  // with every other page's) summary fetch resolves.
  const { data: summary } = useApi(getSummary);
  const profile = summary?.profile;

  const name = profile?.name ?? "Youssif Hassan";
  const role = profile?.primaryRole ?? "Python Backend Developer";
  const email = profile?.email || CONTACT_EMAIL;
  const location = profile?.location || LOCATION;
  const socialLinks = profile?.socialLinks.length ? profile.socialLinks : SOCIAL_LINKS.map(
    (l) => ({ label: l.label, url: l.href }),
  );
  const availability = profile?.availability ?? "Available for opportunities";

  return (
    <footer className="border-t border-[#243044] bg-[#0B1120]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[#4B9CD3]">{'>'}</span>
              <span className="font-semibold text-[#F8FAFC]">{name}</span>
            </div>
            <p className="text-[#7C8BA3] text-sm font-mono mb-4">{role}</p>
            <a
              href={`mailto:${email}`}
              className="text-sm text-[#94A3B8] hover:text-[#4B9CD3] transition-colors"
            >
              {email}
            </a>
            <p className="text-xs text-[#7C8BA3] mt-1">{location}</p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-mono text-[#7C8BA3] uppercase tracking-widest mb-4">
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
            <h3 className="text-xs font-mono text-[#7C8BA3] uppercase tracking-widest mb-4">
              Profiles
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#94A3B8] hover:text-[#4B9CD3] transition-colors flex items-center gap-1.5"
                  >
                    {link.label}
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
          <p className="text-xs text-[#7C8BA3] font-mono">
            © {year} {name}. Designed around Python. Engineered for clarity.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] status-pulse" aria-hidden="true" />
            <span className="text-xs font-mono text-[#7C8BA3]">{availability}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
