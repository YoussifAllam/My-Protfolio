from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand

from apps.portfolio.models import (
    Achievement,
    ExperienceEntry,
    Profile,
    Project,
    ProjectImage,
    SkillGroup,
)

# Screenshots bundled in the repo (see the directory itself for why: unlike
# `media/`, this is source, not runtime uploads, so it survives a deploy's
# rsync and is what `_seed_project_media` below reads from).
SEED_MEDIA_DIR = Path(__file__).resolve().parent.parent.parent / "seed_media"

# Cover + gallery images for projects seeded above, keyed by slug. Only
# consulted the first time a project is created — see `_seed_project_media`.
PROJECT_MEDIA = {
    "aquacloud-junaidi-water": {
        "cover": "aquacloud/client-login.png",
        "gallery": [
            ("aquacloud/client-login.png", "Customer app — branded login", "mobile"),
            (
                "aquacloud/client-home.png",
                "Customer app — home: next delivery slot & coupon balance",
                "mobile",
            ),
            (
                "aquacloud/client-orders.png",
                "Customer app — order history & status",
                "mobile",
            ),
            (
                "aquacloud/client-cart-coupon-split.png",
                "Customer app — cart with cash/coupon payment split",
                "mobile",
            ),
            (
                "aquacloud/client-checkout.png",
                "Customer app — checkout summary",
                "mobile",
            ),
            (
                "aquacloud/client-account.png",
                "Customer app — account & coupon balance",
                "mobile",
            ),
            (
                "aquacloud/agent-home.jpg",
                "Agent app — cash box balance & today's delivery round",
                "mobile",
            ),
            (
                "aquacloud/agent-cashbox.jpg",
                "Agent app — cash box detail & collections",
                "mobile",
            ),
            (
                "aquacloud/agent-tour-round.jpg",
                "Agent app — delivery round with per-stop status",
                "mobile",
            ),
            (
                "aquacloud/agent-order-detail.jpg",
                "Agent app — order detail with empty-bottle exchange",
                "mobile",
            ),
            (
                "aquacloud/agent-door-orders.jpg",
                "Agent app — door orders (walk-up sales)",
                "mobile",
            ),
            (
                "aquacloud/agent-door-order-catalog.jpg",
                "Agent app — door order product catalog",
                "mobile",
            ),
        ],
    },
}

