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

export function getDashboardNavItem(slug) {
  return DASHBOARD_NAV.find((item) => item.slug === slug) ?? null;
}
