import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
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

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    const title = TITLES[pathname];
    if (title) document.title = title;
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#080D18] flex flex-col">
      <Navigation />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
