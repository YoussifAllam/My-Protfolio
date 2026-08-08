export interface ExperienceEntry {
  id: number;
  company: string;
  role: string;
  type: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  highlights: string[];
  technologies?: string[];
  special?: boolean;
  specialLabel?: string;
}

export const experiences: ExperienceEntry[] = [
  {
    id: 1,
    company: "ADEX Jordan Company",
    role: "Python Backend Developer",
    type: "Full Time",
    location: "Remote, Jordan",
    startDate: "April 2026",
    endDate: null,
    current: true,
    highlights: [
      "Developed Django analytics backend functionality for a platform supporting 1,000+ branches and ~1 billion sales records",
      "Contributed to multi-tenant SaaS systems and delivery applications",
      "Implemented APIs, tenant isolation, authentication, permissions, and business workflows",
      "Translated complex client requirements into maintainable, scalable Django solutions",
      "Coordinated with international clients and cross-functional teams",
      "Supported rapid iteration and delivery cycles",
    ],
    technologies: ["Python", "Django", "PostgreSQL", "REST API", "Multi-tenant SaaS"],
  },
  {
    id: 2,
    company: "Moussa Academy",
    role: "Software Programming Instructor",
    type: "Part Time",
    location: "Remote, Saudi Arabia",
    startDate: "April 2026",
    endDate: null,
    current: true,
    highlights: [
      "Delivered recorded programming lessons for structured course content",
      "Delivered live group sessions for interactive learning",
      "Provided one-to-one tutoring for students requiring focused support",
      "Prepared educational technical content including exercises and examples",
      "Helped students strengthen problem-solving confidence",
    ],
    technologies: ["Python", "Teaching", "Problem Solving"],
  },
  {
    id: 3,
    company: "Egypt Armed Forces",
    role: "Military Service",
    type: "Mandatory Service",
    location: "Egypt",
    startDate: "October 2024",
    endDate: "February 2026",
    current: false,
    highlights: ["Completed mandatory military service"],
    special: true,
    specialLabel: "Mandatory Service",
  },
  {
    id: 4,
    company: "BAGGR",
    role: "Python Backend Developer",
    type: "Remote Full Time",
    location: "Remote",
    startDate: "April 2024",
    endDate: "October 2024",
    current: false,
    highlights: [
      "Architected Django microservices to handle production-scale logistics workloads",
      "Optimized database performance through query analysis and indexing strategies",
      "Created Docker-based deployment workflows reducing deployment time by 80%",
      "Implemented CI/CD pipelines for automated testing and delivery",
      "Set up Grafana and Prometheus monitoring for 99.9% production uptime",
      "Delivered 40% improvement in API response times",
    ],
    technologies: ["Python", "Django", "Docker", "CI/CD", "Grafana", "Prometheus"],
  },
  {
    id: 5,
    company: "Mutqinai",
    role: "Python Developer",
    type: "Hybrid Full Time",
    location: "Cairo, Egypt",
    startDate: "January 2024",
    endDate: "April 2024",
    current: false,
    highlights: [
      "Built REST APIs with Django REST Framework handling 5K+ daily requests",
      "Integrated OpenAI GPT, Google Gemini, and LangChain for AI workflows",
      "Implemented GDPR-compliant social authentication",
      "Applied caching and load balancing for platform performance at 99.5% uptime",
      "Deployed the platform on VPS with Apache",
      "Worked with GAN-based image-processing functionality",
    ],
    technologies: ["Python", "Django", "DRF", "OpenAI", "Gemini", "LangChain", "Apache", "VPS"],
  },
];

export interface SkillGroup {
  category: string;
  icon: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Backend",
    icon: "server",
    skills: ["Python", "Django", "Django REST Framework"],
  },
  {
    category: "Databases",
    icon: "database",
    skills: ["PostgreSQL", "MySQL", "MS SQL Server"],
  },
  {
    category: "Caching & Queues",
    icon: "lightning",
    skills: ["Redis", "Celery"],
  },
  {
    category: "DevOps & CI/CD",
    icon: "gear",
    skills: ["Docker", "Docker Compose", "GitHub Actions"],
  },
  {
    category: "Cloud & Infrastructure",
    icon: "cloud",
    skills: ["AWS EC2", "Nginx", "Apache", "VPS Deployment"],
  },
  {
    category: "Monitoring",
    icon: "chart",
    skills: ["Grafana", "Prometheus"],
  },
  {
    category: "Security",
    icon: "lock",
    skills: ["OAuth 2.0", "JWT", "GDPR-compliant Auth"],
  },
  {
    category: "Machine Learning",
    icon: "brain",
    skills: ["Regression", "Classification", "Time-series Forecasting"],
  },
  {
    category: "Deep Learning",
    icon: "neural",
    skills: ["CNNs", "Image Classification", "Transfer Learning", "Action Detection"],
  },
  {
    category: "AI Integrations",
    icon: "ai",
    skills: ["OpenAI GPT", "Google Gemini", "LangChain", "YOLO"],
  },
  {
    category: "Desktop Development",
    icon: "desktop",
    skills: ["PyQt5", "Multithreading", "Background Workers", "Linux / Windows Apps"],
  },
  {
    category: "Version Control",
    icon: "git",
    skills: ["Git", "GitHub"],
  },
];

export const achievements = [
  {
    id: 1,
    title: "Kaggle Notebooks Master",
    description: "Ranked 61st globally out of more than 312,000 developers on Kaggle.",
    icon: "trophy",
    highlight: "#61",
    highlightLabel: "Global Rank",
    detail: "Out of 312,000+ developers",
    color: "yellow",
  },
  {
    id: 2,
    title: "NASA Space Apps Cairo",
    description: "Reached the national final with a project focused on endangered marine-organism conservation.",
    icon: "rocket",
    highlight: "National Final",
    highlightLabel: "Achievement",
    detail: "Marine organism conservation project",
    color: "blue",
  },
  {
    id: 3,
    title: "IEEE Xtreme",
    description: "Ranked among the top 20 teams in Egypt in the international IEEE Xtreme problem-solving competition.",
    icon: "code",
    highlight: "Top 20",
    highlightLabel: "Teams in Egypt",
    detail: "International IEEE Xtreme competition",
    color: "blue",
  },
  {
    id: 4,
    title: "Annual Student Conference — 1st Place",
    description: "Awarded first place for research on Arabic Sign Language recognition and speech generation using CNNs and YOLO.",
    icon: "medal",
    highlight: "1st Place",
    highlightLabel: "Award",
    detail: "Applied Sciences — ASL Recognition research",
    color: "green",
  },
];