PROFILE = {
    "name": "Youssif Hassan",
    "primary_role": "Python Backend Developer",
    "headline": "Building scalable Django systems and powerful Python applications.",
    "summary": (
        "Python Backend Developer with 2.5+ years of experience building scalable APIs, "
        "data-intensive platforms, containerized deployments, PyQt5 desktop applications, "
        "and AI-powered solutions."
    ),
    "location": "Cairo, Egypt",
    "email": "youssifhassan011@gmail.com",
    "availability": "Available for Python and Django opportunities",
    # cv_file is deliberately absent: it's uploaded through admin, not seeded
    # (see Profile.cv_file) — including it here as None would null out
    # whatever was uploaded on every reseed, exactly like the cover_image
    # bug fixed below for Project.
    "tech_stack": [
        "Python",
        "Django",
        "Django REST Framework",
        "PostgreSQL",
        "Redis",
        "Celery",
        "Docker",
        "PyQt5",
    ],
    "metrics": [
        {"value": "2.5+", "label": "Years Experience"},
        {"value": "1,000+", "label": "Branches Supported"},
        {"value": "~1B", "label": "Sales Records Handled"},
        {"value": "5K+", "label": "Daily API Requests"},
        {"value": "40%", "label": "Faster Response Times"},
        {"value": "80%", "label": "Shorter Deployment Cycles"},
        {"value": "99.9%", "label": "Production Uptime"},
    ],
    # These are the verified, live profile URLs — keep in sync with
    # front/src/data/social.ts if either changes.
    "social_links": [
        {"label": "GitHub", "url": "https://github.com/YoussifAllam"},
        {
            "label": "LinkedIn",
            "url": "https://www.linkedin.com/in/youssif-hassan-495697249/",
        },
        {"label": "Medium", "url": "https://medium.com/@youssifhassan011"},
        {"label": "Codeforces", "url": "https://codeforces.com/profile/youssif.hassan"},
        {"label": "LeetCode", "url": "https://leetcode.com/u/youssifhassan011/"},
        {"label": "Kaggle", "url": "https://www.kaggle.com/youssifhassan"},
    ],
    "about_sections": [
        {
            "id": "intro",
            "title": "Professional Introduction",
            "content": (
                "I am a Python Backend Developer with 2.5+ years of professional experience "
                "building scalable Django systems, production REST APIs, data-intensive "
                "platforms, and AI-powered products."
            ),
        },
        {
            "id": "approach",
            "title": "Backend Engineering Approach",
            "content": (
                "I start every system design from the data model, with clear schemas, proper "
                "indexing, thoughtful query design, explicit API contracts, layered "
                "authentication, granular permissions, and async task offloading."
            ),
        },
        {
            "id": "python",
            "title": "Why Python",
            "content": (
                "Python's clarity and ecosystem let me move between backend systems, desktop "
                "applications, and AI integrations with the same language and rigorous thinking."
            ),
        },
        {
            "id": "django",
            "title": "Why Django Backend Engineering",
            "content": (
                "Django gives me ORM, authentication, permissions, admin, migrations, signals, "
                "and a mature REST layer through DRF for systems that move fast and scale."
            ),
        },
        {
            "id": "desktop",
            "title": "Desktop Development",
            "content": (
                "I build PyQt5 desktop applications for local-first workflows, hardware "
                "integrations, and enterprise tooling on Linux and Windows."
            ),
        },
        {
            "id": "devops",
            "title": "DevOps & Deployment",
            "content": (
                "I containerize projects with Docker, automate testing and deployment with "
                "GitHub Actions CI/CD, configure Nginx and Apache, and monitor systems with "
                "Prometheus and Grafana."
            ),
        },
        {
            "id": "ai",
            "title": "AI & Research",
            "content": (
                "I have integrated OpenAI GPT, Google Gemini, and LangChain into production "
                "platforms, built deep neural networks for health research, and developed "
                "computer vision systems for Arabic Sign Language recognition."
            ),
        },
        {
            "id": "teaching",
            "title": "Teaching & Communication",
            "content": (
                "As a part-time instructor at Moussa Academy, I design and deliver programming "
                "lessons for students learning Python and software engineering."
            ),
        },
    ],
}


