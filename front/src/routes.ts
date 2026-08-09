import { createHashRouter, redirect } from "react-router";
import Root from "./layouts/Root";
import RouteError from "./pages/RouteError";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Contact from "./pages/Contact";

export const router = createHashRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: RouteError,
    children: [
      { index: true, Component: Home },
      { path: "projects", Component: Projects },
      { path: "projects/:slug", Component: ProjectDetail },
      { path: "about", Component: About },
      { path: "experience", Component: Experience },
      { path: "contact", Component: Contact },
      // Legacy standalone case-study route — the same project lives at
      // /projects/jafco-analytics, which is the single source of data.
      { path: "featured-project", loader: () => redirect("/projects/jafco-analytics") },
      { path: "*", Component: NotFound },
    ],
  },
]);
