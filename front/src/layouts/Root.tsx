import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function Root() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
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