PROJECTS = [
    {
        "slug": "jafco-analytics",
        "name": "JAFCO Analytics Backend",
        "subtitle": "Enterprise-scale Django analytics platform for retail operations",
        "short_description": (
            "A Django analytics backend supporting more than 1,000 branches and processing "
            "approximately one billion sales records for a large retail enterprise."
        ),
        "full_description": (
            "JAFCO Analytics Backend is a large-scale enterprise platform built to handle "
            "analytics operations for a major retail chain. The system supports over 1,000 "
            "branches and processes approximately one billion sales records, requiring careful "
            "architectural decisions around data modeling, query optimization, and business "
            "workflow design."
        ),
        "categories": ["Backend", "Enterprise System", "Data Platform"],
        "featured": True,
        "biggest_project": True,
        "confidential": True,
        "company": "ADEX Jordan Company",
        "year": "2026",
        "start_date": "2026-04",
        "end_date": None,
        "status": "Active Development",
        "role": "Python Backend Developer",
        "project_type": "Enterprise Commercial Product",
        "cover_image": None,
        "images": [
            {"src": None, "caption": "Analytics Dashboard", "type": "dashboard"},
            {
                "src": None,
                "caption": "Data Processing Architecture",
                "type": "architecture",
            },
        ],
        "technologies": ["Python", "Django", "PostgreSQL", "REST API"],
        "features": [
            "Analytics backend for 1,000+ retail branches",
            "Processing ~1 billion sales records",
            "Multi-tenant SaaS architecture",
            "Role-based authentication and permissions",
        ],
        "responsibilities": [
            "Developed Django backend functionality for analytics platform",
            "Implemented APIs for data access and reporting",
            "Worked with authentication and permissions systems",
            "Translated client requirements into maintainable Django solutions",
        ],
        "challenges": [
            {
                "title": "Large-Scale Data Processing",
                "problem": "Querying approximately one billion sales records needed optimization.",
                "approach": "Applied ORM optimization, indexing, and selective aggregation.",
                "solution": "Implemented optimized query patterns and database-level aggregation.",
                "result": "Platform handles analytics workloads for 1,000+ branches.",
            }
        ],
        "metrics": [],
        "links": [],
    },
    {
        "slug": "aquacloud-junaidi-water",
        "name": "AquaCloud — Al-Junaidi Water",
        "subtitle": (
            "Multi-tenant Django platform behind a live water-delivery business: "
            "customer app, agent app, and admin dashboard"
        ),
        "short_description": (
            "AquaCloud is a multi-tenant coupon-based delivery platform backend: customers "
            "prepay for coupon codes and spend them on water/product orders, delivery agents "
            "run daily rounds and collect cash, and admins run the whole business from a "
            "dashboard. Live in production for Al-Junaidi Water on Google Play and the App Store."
        ),
        "full_description": (
            "AquaCloud is a Django REST Framework backend powering three client surfaces for a "
            "real water-delivery company: a customer mobile app, a delivery-agent mobile app, "
            "and an admin dashboard, all sharing one multi-tenant Tenant → Branch → Zone data "
            "model so the same platform can be white-labeled for other distributors.\n\n"
            "Customers buy prepaid coupon-code packages and spend them (or cash, or a mix, "
            "via a per-order payment split) on recurring water and grocery orders, track "
            "delivery schedules, and manage addresses. Delivery agents run scheduled tours "
            "assigned by branch, update per-stop order status, handle empty-bottle exchanges, "
            "take door orders from walk-up customers, and reconcile a running cash-box balance "
            "at day's end. Admins and branch sub-admins manage products, pricing, coupon "
            "policy, branches/zones, staff permissions, and reporting for their tenant.\n\n"
            "Built on Django 5 + DRF with function-based views only, SimpleJWT auth (OTP "
            "phone login for customers, username/password for staff), Celery for tour "
            "reminders, Django Channels + Redis for real-time notifications, and a Unfold "
            "themed admin."
        ),
        "categories": ["Backend", "Full Stack", "Multi-Tenant SaaS", "Mobile"],
        "featured": True,
        "biggest_project": False,
        "confidential": False,
        "company": "ADEX Jordan Company",
        "year": "2026",
        "start_date": "2026-04",
        "end_date": None,
        "status": "Production",
        "role": "Python Backend Developer",
        "project_type": "Commercial SaaS Platform (client + agent apps, admin dashboard)",
        "cover_image": None,
        "images": [],
        "technologies": [
            "Python",
            "Django",
            "Django REST Framework",
            "PostgreSQL",
            "SimpleJWT",
            "Celery",
            "Redis",
            "Django Channels",
            "django-tenants",
            "Unfold Admin",
        ],
        "features": [
            "Multi-tenant Tenant → Branch → Zone hierarchy, white-labelable per distributor",
            "Prepaid coupon-code system with mixed cash/coupon payment splits per order",
            "Customer app: OTP phone login, delivery scheduling, order history, addresses",
            "Agent app: daily delivery tours, per-stop status, empty-bottle exchange, "
            "door orders, cash-box reconciliation",
            "Admin dashboard: products, pricing, branches/zones, staff permissions, reporting",
            "Role-based access (customer / agent / sub-admin / admin) with per-branch scoping",
            "Real-time WebSocket notifications over Django Channels + Redis",
        ],
        "responsibilities": [
            "Built the Django REST Framework backend serving all three client apps",
            "Designed the multi-tenant Tenant/Branch/Zone data model and coupon payment system",
            "Implemented OTP-based customer auth and staff JWT auth with role/permission scoping",
            "Built delivery-agent tour, cash-box, and door-order workflows",
            "Deployed and maintain the platform in production",
        ],
        "challenges": [
            {
                "title": "One Backend, Three Very Different Clients",
                "problem": (
                    "Customers, delivery agents, and admins need very different data and "
                    "permissions from the same underlying orders/products/tenant data."
                ),
                "approach": (
                    "Centralized role + permission checks in a single access layer "
                    "(role_required / permission_required / branch_required decorators) "
                    "instead of duplicating scoping logic per app."
                ),
                "solution": (
                    "Each app's views call shared visibility helpers that scope orders/"
                    "products/customers by the caller's role and branch membership."
                ),
                "result": (
                    "Three independently deployed apps (customer, agent, admin) stay "
                    "consistent against one backend and one source of truth."
                ),
            }
        ],
        "metrics": [],
        "links": [
            {
                "type": "google-play",
                "label": "Google Play — العميل مياه الجنيدي",
                "url": (
                    "https://play.google.com/store/apps/details"
                    "?id=com.adex.aquacloud.junaidi&hl=ar"
                ),
            },
            {
                "type": "app-store",
                "label": "App Store — العميل مياه الجنيدي",
                "url": (
                    "https://apps.apple.com/us/app/"
                    "%D9%85%D9%8A%D8%A7%D9%87-%D8%A7%D9%84%D8%AC%D9%86%D9%8A%D8%AF%D9%8A"
                    "/id6795517365"
                ),
            },
            {
                "type": "google-play",
                "label": "Google Play — المندوب مياه الجنيدي",
                "url": (
                    "https://play.google.com/store/apps/details?id=com.adex.aquacloud.junaidi.driver"
                ),
            },
            {
                "type": "app-store",
                "label": "App Store — المندوب مياه الجنيدي",
                "url": ("https://apps.apple.com/us/app/6796311081"),
            },
        ],
    },
    {
        "slug": "baggr-logistics",
        "name": "BAGGR Logistics Platform",
        "subtitle": "Microservices-based shipping and logistics platform with 99.9% uptime",
        "short_description": (
            "A shipping and logistics platform built with Django microservices, optimized "
            "database queries, containerized deployments, and production monitoring."
        ),
        "full_description": (
            "BAGGR is a production shipping and logistics platform architected with Django "
            "microservices. The work produced 40% faster API response times, 80% shorter "
            "deployment cycles, and 99.9% uptime through monitoring."
        ),
        "categories": ["Backend", "DevOps", "Logistics"],
        "featured": True,
        "biggest_project": False,
        "confidential": False,
        "company": "BAGGR",
        "year": "2024",
        "start_date": "2024-04",
        "end_date": "2024-10",
        "status": "Production",
        "role": "Python Backend Developer",
        "project_type": "Commercial Product",
        "cover_image": None,
        "images": [
            {"src": None, "caption": "Platform Architecture", "type": "architecture"}
        ],
        "technologies": [
            "Python",
            "Django",
            "Docker",
            "CI/CD",
            "Grafana",
            "Prometheus",
        ],
        "features": [
            "Django microservices architecture",
            "Database query optimization and indexing",
            "Docker-based deployment",
            "Production monitoring",
        ],
        "responsibilities": [
            "Architected Django microservices",
            "Optimized database performance",
            "Created Docker-based deployment workflows",
            "Implemented monitoring with Grafana and Prometheus",
        ],
        "challenges": [
            {
                "title": "Deployment Cycle Reduction",
                "problem": "Manual deployments slowed releases and increased production risk.",
                "approach": "Introduced Docker and CI/CD automation.",
                "solution": "Built automated Docker-based deployment workflows.",
                "result": "80% reduction in deployment time.",
            }
        ],
        "metrics": [
            {
                "label": "Faster Response Times",
                "value": "40%",
                "note": "Through DB optimization",
            },
            {
                "label": "Shorter Deployment Time",
                "value": "80%",
                "note": "Through CI/CD",
            },
            {
                "label": "Production Uptime",
                "value": "99.9%",
                "note": "Grafana/Prometheus",
            },
        ],
        "links": [],
    },
    {
        "slug": "mutqinai",
        "name": "Mutqinai",
        "subtitle": "AI-powered e-commerce platform with 5K+ daily API requests",
        "short_description": (
            "An AI-powered e-commerce platform using DRF, OpenAI GPT, Google Gemini, and "
            "LangChain to deliver personalized tools at scale."
        ),
        "full_description": (
            "Mutqinai is a production AI-powered e-commerce platform integrating multiple LLM "
            "providers. The backend is built on Django REST Framework and handles over 5,000 "
            "daily API requests with 99.5% uptime."
        ),
        "categories": ["Backend", "AI", "DevOps", "E-commerce"],
        "featured": True,
        "biggest_project": False,
        "confidential": False,
        "company": "Mutqinai",
        "year": "2024",
        "start_date": "2024-01",
        "end_date": "2024-04",
        "status": "Production",
        "role": "Python Developer",
        "project_type": "Commercial AI Product",
        "cover_image": None,
        "images": [{"src": None, "caption": "Platform Interface", "type": "desktop"}],
        "technologies": [
            "Python",
            "Django",
            "Django REST Framework",
            "OpenAI GPT",
            "Google Gemini",
            "LangChain",
            "Apache",
            "VPS",
        ],
        "features": [
            "AI-powered personalization",
            "GDPR-compliant social authentication",
            "Caching and load balancing",
            "VPS deployment with Apache",
        ],
        "responsibilities": [
            "Built REST APIs with Django REST Framework",
            "Integrated OpenAI GPT and Google Gemini",
            "Used LangChain for AI workflows",
            "Deployed the platform on VPS with Apache",
        ],
        "challenges": [],
        "metrics": [
            {
                "label": "Daily API Requests",
                "value": "5K+",
                "note": "Production traffic",
            },
            {
                "label": "Platform Uptime",
                "value": "99.5%",
                "note": "Production reliability",
            },
        ],
        "links": [
            {
                "type": "live-site",
                "label": "Visit mutqinai.com",
                "url": "https://mutqinai.com",
            }
        ],
    },
    {
        "slug": "prezza-app",
        "name": "Prezza App",
        "subtitle": "High-availability multi-vendor e-commerce and social platform",
        "short_description": (
            "A Qatar-based multi-vendor e-commerce and social platform built with DRF, async "
            "processing, Elasticsearch, Redis, Docker, and AWS EC2."
        ),
        "full_description": (
            "Prezza is a Qatar-based multi-vendor e-commerce and social platform under active "
            "development. The backend uses PostgreSQL, Redis, Celery, Elasticsearch, Docker, "
            "Nginx, AWS EC2, GitHub Actions, Prometheus, and Grafana."
        ),
        "categories": ["Backend", "DevOps", "E-commerce"],
        "featured": True,
        "biggest_project": False,
        "confidential": False,
        "company": "",
        "year": "",
        "start_date": "",
        "end_date": None,
        "status": "Under Development",
        "role": "Backend Developer",
        "project_type": "Commercial Product",
        "cover_image": None,
        "images": [
            {"src": None, "caption": "Platform Architecture", "type": "architecture"}
        ],
        "technologies": [
            "Python",
            "Django",
            "Django REST Framework",
            "PostgreSQL",
            "Celery",
            "Redis",
            "Elasticsearch",
            "Docker",
            "Nginx",
            "AWS EC2",
            "GitHub Actions",
            "Prometheus",
            "Grafana",
        ],
        "features": [
            "Multi-vendor e-commerce marketplace",
            "Social platform features",
            "Elasticsearch product search",
            "Celery and Redis async processing",
        ],
        "responsibilities": [
            "DRF backend development",
            "PostgreSQL database design",
            "Celery and Redis setup",
            "AWS and Nginx deployment configuration",
        ],
        "challenges": [],
        "metrics": [],
        "links": [],
    },
    {
        "slug": "growth-analyzer-pro",
        "name": "GrowthAnalyzerPro",
        "subtitle": "Full-stack health analytics and ML platform for child stunting prediction",
        "short_description": (
            "A full-stack health analytics and machine-learning platform developed with Qassim "
            "University using Django, React, Docker, and deep neural networks."
        ),
        "full_description": (
            "GrowthAnalyzerPro is a research-grade full-stack platform for child stunting "
            "prediction using machine learning, combining Django API engineering, React, Docker, "
            "and deep neural network development."
        ),
        "categories": ["Full Stack", "Backend", "AI", "Machine Learning", "Research"],
        "featured": False,
        "biggest_project": False,
        "confidential": False,
        "company": "Qassim University (Collaboration)",
        "year": "",
        "start_date": "",
        "end_date": "",
        "status": "Research Project",
        "role": "Full-Stack Developer and Machine Learning Engineer",
        "project_type": "Academic Research Project",
        "cover_image": None,
        "images": [{"src": None, "caption": "Platform Interface", "type": "desktop"}],
        "technologies": [
            "Python",
            "Django",
            "React",
            "Docker",
            "Nginx",
            "Deep Neural Networks",
            "Statistical Analysis",
            "Machine Learning",
        ],
        "features": [
            "Django modular API architecture",
            "React frontend integration",
            "Machine learning model integration",
            "Statistical analysis on health datasets",
        ],
        "responsibilities": [
            "Engineered a modular Django API",
            "Integrated machine-learning models",
            "Worked on React and Django deployment",
            "Co-authored a published research study",
        ],
        "challenges": [],
        "metrics": [],
        "links": [],
    },
    {
        "slug": "emilys-luxury",
        "name": "Emily's Luxury",
        "subtitle": "Saudi Arabian multi-vendor fashion marketplace",
        "short_description": (
            "A Saudi Arabian multi-vendor fashion platform allowing investors to showcase and "
            "sell dresses through a scalable Django backend deployed on VPS."
        ),
        "full_description": (
            "Emily's Luxury is a production multi-vendor fashion marketplace serving the Saudi "
            "Arabian market with vendor, product, and transaction workflows."
        ),
        "categories": ["Backend", "E-commerce"],
        "featured": False,
        "biggest_project": False,
        "confidential": False,
        "company": "",
        "year": "",
        "start_date": "",
        "end_date": "",
        "status": "Production",
        "role": "Backend Developer",
        "project_type": "Commercial Product",
        "cover_image": None,
        "images": [{"src": None, "caption": "Platform Interface", "type": "desktop"}],
        "technologies": ["Python", "Django", "VPS"],
        "features": [
            "Multi-vendor marketplace architecture",
            "Product and transaction management",
            "Investor and vendor workflows",
            "VPS production deployment",
        ],
        "responsibilities": [
            "Developed the Django backend",
            "Supported multi-vendor product workflows",
            "Deployed the project on a VPS",
        ],
        "challenges": [],
        "metrics": [],
        "links": [
            {
                "type": "landing-page",
                "label": "Visit emily.sa",
                "url": "https://emily.sa",
            }
        ],
    },
    {
        "slug": "speaking-fingers",
        "name": "Speaking Fingers",
        "subtitle": "Arabic Sign Language translation system with computer vision and TTS",
        "short_description": (
            "An Arabic Sign Language translation system combining computer vision, Django, YOLO, "
            "CNN-based recognition, and text-to-speech functionality."
        ),
        "full_description": (
            "Speaking Fingers is a graduation project that translates Arabic Sign Language into "
            "spoken text using computer vision and deep learning, recognized with first place at "
            "the Annual Student Conference."
        ),
        "categories": ["AI", "Backend", "Computer Vision"],
        "featured": True,
        "biggest_project": False,
        "confidential": False,
        "company": "Graduation Project",
        "year": "2024",
        "start_date": "2023-09",
        "end_date": "2024-06",
        "status": "Completed",
        "role": "Backend Developer and AI Contributor",
        "project_type": "Academic / Research Project",
        "cover_image": None,
        "images": [{"src": None, "caption": "System Demo", "type": "mobile"}],
        "technologies": [
            "Python",
            "Django",
            "YOLO",
            "CNN",
            "Text-to-Speech",
            "Computer Vision",
        ],
        "features": [
            "Arabic Sign Language gesture recognition",
            "YOLO-based real-time detection",
            "CNN-based classification",
            "Text-to-speech output pipeline",
        ],
        "responsibilities": [
            "Developed the Django backend",
            "Integrated YOLO and CNN AI models",
            "Implemented text-to-speech functionality",
            "Deployed the application on a VPS",
        ],
        "challenges": [],
        "metrics": [],
        "links": [],
    },
    {
        "slug": "pyqt5-project-placeholder-1",
        "name": "PyQt5 Project - Add Project Details",
        "draft": True,
        "subtitle": "Desktop application built with PyQt5 - Edit to add subtitle",
        "short_description": (
            "A PyQt5 desktop application - replace this placeholder with your project "
            "description, features, and technical details."
        ),
        "full_description": (
            "This is a placeholder for a PyQt5 desktop project. Edit this entry to add the real "
            "project name, description, features, screenshots, and technical details."
        ),
        "categories": ["Desktop Apps"],
        "featured": False,
        "biggest_project": False,
        "confidential": False,
        "company": "",
        "year": "",
        "start_date": "",
        "end_date": None,
        "status": "",
        "role": "Python Desktop Developer",
        "project_type": "Desktop Application",
        "cover_image": None,
        "images": [{"src": None, "caption": "App Screenshot", "type": "desktop"}],
        "technologies": ["Python", "PyQt5"],
        "features": ["Add main feature", "Add main feature", "Add main feature"],
        "responsibilities": ["Add responsibilities"],
        "challenges": [],
        "metrics": [],
        "links": [],
    },
    {
        "slug": "desktop-system-placeholder-2",
        "name": "Desktop System - Add Project Details",
        "draft": True,
        "subtitle": "PyQt5 desktop system - Edit to add subtitle",
        "short_description": (
            "A PyQt5 desktop system - replace this placeholder with your project description, "
            "platforms, and technical details."
        ),
        "full_description": (
            "This is a placeholder for a second PyQt5 desktop project. Edit this entry to add "
            "the real project name, description, features, screenshots, and technical details."
        ),
        "categories": ["Desktop Apps"],
        "featured": False,
        "biggest_project": False,
        "confidential": False,
        "company": "",
        "year": "",
        "start_date": "",
        "end_date": None,
        "status": "",
        "role": "Python Desktop Developer",
        "project_type": "Desktop Application",
        "cover_image": None,
        "images": [{"src": None, "caption": "App Screenshot", "type": "desktop"}],
        "technologies": ["Python", "PyQt5"],
        "features": ["Add main feature", "Add main feature"],
        "responsibilities": ["Add responsibilities"],
        "challenges": [],
        "metrics": [],
        "links": [],
    },
]


