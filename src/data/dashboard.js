/** Dashboard content navigation (mirrors portfolio NAV_ITEMS). */
export const DASHBOARD_NAV = [
  { slug: "about", href: "/dashboard-araf/about", label: "About.tsx", ext: "tsx" },
  { slug: "experience", href: "/dashboard-araf/experience", label: "Experience.json", ext: "json" },
  { slug: "skills", href: "/dashboard-araf/skills", label: "Skills.ts", ext: "ts" },
  { slug: "projects", href: "/dashboard-araf/projects", label: "Projects.tsx", ext: "tsx" },
  { slug: "education", href: "/dashboard-araf/education", label: "Education.json", ext: "json" },
  { slug: "awards", href: "/dashboard-araf/awards", label: "Awards.md", ext: "md" },
  { slug: "publication", href: "/dashboard-araf/publication", label: "Publication.md", ext: "md" },
  { slug: "gallery", href: "/dashboard-araf/gallery", label: "Gallery.tsx", ext: "tsx" },
  { slug: "clubing", href: "/dashboard-araf/clubing", label: "Clubing.ts", ext: "ts" },
  { slug: "mentorship", href: "/dashboard-araf/mentorship", label: "Mentorship.ts", ext: "ts" },
  { slug: "contact", href: "/dashboard-araf/contact", label: "Contact.sh", ext: "sh" },
];

/** Nested settings sidebar items (under /dashboard-araf/settings). */
export const SETTINGS_NAV = [
  {
    slug: "email",
    href: "/dashboard-araf/settings/email",
    label: "Change email",
    icon: "mail",
    group: "Account",
  },
  {
    slug: "password",
    href: "/dashboard-araf/settings/password",
    label: "Change password",
    icon: "lock_reset",
    group: "Account",
  },
  {
    slug: "gemini-api",
    href: "/dashboard-araf/settings/gemini-api",
    label: "Gemini API key",
    icon: "key",
    group: "AI",
  },
  {
    slug: "ai-knowledge",
    href: "/dashboard-araf/settings/ai-knowledge",
    label: "AI Context Knowledgebase",
    icon: "database",
    group: "AI",
  },
  {
    slug: "extension",
    href: "/dashboard-araf/settings/extension",
    label: "Extension",
    icon: "extension",
    group: "UI",
  },
];

export function getDashboardNavItem(slug) {
  return DASHBOARD_NAV.find((item) => item.slug === slug) ?? null;
}

export function isSettingsPath(pathname) {
  return (
    pathname === "/dashboard-araf/settings" ||
    pathname?.startsWith("/dashboard-araf/settings/")
  );
}

export function isMessagesPath(pathname) {
  return (
    pathname === "/dashboard-araf/messages" ||
    pathname?.startsWith("/dashboard-araf/messages/")
  );
}

export function isAiChatsPath(pathname) {
  return (
    pathname === "/dashboard-araf/ai-chats" ||
    pathname?.startsWith("/dashboard-araf/ai-chats/")
  );
}

export function messageThreadHref(emailKey) {
  return `/dashboard-araf/messages/${encodeURIComponent(String(emailKey ?? "").trim())}`;
}

export function aiChatThreadHref(ipKey) {
  return `/dashboard-araf/ai-chats/${encodeURIComponent(String(ipKey ?? "").trim())}`;
}
