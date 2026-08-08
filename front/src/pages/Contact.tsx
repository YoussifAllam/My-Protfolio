import { useState } from "react";

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

export default function Contact() {
  const [formState, setFormState] = useState<FormState>("idle");
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
    // Simulate async — wire to real endpoint when ready
    await new Promise((r) => setTimeout(r, 1400));
    setFormState("success");
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

  const inputClass = (field: keyof FormData) =>
    `w-full bg-[#111827] border ${
      errors[field] ? "border-red-500/60" : "border-[#243044] focus:border-[#3776AB]"
    } text-[#F8FAFC] placeholder-[#64748B] text-sm px-3.5 py-2.5 rounded-lg focus:outline-none transition-colors`;

  return (
    <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-xs text-[#3776AB] mb-2">// contact</p>
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
              <p className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider mb-2">Email</p>
              <a
                href="mailto:youssifhassan011@gmail.com"
                className="text-sm text-[#4B9CD3] hover:text-[#F8FAFC] transition-colors break-all"
              >
                youssifhassan011@gmail.com
              </a>
            </div>

            {/* Location */}
            <div className="bg-[#111827] border border-[#243044] rounded-xl p-4">
              <p className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider mb-2">Location</p>
              <p className="text-sm text-[#94A3B8]">Cairo, Egypt</p>
              <p className="text-xs font-mono text-[#64748B] mt-0.5">Available for remote work worldwide</p>
            </div>

            {/* Social / profile links */}
            {[
              { label: "LinkedIn", placeholder: "Add your LinkedIn URL" },
              { label: "GitHub", placeholder: "Add your GitHub URL" },
              { label: "Medium", placeholder: "Add your Medium URL" },
              { label: "Codeforces", placeholder: "Add your Codeforces URL" },
              { label: "LeetCode", placeholder: "Add your LeetCode URL" },
            ].map(({ label, placeholder }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-[#94A3B8]">{label}</span>
                <span className="font-mono text-[10px] text-[#64748B]">{placeholder}</span>
              </div>
            ))}

            {/* Download CV */}
            <a
              href="#download-cv"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#172033] hover:bg-[#111827] border border-[#243044] hover:border-[#3776AB] text-[#94A3B8] hover:text-[#F8FAFC] text-sm font-medium rounded-lg transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download CV
            </a>

            {/* Status */}
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] status-pulse" aria-hidden="true" />
              <span className="text-xs font-mono text-[#64748B]">Available for new projects</span>
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
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-sm text-red-400" role="alert">
                  Something went wrong. Please try again or email me directly.
                </div>
              )}

              <button
                type="submit"
                disabled={formState === "loading"}
                className="w-full sm:w-auto px-8 py-3 bg-[#3776AB] hover:bg-[#4B9CD3] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
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