EXPERIENCE = [
    {
        "company": "ADEX Jordan Company",
        "role": "Python Backend Developer",
        "type": "Full Time",
        "location": "Remote, Jordan",
        "start_date": "April 2026",
        "end_date": None,
        "current": True,
        "highlights": [
            "Developed Django analytics backend functionality for 1,000+ branches",
            "Contributed to multi-tenant SaaS systems and delivery applications",
            "Implemented APIs, tenant isolation, authentication, permissions, and workflows",
        ],
        "technologies": [
            "Python",
            "Django",
            "PostgreSQL",
            "REST API",
            "Multi-tenant SaaS",
        ],
    },
    {
        "company": "Moussa Academy",
        "role": "Software Programming Instructor",
        "type": "Part Time",
        "location": "Remote, Saudi Arabia",
        "start_date": "April 2026",
        "end_date": None,
        "current": True,
        "highlights": [
            "Delivered recorded programming lessons",
            "Delivered live group sessions",
            "Provided one-to-one tutoring",
        ],
        "technologies": ["Python", "Teaching", "Problem Solving"],
    },
    {
        "company": "Egypt Armed Forces",
        "role": "Military Service",
        "type": "Mandatory Service",
        "location": "Egypt",
        "start_date": "October 2024",
        "end_date": "February 2026",
        "current": False,
        "highlights": ["Completed mandatory military service"],
        "technologies": [],
        "special": True,
        "special_label": "Mandatory Service",
    },
    {
        "company": "BAGGR",
        "role": "Python Backend Developer",
        "type": "Remote Full Time",
        "location": "Remote",
        "start_date": "April 2024",
        "end_date": "October 2024",
        "current": False,
        "highlights": [
            "Architected Django microservices",
            "Created Docker workflows reducing deployment time by 80%",
            "Delivered 40% improvement in API response times",
        ],
        "technologies": [
            "Python",
            "Django",
            "Docker",
            "CI/CD",
            "Grafana",
            "Prometheus",
        ],
    },
    {
        "company": "Mutqinai",
        "role": "Python Developer",
        "type": "Hybrid Full Time",
        "location": "Cairo, Egypt",
        "start_date": "January 2024",
        "end_date": "April 2024",
        "current": False,
        "highlights": [
            "Built DRF APIs handling 5K+ daily requests",
            "Integrated OpenAI GPT, Gemini, and LangChain",
            "Deployed the platform on VPS with Apache",
        ],
        "technologies": ["Python", "Django", "DRF", "OpenAI", "Gemini", "LangChain"],
    },
]


