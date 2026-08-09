/**
 * Shared loading/error UI for API-backed pages, kept visually consistent with
 * the site's mono/terminal aesthetic (see Contact.tsx's submit spinner and
 * TerminalCard's `// comment` labels) rather than a generic spinner.
 */

export function PageLoading({ label = "content" }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-24 text-center"
      role="status"
      aria-live="polite"
    >
      <svg
        className="animate-spin text-[#4B9CD3]"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <p className="font-mono text-xs text-[#7C8BA3]">// loading {label}…</p>
    </div>
  );
}

export function PageError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center px-4" role="alert">
      <div className="max-w-sm">
        <p className="font-mono text-xs text-[#F87171] mb-2">// request failed</p>
        <p className="text-sm text-[#94A3B8]">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 bg-[#172033] hover:bg-[#111827] active:bg-[#080D18] border border-[#243044] hover:border-[#3776AB] text-[#94A3B8] hover:text-[#F8FAFC] text-sm font-medium rounded-lg transition-all"
      >
        Try again
      </button>
    </div>
  );
}
