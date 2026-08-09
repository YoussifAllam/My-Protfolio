import { Link } from "react-router";

export default function NotFound() {
  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <p className="font-mono text-xs text-[#3776AB] mb-3">// traceback</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4">
        Page.DoesNotExist
      </h1>
      <p className="text-[#94A3B8] mb-8">
        That URL didn&apos;t resolve to anything. It may have moved, or the link may be
        incomplete.
      </p>

      <div className="bg-[#111827] border border-[#243044] rounded-xl p-4 font-mono text-xs mb-8 overflow-x-auto">
        <p className="text-[#64748B]">Traceback (most recent call last):</p>
        <p className="text-[#94A3B8] ml-4">File &quot;router.py&quot;, line 1, in resolve</p>
        <p className="text-[#F59E0B]">Page.DoesNotExist: No page matches the given query.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/projects"
          className="px-5 py-2.5 bg-[#3776AB] hover:bg-[#4B9CD3] text-white font-semibold text-sm rounded-lg transition-colors duration-150"
        >
          Browse Projects
        </Link>
        <Link
          to="/"
          className="px-5 py-2.5 bg-[#172033] hover:bg-[#111827] border border-[#243044] hover:border-[#3776AB] text-[#F8FAFC] font-semibold text-sm rounded-lg transition-all duration-150"
        >
          Go Home
        </Link>
        <Link
          to="/contact"
          className="px-5 py-2.5 border border-[#243044] hover:border-[#3776AB] text-[#94A3B8] hover:text-[#F8FAFC] font-semibold text-sm rounded-lg transition-all duration-150"
        >
          Contact Me
        </Link>
      </div>
    </main>
  );
}