SKILLS = [
    {"category": "Backend", "icon": "server", "skills": ["Python", "Django", "DRF"]},
    {
        "category": "Databases",
        "icon": "database",
        "skills": ["PostgreSQL", "MySQL", "MS SQL Server"],
    },
    {
        "category": "Caching & Queues",
        "icon": "lightning",
        "skills": ["Redis", "Celery"],
    },
    {
        "category": "DevOps & CI/CD",
        "icon": "gear",
        "skills": ["Docker", "Docker Compose", "GitHub Actions"],
    },
    {
        "category": "Cloud & Infrastructure",
        "icon": "cloud",
        "skills": ["AWS EC2", "Nginx", "Apache", "VPS Deployment"],
    },
    {"category": "Monitoring", "icon": "chart", "skills": ["Grafana", "Prometheus"]},
    {
        "category": "Security",
        "icon": "lock",
        "skills": ["OAuth 2.0", "JWT", "GDPR-compliant Auth"],
    },
    {
        "category": "Machine Learning",
        "icon": "brain",
        "skills": ["Regression", "Classification", "Time-series Forecasting"],
    },
    {
        "category": "Deep Learning",
        "icon": "neural",
        "skills": [
            "CNNs",
            "Image Classification",
            "Transfer Learning",
            "Action Detection",
        ],
    },
    {
        "category": "AI Integrations",
        "icon": "ai",
        "skills": ["OpenAI GPT", "Google Gemini", "LangChain", "YOLO"],
    },
    {
        "category": "Desktop Development",
        "icon": "desktop",
        "skills": ["PyQt5", "Multithreading", "Linux / Windows Apps"],
    },
    {"category": "Version Control", "icon": "git", "skills": ["Git", "GitHub"]},
]


