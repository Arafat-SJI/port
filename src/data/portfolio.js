export const NAV_ITEMS = [
  { href: "#about", label: "About.tsx", ext: "tsx" },
  { href: "#experience", label: "Experience.json", ext: "json" },
  { href: "#skills", label: "Skills.ts", ext: "ts" },
  { href: "#projects", label: "Projects.tsx", ext: "tsx" },
  { href: "#education", label: "Education.json", ext: "json" },
  { href: "#awards", label: "Awards.md", ext: "md" },
  { href: "#publication", label: "Publication.md", ext: "md" },
  { href: "#gallery", label: "Gallery.tsx", ext: "tsx" },
  { href: "#clubing", label: "Clubing.ts", ext: "ts" },
  { href: "#mentorship", label: "Mentorship.ts", ext: "ts" },
  { href: "#contact", label: "Contact.sh", ext: "sh" },
];

export const OPEN_TABS = NAV_ITEMS;

export const ABOUT = {
  summary:
    "Passionate about the intersection of human-computer interaction and machine intelligence. I specialize in building developer tools and complex dashboards that prioritize speed and developer experience. Currently exploring Large Language Model orchestrations.",
  interests: ["Generative AI", "Distributed Systems", "Type Safety", "Open Source"],
};

export const PROJECTS = [
  {
    title: "Nexus IDE",
    description:
      "An AI-first code editor built for the web with real-time collaborative features and integrated LLM code generation.",
    tags: ["React", "Next.js", "TypeScript"],
    links: ["link", "code"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGuYpex1AaA1tpiolhBgalyVsUkE5bQ6RAi28cqU2s5W-NvLolh2WOnhsMzZX7XXSfDbfFjzBn2UZwu5hzCDkU_SNKMMnljWhYvf0bguI8a999zYx8Lv9mDUVlVRiZ7gPnyvX-8oY6hBK9QuVGWMUGywG8any5gXmsIFcmUoDVaYvQW2TK_STVndixa9DlzvI4VlgYBs1yvkL-0kdMwEUvpWUdQ81-V1KYJBmqQ7OM5Bq3fXJoKsNoxp7bRK9gpjUd4jKX0GfLvAk",
    alt: "A sleek dark-themed interface of a code editor, featuring sophisticated syntax highlighting in blues and teals.",
  },
  {
    title: "Linear Clone",
    description:
      "A high-performance project management tool focused on keyboard-first navigation and extreme UI responsiveness.",
    tags: ["Rust", "Wasm", "PostgreSQL"],
    links: ["link"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzAdWw8w4WeYUFLyG1hKC_HyYjqN07r2fYLlsDjY7yDWxupaKUSPTHj_PX75goZkVek6SRxkRkOuHnrhTopnW_G13xBq4g1uHMMRIlXvdLXDaKxjf1Zts-N7QbBOt4FTGX7e0JMl9h70XpJjecuoZMTpJD2ZPpLKiZGHKOhejEcZImTJr9akNt70OtmyxaIFHSQAvGlUqewe7XApbvOZFoXAxTXkD9l_umG0r0dh29ONGGfJIVlbeD3l5aF6o783vyEIToVUZF5P0",
    alt: "A sophisticated project management dashboard layout featuring task cards, progress bars, and team avatars.",
  },
  {
    title: "Pulse Analytics",
    description:
      "Real-time observability dashboard for microservices with custom alerting pipelines and anomaly detection.",
    tags: ["Go", "Grafana", "Kafka"],
    links: ["link", "code"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGuYpex1AaA1tpiolhBgalyVsUkE5bQ6RAi28cqU2s5W-NvLolh2WOnhsMzZX7XXSfDbfFjzBn2UZwu5hzCDkU_SNKMMnljWhYvf0bguI8a999zYx8Lv9mDUVlVRiZ7gPnyvX-8oY6hBK9QuVGWMUGywG8any5gXmsIFcmUoDVaYvQW2TK_STVndixa9DlzvI4VlgYBs1yvkL-0kdMwEUvpWUdQ81-V1KYJBmqQ7OM5Bq3fXJoKsNoxp7bRK9gpjUd4jKX0GfLvAk",
    alt: "Analytics dashboard with charts and metrics on a dark interface.",
  },
  {
    title: "DevKit CLI",
    description:
      "Command-line toolkit for scaffolding monorepos, running health checks, and automating release workflows.",
    tags: ["Node.js", "CLI", "Docker"],
    links: ["code"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzAdWw8w4WeYUFLyG1hKC_HyYjqN07r2fYLlsDjY7yDWxupaKUSPTHj_PX75goZkVek6SRxkRkOuHnrhTopnW_G13xBq4g1uHMMRIlXvdLXDaKxjf1Zts-N7QbBOt4FTGX7e0JMl9h70XpJjecuoZMTpJD2ZPpLKiZGHKOhejEcZImTJr9akNt70OtmyxaIFHSQAvGlUqewe7XApbvOZFoXAxTXkD9l_umG0r0dh29ONGGfJIVlbeD3l5aF6o783vyEIToVUZF5P0",
    alt: "Terminal window showing CLI commands and output.",
  },
];

export const EXPERIENCE = [
  {
    role: "Senior Developer",
    company: "Vercel",
    period: "2022 — Present",
    current: true,
    description:
      "Leading the edge runtime infrastructure team. Optimized cold boot times by 40% and implemented global cache invalidation protocols.",
  },
  {
    role: "Fullstack Developer",
    company: "Stripe",
    period: "2020 — 2022",
    current: false,
    description:
      "Worked on the Billing API team. Architected high-availability payment gateways processing millions of transactions daily.",
  },
  {
    role: "Software Engineer Intern",
    company: "Shopify",
    period: "2019 — 2020",
    current: false,
    description:
      "Built internal tooling for merchant onboarding. Reduced manual review time by 25% with automated validation pipelines.",
  },
];

export const SKILLS = [
  { title: "Frontend", items: ["React", "Next.js", "Vue", "Tailwind"] },
  { title: "Backend", items: ["Node.js", "Go", "PostgreSQL", "Redis"] },
  { title: "AI & Data", items: ["OpenAI", "LangChain", "PyTorch"] },
  { title: "Cloud", items: ["AWS", "Docker", "K8s"] },
];

export const EDUCATION = [
  {
    degree: "B.Sc. in Computer Science & Engineering",
    institution: "Bangladesh University of Engineering and Technology",
    period: "2016 — 2020",
    gpa: "3.85 / 4.00",
    highlights: ["Dean's List", "Thesis: Distributed Caching for Edge Networks"],
  },
  {
    degree: "Higher Secondary Certificate",
    institution: "Notre Dame College, Dhaka",
    period: "2014 — 2016",
    gpa: "5.00 / 5.00",
    highlights: ["Science Division", "National Math Olympiad — Regional Finalist"],
  },
];

export const AWARDS = [
  {
    title: "Best Developer Tool",
    issuer: "DevFest Bangladesh",
    year: "2024",
    description: "Recognized for Nexus IDE — an open-source AI-powered code editor.",
  },
  {
    title: "1st Place — Hackathon",
    issuer: "Google Developer Groups",
    year: "2023",
    description: "Built a real-time collaboration platform in 36 hours with a team of four.",
  },
  {
    title: "Outstanding Graduate",
    issuer: "BUET CSE Department",
    year: "2020",
    description: "Awarded for academic excellence and contributions to the programming club.",
  },
  {
    title: "Open Source Contributor",
    issuer: "GitHub",
    year: "2022",
    description: "Arctic Vault contributor with 500+ merged PRs across ecosystem projects.",
  },
];

export const PUBLICATIONS = [
  {
    title: "Optimizing Cold Starts in Serverless Edge Runtimes",
    authors: "A. Rahman, J. Chen, M. Patel",
    venue: "IEEE Cloud Computing",
    year: "2024",
    type: "Journal",
    link: "#",
  },
  {
    title: "A Survey of LLM Orchestration Patterns for Developer Tools",
    authors: "A. Rahman, S. Kim",
    venue: "ACM SIGSOFT FSE Companion",
    year: "2023",
    type: "Conference",
    link: "#",
  },
  {
    title: "Building Resilient Payment Gateways at Scale",
    authors: "A. Rahman",
    venue: "Medium Engineering Blog",
    year: "2022",
    type: "Article",
    link: "#",
  },
];

export const GALLERY = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGuYpex1AaA1tpiolhBgalyVsUkE5bQ6RAi28cqU2s5W-NvLolh2WOnhsMzZX7XXSfDbfFjzBn2UZwu5hzCDkU_SNKMMnljWhYvf0bguI8a999zYx8Lv9mDUVlVRiZ7gPnyvX-8oY6hBK9QuVGWMUGywG8any5gXmsIFcmUoDVaYvQW2TK_STVndixa9DlzvI4VlgYBs1yvkL-0kdMwEUvpWUdQ81-V1KYJBmqQ7OM5Bq3fXJoKsNoxp7bRK9gpjUd4jKX0GfLvAk",
    alt: "Speaking at a developer conference",
    caption: "DevFest Keynote",
    wide: true,
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzAdWw8w4WeYUFLyG1hKC_HyYjqN07r2fYLlsDjY7yDWxupaKUSPTHj_PX75goZkVek6SRxkRkOuHnrhTopnW_G13xBq4g1uHMMRIlXvdLXDaKxjf1Zts-N7QbBOt4FTGX7e0JMl9h70XpJjecuoZMTpJD2ZPpLKiZGHKOhejEcZImTJr9akNt70OtmyxaIFHSQAvGlUqewe7XApbvOZFoXAxTXkD9l_umG0r0dh29ONGGfJIVlbeD3l5aF6o783vyEIToVUZF5P0",
    alt: "Team hackathon session",
    caption: "Hackathon Night",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGuYpex1AaA1tpiolhBgalyVsUkE5bQ6RAi28cqU2s5W-NvLolh2WOnhsMzZX7XXSfDbfFjzBn2UZwu5hzCDkU_SNKMMnljWhYvf0bguI8a999zYx8Lv9mDUVlVRiZ7gPnyvX-8oY6hBK9QuVGWMUGywG8any5gXmsIFcmUoDVaYvQW2TK_STVndixa9DlzvI4VlgYBs1yvkL-0kdMwEUvpWUdQ81-V1KYJBmqQ7OM5Bq3fXJoKsNoxp7bRK9gpjUd4jKX0GfLvAk",
    alt: "Workshop whiteboard session",
    caption: "System Design Workshop",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzAdWw8w4WeYUFLyG1hKC_HyYjqN07r2fYLlsDjY7yDWxupaKUSPTHj_PX75goZkVek6SRxkRkOuHnrhTopnW_G13xBq4g1uHMMRIlXvdLXDaKxjf1Zts-N7QbBOt4FTGX7e0JMl9h70XpJjecuoZMTpJD2ZPpLKiZGHKOhejEcZImTJr9akNt70OtmyxaIFHSQAvGlUqewe7XApbvOZFoXAxTXkD9l_umG0r0dh29ONGGfJIVlbeD3l5aF6o783vyEIToVUZF5P0",
    alt: "Campus programming club meetup",
    caption: "BuetPC Weekly Meetup",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzAdWw8w4WeYUFLyG1hKC_HyYjqN07r2fYLlsDjY7yDWxupaKUSPTHj_PX75goZkVek6SRxkRkOuHnrhTopnW_G13xBq4g1uHMMRIlXvdLXDaKxjf1Zts-N7QbBOt4FTGX7e0JMl9h70XpJjecuoZMTpJD2ZPpLKiZGHKOhejEcZImTJr9akNt70OtmyxaIFHSQAvGlUqewe7XApbvOZFoXAxTXkD9l_umG0r0dh29ONGGfJIVlbeD3l5aF6o783vyEIToVUZF5P0",
    alt: "Open source contributor event",
    caption: "GitHub Satellite",
    wide: true,
  },
];

export const CLUBS = [
  {
    name: "Buet Programming Club",
    role: "President",
    period: "2018 — 2020",
    description:
      "Led 200+ member community. Organized weekly contests, ICPC training camps, and annual intra-university hackathons.",
  },
  {
    name: "Google Developer Student Clubs",
    role: "Core Organizer",
    period: "2019 — 2020",
    description:
      "Hosted study jams on Android, Cloud, and ML. Mentored 50+ students through their first open-source contributions.",
  },
  {
    name: "IEEE Computer Society — BUET",
    role: "Technical Lead",
    period: "2017 — 2019",
    description:
      "Coordinated technical workshops on web development, competitive programming, and system design fundamentals.",
  },
  {
    name: "Open Source Collective",
    role: "Contributor",
    period: "2021 — Present",
    description:
      "Active maintainer across React ecosystem packages. Reviews PRs and triages issues for downstream dependents.",
  },
];

export const MENTORSHIP = [
  {
    program: "Google Summer of Code",
    role: "Mentor",
    period: "2023 — Present",
    mentees: "6",
    topics: ["Open Source", "Distributed Systems", "Documentation"],
    description:
      "Guide students through 12-week coding projects with weekly syncs, code reviews, and milestone planning.",
  },
  {
    program: "Outreachy",
    role: "Mentor",
    period: "2022 — 2023",
    mentees: "2",
    topics: ["Frontend", "Accessibility", "React"],
    description:
      "Supported interns building accessible UI components and contributing to production codebases.",
  },
  {
    program: "University Career Workshops",
    role: "Guest Speaker",
    period: "2021 — Present",
    mentees: "120+",
    topics: ["Interview Prep", "System Design", "Career Growth"],
    description:
      "Conduct sessions on technical interviews, resume building, and navigating early-career engineering roles.",
  },
];

export const CONTACT = {
  email: "hello@arafat.workspace",
  social: "@arafat_dev",
  intro:
    "Happy to connect — whether it's a project idea, a quick question, or just saying hello. Reach out anytime.",
};

export const TERMINAL_MESSAGES = [
  "> npm run build... success",
  "> git status...",
  "> indexing local files...",
  "> v8 engine... optimal",
];

export const CHAT_SIDEBAR_BREAKPOINT = 1020;

export const ACTIVITY_ITEMS = [
  { id: "explorer", icon: "file_copy", label: "Explorer" },
  { id: "search", icon: "search", label: "Search" },
  { id: "extensions", icon: "widgets", label: "Extensions" },
  { id: "source-control", icon: "account_tree", label: "Source Control" },
  { id: "chat", icon: "chat_bubble", label: "Chat" },
];

export const ACTIVITY_LABELS = {
  explorer: "EXPLORER",
  search: "SEARCH",
  "source-control": "SOURCE CONTROL",
  extensions: "EXTENSIONS",
  chat: "CHAT",
};

/** Short labels for narrow drawer header (< 820px). */
export function getActivityLabel(id, { compact = false } = {}) {
  if (compact && id === "source-control") return "SOURCE";
  return ACTIVITY_LABELS[id] ?? ACTIVITY_LABELS.explorer;
}

export function getVisibleActivityItems(includeChat) {
  if (includeChat) return ACTIVITY_ITEMS;
  return ACTIVITY_ITEMS.filter((item) => item.id !== "chat");
}

export const CHAT_SUGGESTED_QUESTIONS = [
  "What is Arafat's tech stack?",
  "Tell me about his projects",
  "What's his work experience?",
  "How can I get in touch?",
];
