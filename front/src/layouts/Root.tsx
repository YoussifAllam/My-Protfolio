import { Outlet, useLocation } from "react-router";
import { useEffect, useRef } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const SITE_NAME = "Youssif Hassan";

/**
 * Per-route document titles. Without these every route shares the one title
 * baked in at build time, so browser tabs, history, and bookmarks are all
 * indistinguishable. Project detail pages set their own title from the project
 * name and are intentionally absent here.
 */
const TITLES: Record<string, string> = {
  "/": `${SITE_NAME} — Python Backend Developer`,
  "/projects": `Projects — ${SITE_NAME}`,
  "/about": `About — ${SITE_NAME}`,
  "/experience": `Experience — ${SITE_NAME}`,
  "/contact": `Contact — ${SITE_NAME}`,
};

export default function Root() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    const title = TITLES[pathname];
    if (title) document.title = title;
  }, [pathname]);

  // An SPA route change previously left focus on the clicked nav link and
  // announced nothing to a screen reader. Move focus to the new page's
  // content on every navigation after the first.
  //
  // A one-shot "isFirstRender" ref does NOT work here: React 19 StrictMode
  // double-invokes effects in dev (mount -> effect -> cleanup -> effect
  // again, with no state change between them), and the second invocation saw
  // the ref already flipped to false and stole focus onto #main before the
  // user ever pressed Tab — silently skipping the skip link. Comparing
  // against the previous pathname is idempotent under that double-invoke: on
  // both calls pathname is unchanged, so both times prevPathname.current
  // already equals pathname and the effect is a no-op.
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      mainRef.current?.focus({ preventScroll: true });
    }
    prevPathname.current = pathname;
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#080D18] flex flex-col">
      {/*
        A hash router means `href="#main"` would navigate the app to a
        nonexistent route "main" instead of jumping to the anchor — the exact
        failure mode that broke Download CV. The skip link is a focus move,
        never a real anchor.
      */}
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#3776AB] focus:text-white focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <Navigation />
      <div id="main" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