ACHIEVEMENTS = [
    {
        "title": "Kaggle Notebooks Master",
        "description": "Ranked 61st globally out of more than 312,000 developers on Kaggle.",
        "icon": "trophy",
        "highlight": "#61",
        "highlight_label": "Global Rank",
        "detail": "Out of 312,000+ developers",
        "color": "yellow",
    },
    {
        "title": "NASA Space Apps Cairo",
        "description": "Reached the national final with a conservation-focused project.",
        "icon": "rocket",
        "highlight": "National Final",
        "highlight_label": "Achievement",
        "detail": "Marine organism conservation project",
        "color": "blue",
    },
    {
        "title": "IEEE Xtreme",
        "description": "Ranked among the top 20 teams in Egypt.",
        "icon": "code",
        "highlight": "Top 20",
        "highlight_label": "Teams in Egypt",
        "detail": "International IEEE Xtreme competition",
        "color": "blue",
    },
    {
        "title": "Annual Student Conference - 1st Place",
        "description": "Awarded first place for Arabic Sign Language recognition research.",
        "icon": "medal",
        "highlight": "1st Place",
        "highlight_label": "Award",
        "detail": "ASL Recognition research",
        "color": "green",
    },
]


class Command(BaseCommand):
    help = "Seed portfolio data from the current frontend content."

    def handle(self, *args, **options):
        Profile.objects.update_or_create(id=1, defaults=PROFILE)

        for order, project in enumerate(PROJECTS, start=1):
            # cover_image is deliberately excluded from defaults: it's an
            # uploaded file, and blindly including "cover_image": None here
            # would null out (delete the reference to) whatever was uploaded
            # through admin on every reseed. _seed_project_media below is the
            # only thing allowed to set it, and only when it's still empty.
            defaults = {k: v for k, v in project.items() if k != "cover_image"}
            defaults["order"] = order
            obj, _ = Project.objects.update_or_create(
                slug=project["slug"], defaults=defaults
            )
            self._seed_project_media(obj)

        for order, item in enumerate(EXPERIENCE, start=1):
            ExperienceEntry.objects.update_or_create(
                company=item["company"],
                role=item["role"],
                defaults={**item, "order": order},
            )

        for order, item in enumerate(SKILLS, start=1):
            SkillGroup.objects.update_or_create(
                category=item["category"],
                defaults={**item, "order": order},
            )

        for order, item in enumerate(ACHIEVEMENTS, start=1):
            Achievement.objects.update_or_create(
                title=item["title"],
                defaults={**item, "order": order},
            )

        self.stdout.write(self.style.SUCCESS("Portfolio content seeded."))

    def _seed_project_media(self, project):
        """Attach the bundled cover + gallery screenshots for `project`, if any
        are declared in PROJECT_MEDIA — but only the first time: once a cover
        image or a gallery exists, re-running `seed` never touches it again,
        so an admin-uploaded replacement is never clobbered on the next deploy.
        """
        media = PROJECT_MEDIA.get(project.slug)
        if not media:
            return

        if not project.cover_image:
            cover_path = SEED_MEDIA_DIR / media["cover"]
            with cover_path.open("rb") as fh:
                project.cover_image.save(cover_path.name, File(fh), save=True)

        if media["gallery"] and not project.gallery_images.exists():
            for order, (rel_path, caption, image_type) in enumerate(
                media["gallery"], start=1
            ):
                image_path = SEED_MEDIA_DIR / rel_path
                gallery_image = ProjectImage(
                    project=project,
                    caption=caption,
                    image_type=image_type,
                    order=order,
                )
                with image_path.open("rb") as fh:
                    gallery_image.image.save(image_path.name, File(fh), save=True)
