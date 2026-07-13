import defaultOrder from "@/data/sectionOrder.json";

/** Same-tab sync only — dashboard order lives in Supabase, not localStorage. */
export const SECTION_ORDER_EVENT = "portfolio-section-order";
export const FIXED_LAST_SLUG = "contact";

/** Reorderable section slugs (Contact is always last). Used as fallback seed. */
export const DEFAULT_SECTION_ORDER = [...defaultOrder];

export function normalizeSectionOrder(input) {
  const allowed = new Set(DEFAULT_SECTION_ORDER);
  const seen = new Set();
  const next = [];

  if (Array.isArray(input)) {
    for (const raw of input) {
      const slug = String(raw || "").replace(/^#/, "");
      if (slug === FIXED_LAST_SLUG) continue;
      if (!allowed.has(slug) || seen.has(slug)) continue;
      seen.add(slug);
      next.push(slug);
    }
  }

  for (const slug of DEFAULT_SECTION_ORDER) {
    if (!seen.has(slug)) next.push(slug);
  }

  return next;
}

export function orderNavItems(navItems, order) {
  const bySlug = new Map(
    navItems.map((item) => [String(item.href || "").replace(/^#/, ""), item])
  );
  const normalized = normalizeSectionOrder(order);
  const ordered = normalized.map((slug) => bySlug.get(slug)).filter(Boolean);
  const contact = bySlug.get(FIXED_LAST_SLUG);
  return contact ? [...ordered, contact] : ordered;
}

export function orderDashboardNav(dashboardNav, order) {
  const bySlug = new Map(dashboardNav.map((item) => [item.slug, item]));
  const normalized = normalizeSectionOrder(order);
  const ordered = normalized.map((slug) => bySlug.get(slug)).filter(Boolean);
  const contact = bySlug.get(FIXED_LAST_SLUG);
  return contact ? [...ordered, contact] : ordered;
}

/** Broadcast to other listeners in this tab (no localStorage). */
export function broadcastSectionOrder(order) {
  if (typeof window === "undefined") return;
  const normalized = normalizeSectionOrder(order);
  window.dispatchEvent(
    new CustomEvent(SECTION_ORDER_EVENT, { detail: normalized })
  );
}
