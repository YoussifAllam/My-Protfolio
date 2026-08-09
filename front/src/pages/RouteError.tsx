import { Link, useRouteError, isRouteErrorResponse } from "react-router";

/**
 * Last-resort boundary. Without this, any thrown route error (a bad hash, a
 * component crash) replaces the entire site with react-router's raw dev error
 * screen. This keeps the visitor inside the site with a way forward.
 */
export default function RouteError() {
  const error = useRouteError();

  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Unknown error";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#080D18]">
      <div className="max-w-xl w-full">
        <p className="font-mono text-xs text-[#3776AB] mb-3">// unhandled exception</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4">
          Something broke on this page.
        </h1>
        <p className="text-[#94A3B8] mb-6">
          The rest of the site is fine — this route failed to render.
        </p>

        <div className="bg-[#111827] border border-[#243044] rounded-xl p-4 font-mono text-xs text-[#94A3B8] mb-8 overflow-x-auto">
          {detail}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 bg-[#3776AB] hover:bg-[#4B9CD3] text-white font-semibold text-sm rounded-lg transition-colors duration-150"
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
      </div>
    </main>
  );
}
