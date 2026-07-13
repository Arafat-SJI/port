<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project memory

Read and update `project-architecture.md` for this repo.

**Storage (do not mix):**
- **localStorage** — already-built IDE / design prefs: Extensions, Search, Source Control, themes/skins, sidebar layout, etc. Keep them in localStorage.
- **Supabase** — everything dashboard-related (`/dashboard-araf`): section order, auth, future portfolio content, any shared/dynamic visitor content.
