export interface ProjectLink {
  type: string;
  label: string;
  url: string;
  icon?: string;
}

export interface ProjectImage {
  src: string | null;
  caption: string;
  type: string;
}

export interface ProjectChallenge {
  title: string;
  problem: string;
  approach: string;
  solution: string;
  result: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
  note?: string;
}

export interface Project {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  categories: string[];
  featured: boolean;
  biggestProject: boolean;
  confidential: boolean;
  company: string;
  year: string;
  startDate: string;
  endDate: string | null;
  status: string;
  role: string;
  projectType: string;
  coverImage: string | null;
  images: ProjectImage[];
  technologies: string[];
  features: string[];
  responsibilities: string[];
  challenges: ProjectChallenge[];
  metrics: ProjectMetric[];
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "jafco-analytics",
    name: "JAFCO Analytics Backend",
    subtitle: "Enterprise-scale Django analytics platform for retail operations",
    shortDescription:
      "A Django analytics backend supporting more than 1,000 branches and processing approximately one billion sales records for a large retail enterprise.",
    fullDescription: `JAFCO Analytics Backend is a large-scale enterprise platform built to handle analytics operations for a major retail chain. The system supports over 1,000 branches and processes approximately one billion sales records, requiring careful architectural decisions around data modeling, query optimization, and business workflow design.

Developed as part of Youssif's role at ADEX Jordan Company, this project involved building robust Django backend functionality, implementing APIs, and translating complex client requirements into maintainable backend solutions. The work also included contributions to additional multi-tenant SaaS systems and delivery applications within ADEX, covering tenant isolation, authentication, permission systems, and business workflows.`,
    categories: ["Backend", "Enterprise System", "Data Platform"],
    featured: true,
    biggestProject: true,
    confidential: true,
    company: "ADEX Jordan Company",
    year: "2026",
    startDate: "2026-04",
    endDate: null,
    status: "Active Development",
    role: "Python Backend Developer",
    projectType: "Enterprise Commercial Product",
    coverImage: null,
    images: [
      { src: null, caption: "Analytics Dashboard — Replace with verified screenshot", type: "dashboard" },
      { src: null, caption: "Branch-level Reports — Replace with verified screenshot", type: "dashboard" },
      { src: null, caption: "Data Processing Architecture — Illustrative diagram", type: "architecture" },
      { src: null, caption: "API Overview — Replace with verified screenshot", type: "api" },
    ],
    technologies: ["Python", "Django", "PostgreSQL", "REST API"],
    features: [
      "Analytics backend for 1,000+ retail branches",
      "Processing ~1 billion sales records",
      "Multi-tenant SaaS architecture",
      "Role-based authentication and permissions",
      "API implementation for client integrations",
      "Tenant isolation workflows",
    ],
    responsibilities: [
      "Developed Django backend functionality for analytics platform",
      "Implemented APIs for data access and reporting",
      "Worked with authentication and permissions systems",
      "Implemented tenant isolation for SaaS systems",
      "Contributed to business workflow implementation",
      "Translated client requirements into maintainable Django solutions",
      "Coordinated with international clients",
      "Supported rapid iteration and delivery cycles",
    ],
    challenges: [
      {
        title: "Large-Scale Data Processing",
        problem: "Processing and querying approximately one billion sales records required careful optimization to maintain acceptable response times.",
        approach: "Applied Django ORM query optimization, database indexing strategies, and selective data aggregation.",
        solution: "Implemented optimized query patterns and database-level aggregation to handle large dataset queries efficiently.",
        result: "Platform handles analytics workloads for 1,000+ branches without performance degradation.",
      },
    ],
    metrics: [],
    links: [],
  },
  {
    id: 2,
    slug: "baggr-logistics",
    name: "BAGGR Logistics Platform",
    subtitle: "Microservices-based shipping and logistics platform with 99.9% uptime",
    shortDescription:
      "A shipping and logistics platform built with Django microservices, optimized database queries, containerized deployments, and production monitoring delivering 40% faster response times.",
    fullDescription: `BAGGR is a production shipping and logistics platform architected with Django microservices to handle real-world scale demands. The project involved designing microservice boundaries, implementing database performance optimizations, and establishing a containerized deployment pipeline with comprehensive monitoring.

The work produced measurable production improvements: 40% faster API response times through database optimization and indexing strategies, 80% shorter deployment cycles through Docker and CI/CD automation, and 99.9% uptime maintained through proactive Grafana and Prometheus monitoring.`,
    categories: ["Backend", "DevOps", "Logistics"],
    featured: true,
    biggestProject: false,
    confidential: false,
    company: "BAGGR",
    year: "2024",
    startDate: "2024-04",
    endDate: "2024-10",
    status: "Production",
    role: "Python Backend Developer",
    projectType: "Commercial Product",
    coverImage: null,
    images: [
      { src: null, caption: "Platform Architecture — Replace with verified screenshot", type: "architecture" },
      { src: null, caption: "Monitoring Dashboard — Replace with verified screenshot", type: "dashboard" },
    ],
    technologies: ["Python", "Django", "Docker", "Docker Compose", "CI/CD", "Grafana", "Prometheus"],
    features: [
      "Django microservices architecture",
      "Database query optimization and indexing",
      "Docker-based containerized deployment",
      "CI/CD pipeline automation",
      "Production monitoring with Grafana and Prometheus",
    ],
    responsibilities: [
      "Architected Django microservices",
      "Optimized database performance and query patterns",
      "Implemented database indexing strategies",
      "Created Docker-based deployment workflows",
      "Worked with CI/CD pipelines",
      "Implemented monitoring with Grafana and Prometheus",
    ],
    challenges: [
      {
        title: "Deployment Cycle Reduction",
        problem: "Manual deployment processes were causing slow release cycles and increasing risk of production errors.",
        approach: "Introduced Docker containerization and automated CI/CD pipelines to standardize and accelerate deployments.",
        solution: "Built fully automated Docker-based deployment workflows integrated with CI/CD tooling.",
        result: "80% reduction in deployment time.",
      },
    ],
    metrics: [
      { label: "Faster Response Times", value: "40%", note: "Through database optimization" },
      { label: "Shorter Deployment Time", value: "80%", note: "Through CI/CD automation" },
      { label: "Production Uptime", value: "99.9%", note: "Monitored via Grafana/Prometheus" },
    ],
    links: [],
  },
  {
    id: 3,
    slug: "mutqinai",
    name: "Mutqinai",
    subtitle: "AI-powered e-commerce platform with 5K+ daily API requests",
    shortDescription:
      "An AI-powered e-commerce platform using Django REST Framework, OpenAI GPT, Google Gemini, and LangChain to deliver personalized tools at scale with 99.5% uptime.",
    fullDescription: `Mutqinai is a production AI-powered e-commerce platform that integrates multiple LLM providers to deliver personalized capabilities at scale. The backend is built on Django REST Framework and handles over 5,000 daily API requests with 99.5% uptime.

The platform integrates OpenAI GPT, Google Gemini, and LangChain for AI-driven workflows, includes GDPR-compliant social authentication, uses caching and load balancing for performance, and incorporates GAN-based image processing. Deployed on a VPS with Apache serving as the web server.`,
    categories: ["Backend", "AI", "DevOps", "E-commerce"],
    featured: true,
    biggestProject: false,
    confidential: false,
    company: "Mutqinai",
    year: "2024",
    startDate: "2024-01",
    endDate: "2024-04",
    status: "Production",
    role: "Python Developer",
    projectType: "Commercial AI Product",
    coverImage: null,
    images: [
      { src: null, caption: "Platform Interface — Replace with verified screenshot", type: "desktop" },
    ],
    technologies: ["Python", "Django", "Django REST Framework", "OpenAI GPT", "Google Gemini", "LangChain", "Apache", "VPS"],
    features: [
      "AI-powered personalization via GPT, Gemini, LangChain",
      "GDPR-compliant social authentication",
      "GAN-based image processing functionality",
      "Caching and load balancing for scale",
      "VPS deployment with Apache",
    ],
    responsibilities: [
      "Built REST APIs with Django REST Framework",
      "Integrated OpenAI GPT and Google Gemini",
      "Used LangChain for AI workflow orchestration",
      "Implemented social and GDPR-compliant authentication",
      "Used caching and load balancing for performance",
      "Deployed the platform on VPS with Apache",
      "Worked with GAN-based image-processing functionality",
    ],
    challenges: [],
    metrics: [
      { label: "Daily API Requests", value: "5K+", note: "Sustained production traffic" },
      { label: "Platform Uptime", value: "99.5%", note: "Production reliability" },
    ],
    links: [
      { type: "live-site", label: "Visit mutqinai.com", url: "https://mutqinai.com", icon: "globe" },
    ],
  },
  {
    id: 4,
    slug: "prezza-app",
    name: "Prezza App",
    subtitle: "High-availability multi-vendor e-commerce and social platform",
    shortDescription:
      "A Qatar-based multi-vendor e-commerce and social platform built with Django REST Framework, async processing, Elasticsearch, Redis, Docker, and AWS EC2.",
    fullDescription: `Prezza is a Qatar-based multi-vendor e-commerce and social platform under active development. The backend is built with Django REST Framework and integrates a modern, production-grade infrastructure stack for high availability and scale.

The architecture uses PostgreSQL for data persistence, Redis and Celery for asynchronous task processing, Elasticsearch for full-text product search, Docker and Nginx for containerized deployment, AWS EC2 with Elastic Load Balancer for cloud hosting, GitHub Actions for CI/CD automation, and Prometheus and Grafana for monitoring.`,
    categories: ["Backend", "DevOps", "E-commerce"],
    featured: true,
    biggestProject: false,
    confidential: false,
    company: "— Edit to add company",
    year: "— Edit to add year",
    startDate: "— Edit to add start date",
    endDate: null,
    status: "Under Development",
    role: "Backend Developer",
    projectType: "Commercial Product",
    coverImage: null,
    images: [
      { src: null, caption: "Platform Architecture — Replace with verified screenshot", type: "architecture" },
      { src: null, caption: "Admin Dashboard — Replace with verified screenshot", type: "dashboard" },
    ],
    technologies: [
      "Python", "Django", "Django REST Framework", "PostgreSQL", "Celery",
      "Redis", "Elasticsearch", "Docker", "Nginx", "AWS EC2", "GitHub Actions",
      "Prometheus", "Grafana",
    ],
    features: [
      "Multi-vendor e-commerce marketplace",
      "Social platform features",
      "Elasticsearch product search",
      "Celery and Redis async task processing",
      "AWS EC2 with Elastic Load Balancer",
      "GitHub Actions CI/CD",
      "Prometheus and Grafana monitoring",
    ],
    responsibilities: [
      "Django REST Framework backend development",
      "PostgreSQL database design and management",
      "Celery and Redis async processing setup",
      "Elasticsearch integration",
      "Docker and Nginx containerized deployment",
      "AWS EC2 and Elastic Load Balancer configuration",
      "GitHub Actions CI/CD pipelines",
      "Prometheus and Grafana monitoring setup",
    ],
    challenges: [],
    metrics: [],
    links: [],
  },
  {
    id: 5,
    slug: "growth-analyzer-pro",
    name: "GrowthAnalyzerPro",
    subtitle: "Full-stack health analytics and ML platform for child stunting prediction",
    shortDescription:
      "A full-stack health analytics and machine-learning platform developed in collaboration with Qassim University for child stunting prediction using Django, React, Docker, and deep neural networks.",
    fullDescription: `GrowthAnalyzerPro is a research-grade full-stack platform developed in collaboration with Qassim University for child stunting prediction using machine learning. The project combined Django API engineering, React frontend, Docker deployment, and deep neural network development.

The ML component involved statistical analysis on health datasets, deep neural network development and optimization, nutritional status classification, and the development of a co-authored published research study. Agentic AI development tools including Claude Code and Gemini were used during the development process.`,
    categories: ["Full Stack", "Backend", "AI", "Machine Learning", "Research"],
    featured: false,
    biggestProject: false,
    confidential: false,
    company: "Qassim University (Collaboration)",
    year: "— Edit to add year",
    startDate: "— Edit to add start date",
    endDate: "— Edit to add end date",
    status: "Research Project",
    role: "Full-Stack Developer and Machine Learning Engineer",
    projectType: "Academic Research Project",
    coverImage: null,
    images: [
      { src: null, caption: "Platform Interface — Replace with screenshot", type: "desktop" },
      { src: null, caption: "ML Model Architecture — Replace with diagram", type: "architecture" },
    ],
    technologies: [
      "Python", "Django", "React", "Docker", "Nginx",
      "Deep Neural Networks", "Statistical Analysis", "Machine Learning",
    ],
    features: [
      "Django modular API architecture",
      "React frontend integration",
      "Machine learning model integration",
      "Statistical analysis on health datasets",
      "Deep neural network development",
      "Nutritional status classification",
      "Docker and Nginx deployment",
    ],
    responsibilities: [
      "Engineered a modular Django API",
      "Integrated machine-learning models",
      "Worked on React and Django deployment",
      "Used Docker and Nginx",
      "Conducted statistical analysis on health datasets",
      "Developed and optimized Deep Neural Networks",
      "Worked on nutritional status classification",
      "Co-authored a published research study",
    ],
    challenges: [],
    metrics: [],
    links: [
      { type: "research-paper", label: "Research Paper", url: "", icon: "document" },
      { type: "demo", label: "Live Demo", url: "", icon: "play" },
      { type: "github", label: "GitHub Repository", url: "", icon: "github" },
    ],
  },
  {
    id: 6,
    slug: "emilys-luxury",
    name: "Emily's Luxury",
    subtitle: "Saudi Arabian multi-vendor fashion marketplace",
    shortDescription:
      "A Saudi Arabian multi-vendor fashion platform that allows investors to showcase and sell dresses through a scalable Django backend deployed on VPS.",
    fullDescription: `Emily's Luxury is a production multi-vendor fashion marketplace serving the Saudi Arabian market. The platform allows fashion investors to list, showcase, and sell dresses through a structured vendor management system.

The backend was built with Django, supporting multi-vendor product and transaction workflows, and deployed on a VPS for production use.`,
    categories: ["Backend", "E-commerce"],
    featured: false,
    biggestProject: false,
    confidential: false,
    company: "— Edit to add company",
    year: "— Edit to add year",
    startDate: "— Edit to add start date",
    endDate: "— Edit to add end date",
    status: "Production",
    role: "Backend Developer",
    projectType: "Commercial Product",
    coverImage: null,
    images: [
      { src: null, caption: "Platform Interface — Replace with screenshot", type: "desktop" },
    ],
    technologies: ["Python", "Django", "VPS"],
    features: [
      "Multi-vendor marketplace architecture",
      "Product and transaction management",
      "Investor and vendor workflows",
      "VPS production deployment",
    ],
    responsibilities: [
      "Developed the Django backend",
      "Supported multi-vendor product workflows",
      "Supported transaction functionality",
      "Deployed the project on a VPS",
    ],
    challenges: [],
    metrics: [],
    links: [
      { type: "landing-page", label: "Visit emily.sa", url: "https://emily.sa", icon: "globe" },
    ],
  },
  {
    id: 7,
    slug: "speaking-fingers",
    name: "Speaking Fingers",
    subtitle: "Arabic Sign Language translation system with computer vision and TTS",
    shortDescription:
      "An Arabic Sign Language translation system combining computer vision, Django backend services, YOLO, CNN-based recognition, and text-to-speech functionality. Awarded 1st place at Annual Student Conference.",
    fullDescription: `Speaking Fingers is a graduation project that translates Arabic Sign Language into spoken text using computer vision and deep learning. The system combines a Django backend with YOLO and CNN-based gesture recognition models and a text-to-speech pipeline.

The project was recognized with first place at the Annual Student Conference for research on Arabic Sign Language recognition and speech generation. It was deployed on a VPS with authentication and authorization systems built into the backend.`,
    categories: ["AI", "Backend", "Computer Vision"],
    featured: true,
    biggestProject: false,
    confidential: false,
    company: "Graduation Project",
    year: "2024",
    startDate: "2023-09",
    endDate: "2024-06",
    status: "Completed",
    role: "Backend Developer and AI Contributor",
    projectType: "Academic / Research Project",
    coverImage: null,
    images: [
      { src: null, caption: "System Demo — Replace with screenshot", type: "mobile" },
      { src: null, caption: "Architecture Diagram — Replace with diagram", type: "architecture" },
    ],
    technologies: ["Python", "Django", "YOLO", "CNN", "Text-to-Speech", "Computer Vision", "VPS"],
    features: [
      "Arabic Sign Language gesture recognition",
      "YOLO-based real-time detection",
      "CNN-based classification",
      "Text-to-speech output pipeline",
      "Django backend with auth",
      "VPS deployment",
    ],
    responsibilities: [
      "Developed the Django backend",
      "Integrated YOLO and CNN AI models",
      "Implemented text-to-speech functionality",
      "Implemented authentication and authorization",
      "Deployed the application on a VPS",
    ],
    challenges: [],
    metrics: [],
    links: [
      { type: "github", label: "GitHub Repository", url: "", icon: "github" },
      { type: "demo-video", label: "Demo Video", url: "", icon: "play" },
    ],
  },
  {
    id: 8,
    slug: "pyqt5-project-placeholder-1",
    name: "PyQt5 Project — Add Project Details",
    subtitle: "Desktop application built with PyQt5 — Edit to add subtitle",
    shortDescription:
      "A PyQt5 desktop application — replace this placeholder with your project description, features, and technical details.",
    fullDescription: `This is a placeholder for a PyQt5 desktop project. Edit this entry to add the real project name, description, features, screenshots, and technical details.`,
    categories: ["Desktop Apps"],
    featured: false,
    biggestProject: false,
    confidential: false,
    company: "— Edit to add company or client",
    year: "— Edit",
    startDate: "— Edit",
    endDate: null,
    status: "— Edit to add status",
    role: "Python Desktop Developer",
    projectType: "Desktop Application",
    coverImage: null,
    images: [
      { src: null, caption: "App Screenshot — Replace with actual screenshot", type: "desktop" },
    ],
    technologies: ["Python", "PyQt5", "— Add technologies"],
    features: ["— Add main feature", "— Add main feature", "— Add main feature"],
    responsibilities: ["— Add responsibilities"],
    challenges: [],
    metrics: [],
    links: [
      { type: "desktop-download", label: "Download App", url: "", icon: "download" },
      { type: "github", label: "GitHub Repository", url: "", icon: "github" },
      { type: "demo-video", label: "Demo Video", url: "", icon: "play" },
    ],
  },
  {
    id: 9,
    slug: "desktop-system-placeholder-2",
    name: "Desktop System — Add Project Details",
    subtitle: "PyQt5 desktop system — Edit to add subtitle",
    shortDescription:
      "A PyQt5 desktop system — replace this placeholder with your project description, platforms, and technical details.",
    fullDescription: `This is a placeholder for a second PyQt5 desktop project. Edit this entry to add the real project name, description, features, screenshots, and technical details.`,
    categories: ["Desktop Apps"],
    featured: false,
    biggestProject: false,
    confidential: false,
    company: "— Edit to add company or client",
    year: "— Edit",
    startDate: "— Edit",
    endDate: null,
    status: "— Edit to add status",
    role: "Python Desktop Developer",
    projectType: "Desktop Application",
    coverImage: null,
    images: [
      { src: null, caption: "App Screenshot — Replace with actual screenshot", type: "desktop" },
    ],
    technologies: ["Python", "PyQt5", "— Add technologies"],
    features: ["— Add main feature", "— Add main feature"],
    responsibilities: ["— Add responsibilities"],
    challenges: [],
    metrics: [],
    links: [
      { type: "desktop-download", label: "Download App", url: "", icon: "download" },
      { type: "github", label: "GitHub Repository", url: "", icon: "github" },
    ],
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const getProjectsByCategory = (category: string) =>
  category === "All" ? projects : projects.filter((p) => p.categories.includes(category));

export const CATEGORIES = ["All", "Backend", "Full Stack", "AI", "Desktop Apps", "DevOps"];
