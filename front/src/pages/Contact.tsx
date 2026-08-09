import { useState } from "react";
import DownloadCV from "../components/DownloadCV";
import { SOCIAL_LINKS, CONTACT_EMAIL, LOCATION } from "../data/social";
import { useApi } from "../hooks/useApi";
import { getSummary } from "../lib/api";

const PROJECT_TYPES = [
  "Django Backend",
  "REST API",
  "PyQt5 Desktop Application",
  "Full-Stack Product",
  "DevOps & Deployment",
  "AI Integration",
  "Technical Consultation",
  "Other",
];

const BUDGET_RANGES = [
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
  "Open to discuss",
];

type FormState = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
}

/** Carries the whole submission into the user's mail client when the POST fails. */
function mailtoFallback(form: FormData, email: string): string {
  const subject = `Project enquiry${form.projectType ? ` — ${form.projectType}` : ""}`;
  const body = [
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    form.company && `Company: ${form.company}`,
    form.projectType && `Project type: ${form.projectType}`,
    form.budget && `Budget: ${form.budget}`,
    "",
    form.message,
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Contact() {
  // Same last-known-good-then-upgrade pattern as Footer: the page renders
  // immediately with static fallback contact info and swaps to live profile
  // data once it loads, rather than blocking the whole page on a fetch.
  const { data: summary } = useApi(getSummary);
  const profile = summary?.profile;
  const email = profile?.email || CONTACT_EMAIL;
  const location = profile?.location || LOCATION;
  const socialLinks = profile?.socialLinks.length
    ? profile.socialLinks
    : SOCIAL_LINKS.map((l) => ({ label: l.label, url: l.href }));

  const [formState, setFormState] = useState<FormState>("idle");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    message: "",
  });

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFormState("loading");
    try {
      const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT;
      if (!endpoint) throw new Error("VITE_CONTACT_ENDPOINT is not configured");
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Field names already match the DRF ContactMessageSerializer contract.
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      setFormState("success");
    } catch {
      // Never fake a success. The error branch below carries a prefilled
      // mailto so a failed submit is still a conversion.
      setFormState("error");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission) — the mailto
      // link beside this button still works, so there is nothing to recover.
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // The focus border used to live only in the non-error branch below, so an
  // invalid field had NO visible focus indicator at all — precisely the field
  // a keyboard user is sent back to. `focus:border-[#4B9CD3]` now applies
  // unconditionally, and `focus:outline-none` is gone entirely so the global
  // :focus-visible ring (index.css) shows through on every field.
  const inputClass = (field: keyof FormData) =>
    `w-full bg-[#111827] border ${
      errors[field] ? "border-red-400/70" : "border-[#243044]"
    } focus:border-[#4B9CD3] text-[#F8FAFC] placeholder-[#7C8BA3] text-sm px-3.5 py-2.5 rounded-lg transition-colors`;

  return (
    <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-xs text-[#4B9CD3] mb-2">// contact</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-3">
          {"Let's build a reliable Python system."}
        </h1>
        <p className="text-[#94A3B8] max-w-lg">
          Contact me about Django backend development, REST APIs, desktop applications, DevOps
          deployment, AI integrations, or technical collaboration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact info */}
        <aside aria-label="Contact information">
          <div className="space-y-6">
            {/* Email */}
            <div className="bg-[#111827] border border-[#243044] rounded-xl p-4">
              <p className="font-mono text-2xs text-[#7C8BA3] uppercase tracking-wider mb-2">Email</p>
              <a
                href={`mailto:${email}`}
                className="text-sm text-[#4B9CD3] hover:text-[#F8FAFC] transition-colors break-all"
              >
                {email}
              </a>
            </div>

            {/* Location */}
            <div className="bg-[#111827] border border-[#243044] rounded-xl p-4">
              <p className="font-mono text-2xs text-[#7C8BA3] uppercase tracking-wider mb-2">Location</p>
              <p className="text-sm text-[#94A3B8]">{location}</p>
              <p className="text-xs font-mono text-[#7C8BA3] mt-0.5">Available for remote work worldwide</p>
            </div>

            {/* Social / profile links */}
            <div className="bg-[#111827] border border-[#243044] rounded-xl p-4">
              <p className="font-mono text-2xs text-[#7C8BA3] uppercase tracking-wider mb-3">
                Profiles
              </p>
              <ul className="flex flex-col gap-2" role="list">
                {socialLinks.map(({ label, url }) => (
                  <li key={label}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#94A3B8] hover:text-[#4B9CD3] transition-colors flex items-center gap-1.5"
                    >
                      {label}
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        aria-hidden="true"
                        className="opacity-40"
                      >
                        <path d="M3.5 3a.5.5 0 000 1H7.29L3.15 8.15a.5.5 0 10.7.7L8 4.71V8.5a.5.5 0 001 0v-5a.5.5 0 00-.5-.5h-5z" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Download CV */}
            <DownloadCV variant="outline" showIcon />

            {/* Status */}
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] status-pulse" aria-hidden="true" />
              <span className="text-xs font-mono text-[#7C8BA3]">Available for new projects</span>
            </div>
          </div>
        </aside>

        {/* Form */}
        <div className="lg:col-span-2">
          {formState === "success" ? (
            <div
              className="bg-[#22C55E]/8 border border-[#22C55E]/25 rounded-xl p-10 text-center"
              role="alert"
            >
              <div className="w-12 h-12 rounded-full bg-[#22C55E]/15 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#F8FAFC] mb-2">Message sent!</h2>
              <p className="text-[#94A3B8] text-sm mb-6">
                Thanks for reaching out. {"I'll"} get back to you within 24–48 hours.
              </p>
              <button
                onClick={() => { setFormState("idle"); setForm({ name: "", email: "", company: "", projectType: "", budget: "", message: "" }); }}
                className="px-5 py-2.5 bg-[#172033] border border-[#243044] hover:border-[#3776AB] text-[#94A3B8] hover:text-[#F8FAFC] text-sm rounded-lg transition-all"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1.5" htmlFor="name">
                    Name <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass("name")}
                    placeholder="Your name"
                    aria-required="true"
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && <p id="name-error" role="alert" className="mt-1 text-xs text-red-400">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1.5" htmlFor="email">
                    Email <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass("email")}
                    placeholder="your@email.com"
                    aria-required="true"
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && <p id="email-error" role="alert" className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-mono text-[#94A3B8] mb-1.5" htmlFor="company">
                  Company / Organization
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  className={inputClass("company")}
                  placeholder="Company or project name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1.5" htmlFor="projectType">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={form.projectType}
                    onChange={handleChange}
                    className={`${inputClass("projectType")} appearance-none`}
                  >
                    <option value="">Select project type</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1.5" htmlFor="budget">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className={`${inputClass("budget")} appearance-none`}
                  >
                    <option value="">Select budget range</option>
                    {BUDGET_RANGES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-mono text-[#94A3B8] mb-1.5" htmlFor="message">
                  Message <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputClass("message")} resize-none`}
                  placeholder="Describe your project, goals, or questions..."
                  aria-required="true"
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && <p id="message-error" role="alert" className="mt-1 text-xs text-red-400">{errors.message}</p>}
              </div>

              {formState === "error" && (
                <div
                  className="mb-4 p-4 bg-red-500/10 border border-red-500/25 rounded-lg"
                  role="alert"
                >
                  <p className="text-sm text-red-400 mb-1">
                    That message couldn&apos;t be delivered.
                  </p>
                  <p className="text-sm text-[#94A3B8] mb-3">
                    Nothing you typed is lost — send it by email instead and it will arrive
                    exactly as written.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={mailtoFallback(form, email)}
                      className="px-4 py-2 bg-[#3776AB] hover:bg-[#4B9CD3] active:brightness-95 active:scale-[0.98] text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Email it instead
                    </a>
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="px-4 py-2 border border-[#243044] hover:border-[#3776AB] active:bg-[#111827] text-[#94A3B8] hover:text-[#F8FAFC] text-sm font-medium rounded-lg transition-all"
                    >
                      {copied ? "Address copied" : `Copy ${email}`}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={formState === "loading"}
                className="w-full sm:w-auto px-8 py-3 bg-[#3776AB] hover:bg-[#4B9CD3] active:brightness-95 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {formState === "loading" ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
