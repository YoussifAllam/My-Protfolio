import { createHashRouter } from "react-router";
import Root from "./layouts/Root";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import FeaturedProject from "./pages/FeaturedProject";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Contact from "./pages/Contact";

export const router = createHashRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "projects", Component: Projects },
      { path: "featured-project", Component: FeaturedProject },
      { path: "projects/:slug", Component: ProjectDetail },
      { path: "about", Component: About },
      { path: "experience", Component: Experience },
      { path: "contact", Component: Contact },
    ],
  },
]);
