# Project Architecture — arafat.workspace

> **Mandatory for every Cursor agent session:** Read this entire file before writing or changing any code. After finishing work from a user prompt, update this file so office PC and home PC sessions stay in sync.

**Last updated:** 2026-07-16 (About profile image upload)

---

## Part 1 — Strict Agent Rules

These rules are non-negotiable. Follow them on every prompt.

1. **Always read this file first** before starting any task in this repository.
2. **Only change what the user asked for in the current prompt.** Do not refactor, “improve,” restyle, or touch unrelated files/features.
3. **Do not change other features or designs without explicit permission.** If something seems broken but was not mentioned, leave it alone and note it to the user if relevant.
4. **Only update the portion the user told you to update.** Do not touch other portions of the UI, data, or logic.
5. **Never change a single design detail without telling the user.** If a design change is required to complete a request, ask first — do not silently redesign.
6. **Any design change the user did not request must never be done.** No “while I’m here” visual tweaks, spacing changes, color changes, animation changes, or layout shifts.
7. **Always update this markdown file** at the end of every task that changes the project:
   - Document what was built / changed (Part 2).
   - Move completed future items out of Part 3 or mark them done.
   - Add any new plans the user shared into Part 3.
   - Update the **Last updated** date at the top.
8. **Do not implement future plans from Part 3 unless the user explicitly asks for that work in the current prompt.** Part 3 is planning only until activated.
9. Prefer matching existing patterns, naming, and file structure. This is Next.js 16 — check `node_modules/next/dist/docs/` and `AGENTS.md` before assuming older Next.js APIs.
10. Do not invent routes, TypeScript migrations, new libraries, or architecture shifts unless the user explicitly requests them.
11. **AI knowledge JSON security (mandatory when building/updating that file):**
    - The auto-synced AI Q&A JSON must **never** include dashboard login email, password, password-change fields, service keys, or any auth secrets.
    - Dashboard password-change / account settings updates must **never** write credentials into the AI JSON.
    - The JSON **must** include a fixed refusal instruction for password / credential / login-secret questions, e.g. response text: `I am not going to provide you this kind of data`
    - Public contact email on the portfolio (if any) is separate from dashboard auth email — only public portfolio content belongs in the JSON.
12. **Storage split (mandatory) — do not mix these:**
    - **localStorage (keep as-is):** Already-built **IDE / design** experience on the public portfolio — Extensions marketplace + themes/fonts/skins, Search sidebar session, Source Control preference-discard metaphor, sidebar widths/layout, activity/workspace tabs, chat/terminal skins, glass/live animation, and any similar visitor layout prefs. These stay **per-browser** in localStorage. **Never move them to Supabase.**
    - **Supabase (required for everything dashboard-related):** All `/dashboard-araf` managed data — auth sessions, section order, future portfolio content CRUD, settings that affect what every visitor sees, and any other shared/dynamic content. Source of truth is Supabase across devices and production. **Never use localStorage or repo JSON as the source of truth** for dashboard data.
    - When in doubt: if it is edited in the dashboard or must look the same for every visitor → Supabase. If it is only an IDE chrome preference for the person browsing → localStorage.

---

## Part 2 — What This Project Is & Everything Already Built

### 2.0 Storage policy (localStorage vs Supabase)

| Bucket | What belongs here | Examples |
|--------|-------------------|----------|
| **localStorage** | Existing IDE chrome & design prefs (already built; keep) | Extensions install/activate + theme/font/skin options; Search query/session; Source Control “discard prefs”; sidebar widths; workspace/activity tabs; glass / live animation |
| **Supabase** | Everything dashboard-related / public shared content | Auth; `portfolio_settings.section_order`; future About/Experience/… content; anything editable under `/dashboard-araf` that drives the landing page |

**Agent reminder:** Do not “upgrade” Extensions, Search, or Source Control to Supabase unless the user explicitly asks. Do not store dashboard section order or portfolio content in localStorage.

### 2.1 Project purpose

Personal portfolio for **Arafat**, branded **`arafat.workspace`**. The entire site is presented as a **VS Code / Cursor-style IDE**:

- Portfolio sections appear as “files” in a fake workspace.
- Left activity bar switches Explorer / Search / Extensions / Source Control / Chat.
- Top bar has window chrome, breadcrumb, and editor-style tabs.
- Main editor area scrolls through portfolio content (and extension detail views).
- Right panel is an AI chat sidebar (UI shell; answers not wired to a real model yet).
- Bottom status bar acts like an IDE footer.
- Contact is a reveal / terminal experience at the end of the scroll track.

**Current URL:** single App Router page at `/` (local: `http://localhost:3000`).

**Content today:** all résumé / portfolio text and images are **static demo data** in JS modules (not real final content yet).

---

### 2.2 Tech stack

| Layer | Choice | Version / notes |
|--------|--------|------------------|
| Framework | Next.js (App Router) | `16.2.10` |
| UI | React + React DOM | `19.2.4` |
| Language | JavaScript only | No TypeScript |
| Styling | Tailwind CSS v4 | via `@tailwindcss/postcss` |
| Fonts | `next/font/google` | Inter + JetBrains Mono |
| Icons | Material Symbols Outlined | Google Fonts CDN |
| Path alias | `@/*` → `./src/*` | `jsconfig.json` |
| Lint | ESLint 9 + `eslint-config-next` | core-web-vitals |

**Dependencies:** `next`, `react`, `react-dom`, `@supabase/supabase-js`, `@supabase/ssr` (+ Tailwind/ESLint in dev).

**Scripts:** `dev`, `build`, `start`, `lint`.

---

### 2.3 Directory structure (source of truth)

```
d:\port\
├── AGENTS.md / CLAUDE.md          # Agent note: Next.js may differ from training data
├── README.md                      # Stock create-next-app text (not accurate product docs)
├── project-architecture.md        # THIS FILE — living project memory
├── package.json / package-lock.json
├── next.config.mjs                # Default / empty config
├── postcss.config.mjs             # Tailwind v4 PostCSS plugin
├── eslint.config.mjs
├── jsconfig.json
├── public/                        # Stock SVGs (window/vercel/file) — not primary portfolio assets
└── src/
    ├── app/
    │   ├── layout.js              # Root layout, fonts, metadata, ThemeBootScript
    │   ├── page.js                # Server home — fetches section order, renders HomeClient
    │   ├── globals.css            # Tailwind + design tokens + all theme variants
    │   ├── favicon.ico
    │   ├── icon.png
    │   └── apple-icon.png
    ├── components/
    │   ├── ThemeBootScript.js     # FOUC-prevention theme boot via useServerInsertedHTML
    │   ├── ide/                   # IDE chrome (shell)
    │   ├── portfolio/             # Scrollable résumé content + section wrappers
    │   │   └── sections/          # Individual portfolio sections
    │   └── ui/                    # Backgrounds, icons, mac traffic lights
    ├── data/
    │   ├── portfolio.js           # All portfolio/nav/chat config (STATIC DEMO)
    │   └── extensions.js          # Fake marketplace extensions + option catalogs
    ├── hooks/                     # Extensions, scroll-spy, tabs, terminal ticker
    └── lib/                       # Storage, search, sidebar prefs, scroll helpers
```

**Routes:**
| Route | Role |
|-------|------|
| `/` | Public portfolio IDE (no link to dashboard) |
| `/dashboard-araf` | Protected admin home (auth required) |
| `/dashboard-araf/login` | Email/password login only — **no registration UI** |

**API:** `GET /api/section-order` (public read of Supabase `portfolio_settings.section_order`). Auth uses Server Actions + Supabase Auth cookies via `src/proxy.js`.

---

### 2.4 App entry & composition

#### `src/app/layout.js`
- Metadata title: `arafat.workspace`
- Loads Inter + JetBrains Mono as CSS variables
- Injects Material Symbols stylesheet
- `html` defaults: `data-ui-theme="default"`, `data-font-pack="inter"`, `suppressHydrationWarning`
- Renders `ThemeBootScript` + children

#### `src/app/page.js` (server)
- Fetches `sectionOrder` + `aboutContent` from Supabase (`force-dynamic`).
- Renders client `HomeClient` so Explorer / tabs / About match DB on first paint.

#### `src/components/HomeClient.js` (client)
```
ExtensionsProvider
  ├── ShaderBackground          (canvas/WebGL when extension theme needs it)
  ├── LiveAnimationBackground   (ambient canvas when live-animation active)
  └── IDEWorkspace              (sectionOrder + aboutContent)
```

---

### 2.5 IDE chrome — features & design structure (LOCKED / GOOD)

User status (2026-07-14): **left sidebar, top bar, right sidebar, and footer (status bar) are considered perfect and complete.** Do not redesign them unless the user explicitly asks.

#### Overall layout (`IDEWorkspace.js`)
Desktop composition:

```
[ActivityBar] [TopBar + EditorTabBar ──────────────────────────]
              [Left sidebar] [Breadcrumb]
                             [main scroll: Portfolio OR ExtensionDetail]
                             [ContactReveal dock + ContactScrollTrack]
                             [ChatPanel when viewport ≥ 1020px]
[StatusBar]
```

**Responsive behavior** (`lib/sidebarPrefs.js` + `IDEWorkspace`):

| Viewport | Behavior |
|----------|----------|
| ≥ 1305px | Wide resizable sidebars |
| 1150–1304px | Compact resizable sidebars |
| &lt; 1150px | Fixed sidebar widths |
| &lt; 820px | Left sidebar becomes hamburger drawer |
| &lt; 1020px | Chat moves into left activity sidebar (no right panel) |

Sidebar widths persist in localStorage; resize handles via `SidebarResizeHandle.js`.

Hydration-safe: viewport flags start as SSR defaults, then sync in `useLayoutEffect`.

#### Activity bar (`ActivityBar.js`)
Activities from `ACTIVITY_ITEMS` in `portfolio.js`:
- `explorer` — file tree of nav sections
- `search` — portfolio text search
- `extensions` — marketplace list
- `source-control` — discard local preference “changes”
- `chat` — only shown in activity bar when chat is in-sidebar mode (&lt; 1020px)

#### Left sidebar panels (`ActivitySidebar.js` switches)
| Activity | Component | What it does |
|----------|-----------|--------------|
| explorer | `ExplorerSidebar.js` | Tree of `NAV_ITEMS` (“files”); expand/collapse portfolio folder |
| search | `SearchSidebar.js` | Query over search index; match case / whole word / regex options; session persistence |
| extensions | `ExtensionsSidebar.js` | Lists extensions; opens detail as `extension:<id>` tab |
| source-control | `SourceControlSidebar.js` | Lists preference diffs vs defaults; discard one / discard all |
| chat | `ChatPanel.js` | When chat-in-sidebar |

#### Top bar (`TopBar.js`)
- Mac-style traffic lights (`MacTrafficLights.js`) when mac theme active
- Window / workspace title chrome
- Works with tab strip below

#### Editor tabs (`EditorTabBar.js` + `useTabStripScroll.js`)
- Portfolio section tabs from `NAV_ITEMS` / `OPEN_TABS`
- Extension detail tabs: `extension:<id>`
- Active tab syncs with scroll-spy (`useScrollSpy.js`) when viewing portfolio
- Horizontal tab strip scrolling when overflow

#### Breadcrumb (`Breadcrumb.js`)
- Shows path for current file/section in editor chrome

#### Right sidebar — Chat (`ChatPanel.js`)
- Suggested questions from `CHAT_SUGGESTED_QUESTIONS`
- Textarea input UI
- **Presentational only** — no real AI backend / model wiring yet
- Themeable via Chat Skins extension (`data-chat-theme` etc.)

#### Status bar / footer (`StatusBar.js`)
- IDE-style footer status
- Ties into terminal message ticker (`useTerminalMessages.js`) / preference change count metaphor

#### Contact experience (not a normal middle section)
- `ContactReveal.js` + `ContactScrollTrack` — custom scroll reveal dock
- `ContactTerminal.js` — “Let’s Connect” terminal UI
- `TerminalLiveCanvas.js` — live motion inside terminal when terminal-theme live skins active
- Contact data from `CONTACT` + `TERMINAL_MESSAGES` in `portfolio.js`
- Smooth scrolling via `lib/smoothScroll.js`

---

### 2.6 Main / middle content — portfolio sections

`PortfolioContent.js` stacks sections inside a max-width column (`max-w-[900px]`, large vertical spacing). Each section (except the overall contact dock) is wrapped in `SectionSearchTarget` for search highlighting.

| Hash / “file” | Label (explorer) | Component | Data export | Status |
|---------------|------------------|-----------|-------------|--------|
| `#about` | About.tsx | `HeroSection` + `AboutSection` | Supabase `portfolio_settings` key `about` | **Dynamic** — edited at `/dashboard-araf/about` |
| `#experience` | Experience.json | `ExperienceSection` | `EXPERIENCE` | Demo content |
| `#skills` | Skills.ts | `SkillsSection` | `SKILLS` | Demo content |
| `#projects` | Projects.tsx | `ProjectsSection` | `PROJECTS` | Demo content |
| `#education` | Education.json | `EducationSection` | `EDUCATION` | Demo content |
| `#awards` | Awards.md | `AwardsSection` | `AWARDS` | Demo content |
| `#publication` | Publication.md | `PublicationSection` | `PUBLICATIONS` | Demo content |
| `#gallery` | Gallery.tsx | `GallerySection` | `GALLERY` | Demo content |
| `#clubing` | Clubing.ts | `ClubingSection` | `CLUBS` | Demo content |
| `#mentorship` | Mentorship.ts | `MentorshipSection` | `MENTORSHIP` | Demo content |
| `#contact` | Contact.sh | Contact reveal/terminal (IDE layer) | `CONTACT`, `TERMINAL_MESSAGES` | Demo content |

Shared portfolio UI:
- `SectionHeader.js` — section title + underline rule
- `SectionSearchTarget.js` — wraps section DOM for search mark/`<mark>` highlighting

**Known gaps in middle content:**
- Hero CTAs (e.g. “View Projects”, “Download CV”) appear non-wired / demo
- Content is placeholder (Vercel/Stripe-style sample résumé), not final real data
- Per-section layouts may still change when real data arrives (user will approve per section)

---

### 2.7 Extensions marketplace system

**Persistence: localStorage only** (IDE design layer — do not migrate to Supabase).

Defined in `src/data/extensions.js`, behavior in `hooks/useExtensions.js` + `lib/extensionStorage.js`, applied to `document.documentElement` via data attributes, styled in `globals.css`.

| Extension ID | Name | Role |
|--------------|------|------|
| `default-theme` | Cursor Dark | Built-in default UI theme |
| `typograph` | Typograph | Font packs: inter / system / georgia / mono-ui |
| `theme-pack` | Theme Studio | Themes: default, one-dark, dracula, github-dark, nord, monokai |
| `macintosh-theme` | Aqua Desktop | macOS-style theme + variants (Sonoma, Monterey, Sequoia, Aqua Classic) |
| `live-animation` | Live Animation Theme | Background canvas modes: aurora, particles, waves, orbits, constellation |
| `terminal-theme` | Terminal Skins | Contact terminal-only static + live skins |
| `chat-theme` | Chat Skins | Chat panel-only static + live skins. CSS on `.chat-panel[data-chat-skin]`. Must not be overridden by Live Animation / glass panel transparency (see `globals.css` `:not([data-chat-skin])` exclusions). |

Supporting option catalogs in `extensions.js`:
- `FONT_PACK_OPTIONS`
- `THEME_PACK_OPTIONS`
- `MAC_THEME_VARIANTS`
- `LIVE_ANIMATION_OPTIONS`
- `TERMINAL_THEME_OPTIONS`
- `CHAT_THEME_OPTIONS`
- `getExtensionById`, `DEFAULT_INSTALLED_EXTENSION_IDS`

**UI:**
- `ExtensionsSidebar.js` — install/activate list + search
- `ExtensionDetailView.js` — detail page inside main editor (tabs); empty state helper
- Extension search session persistence in `searchSession.js`

**Persistence keys** (`extensionStorage.js`):
- `portfolio-extensions-v7` (migrations from older keys)
- `portfolio-workspace-v1` (open extension tabs, active tab/activity)

`ThemeBootScript.js` injects early script so theme/font attributes apply before paint (avoids FOUC / hydration flash).

Backgrounds:
- `ShaderBackground.js` — shader/canvas for certain themes
- `LiveAnimationBackground.js` — ambient animation canvas

---

### 2.8 Search system

**Persistence: localStorage only** (IDE search session — do not migrate to Supabase).

- Index built in `lib/searchIndex.js` from `NAV_ITEMS` + portfolio data fields (`SEARCH_INDEX`, `searchPortfolio`, matchers for case/whole-word/regex)
- UI: `SearchSidebar.js`
- Scroll-to-match: `lib/searchScroll.js`
- Session persistence: `lib/searchSession.js` (`portfolio-search-session-v1`, `portfolio-extension-search-v1`)
- Highlighting: `SectionSearchTarget` walks text nodes and wraps matches

---

### 2.9 Source Control metaphor

**Persistence: localStorage only** (IDE preference discard metaphor — do not migrate to Supabase).

- Not real git UI for the repo
- Represent “uncommitted” **workspace preference changes** vs defaults
- `lib/sourceControl.js` — collect changes, discard one, discard all (extensions + related prefs)
- Emits / listens with prefs-changed event from `sidebarPrefs`
- Dirty state also influences terminal message ticker / status metaphors

---

### 2.10 Styling & design system

- **Tailwind v4** in `globals.css` with `@import "tailwindcss"` and `@theme { ... }`
- Design tokens as CSS variables (Material-like naming): surfaces, primary, on-background, fonts, etc.
- **No CSS Modules** — utility classes everywhere
- Theme switching via **`html` data attributes**, not body class themes alone:
  - `data-ui-theme`
  - `data-font-pack`
  - `data-mac-variant`
  - `data-live-animation`
  - `data-terminal-theme`
  - `data-chat-theme`
  - (and related flags as implemented)
- Custom CSS for scrollbars, Material Symbols sizing, search highlights, sidebar collapse animation, large theme/mac/wallpaper blocks

Visual direction: dark IDE-first workspace with soft blue accent (`#adc6ff` on default Cursor Dark). Multiple alternate dark themes via extensions.

---

### 2.11 Hooks inventory

| Hook | File | Role |
|------|------|------|
| `ExtensionsProvider` / `useExtensions` | `useExtensions.js` | Install/activate/state for all extensions |
| `useSectionOrder` | `useSectionOrder.js` | Section order state; prefers SSR `initialOrder` from Supabase (skips client fetch to avoid flash); same-tab `CustomEvent` sync |
| `useScrollSpy` | `useScrollSpy.js` | Sync active section from main scroll |
| `useTabStripScroll` | `useTabStripScroll.js` | Keep active tab visible in tab strip |
| `useTerminalMessages` | `useTerminalMessages.js` | Rotating terminal/status messages; reacts to change count |

---

### 2.12 Lib inventory

| Module | Role |
|--------|------|
| `aboutContent.js` | Normalize About payload; defaults; search lines |
| `aboutContentServer.js` | Read/write About in Supabase `portfolio_settings` |
| `extensionStorage.js` | Read/write extension + workspace localStorage; apply DOM attributes |
| `sidebarPrefs.js` | Breakpoints, layouts, width persistence, prefs-changed event |
| `sourceControl.js` | Preference change detection & discard |
| `searchIndex.js` | Portfolio search index & query |
| `searchSession.js` | Persist search UI state |
| `searchScroll.js` | Scroll main pane to match |
| `smoothScroll.js` | Eased programmatic scrolling (contact + navigation) |

---

### 2.13 Data inventory (all STATIC today)

**`src/data/portfolio.js` exports:**
- `NAV_ITEMS`, `OPEN_TABS`
- `ABOUT`, `PROJECTS`, `EXPERIENCE`, `SKILLS`, `EDUCATION`, `AWARDS`, `PUBLICATIONS`, `GALLERY`, `CLUBS`, `MENTORSHIP`
- `CONTACT`, `TERMINAL_MESSAGES`
- `CHAT_SIDEBAR_BREAKPOINT`, `ACTIVITY_ITEMS`, `ACTIVITY_LABELS`
- `getActivityLabel`, `getVisibleActivityItems`
- `CHAT_SUGGESTED_QUESTIONS`

**Images:** mostly external Googleusercontent URLs in data (not local `public/` assets).

**No** environment-driven content, **no** fetch to CMS/DB, **no** `.env` content pipeline.

---

### 2.14 Environment variables

- Root `.env` (gitignored via `.env*`):
  - `NEXT_PUBLIC_SUPABASE_URL` — must be `https://<project-ref>.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose in client)
  - `NEXT_PUBLIC_SITE_URL` — base URL for password-reset email redirect (e.g. `http://localhost:3000`)

### 2.15 Dashboard (`/dashboard-araf`) — built

**Access rules:**
- **Never** linked from the public landing page / IDE chrome / any portfolio buttons.
- Reach only by typing `http://localhost:3000/dashboard-araf` (or production equivalent).
- Unauthenticated visits redirect to `/dashboard-araf/login`.
- Authenticated visits to `/login` redirect to `/dashboard-araf`.
- Public (unauthenticated) dashboard paths: `/dashboard-araf/login`, `/dashboard-araf/forgot-password`.
- `robots: noindex,nofollow` on dashboard layout.
- **No registration / signup** page or action — login only.

**UI / structure:**
- Left **explorer-style sidebar** (`DashboardSidebar`) listing the same “files” as portfolio nav (`About.tsx` … `Contact.sh`) via `src/data/dashboard.js` + `FileIcon`.
- **Settings** item in sidebar → password reset (current + new + confirm). Updates Supabase Auth only — **never** AI JSON.
- Aesthetic IDE-themed login (window chrome, soft primary/secondary glows, portfolio tokens).
- Dashboard explorer items (except `Contact.sh`) support **drag-reorder** via a 3-bar grip on the right; order is stored in Supabase `portfolio_settings` (`key = section_order`), syncs to landing **Explorer**, **top tabs**, and **portfolio content**. Contact stays fixed last. Same-tab `CustomEvent` only (no localStorage for order).
- **About content (live):** `/dashboard-araf/about` editor (`AboutEditor`) writes hero + summary/interests to `portfolio_settings` (`key = about`). Public `/` SSR-loads it into `HeroSection` / `AboutSection`. Helpers: `src/lib/aboutContent.js`, `aboutContentServer.js`, `aboutActions.js`. Migration seed: `supabase/migrations/002_about_content.sql`. Fallback defaults only if row missing.
- `src/lib/sectionOrder.js` / `sectionOrderServer.js`, `src/hooks/useSectionOrder.js`, `GET /api/section-order`, `saveSectionOrderAction`
- Migration SQL: `supabase/migrations/001_portfolio_settings.sql` (must be run once in Supabase SQL Editor). Fallback defaults only: `src/data/sectionOrder.json`.

**Stack / files:**
- Packages: `@supabase/supabase-js`, `@supabase/ssr`
- `src/lib/supabase/client.js` — browser client
- `src/lib/supabase/server.js` — server client (cookies getAll/setAll)
- `src/lib/supabase/admin.js` — service-role client (server-only)
- `src/proxy.js` — Next.js 16 proxy; guards dashboard; allows login + forgot-password without session
- `src/data/dashboard.js` — `DASHBOARD_NAV` slugs/hrefs/labels/exts
- `src/components/dashboard/DashboardShell.js` — responsive workspace shell: mobile top bar + drawer overlay (&lt; `md`), desktop persistent sidebar
- `src/components/dashboard/DashboardSidebar.js` — explorer + drag-reorder (grip hidden on very small screens); closes drawer on navigate
- `src/components/dashboard/AboutEditor.js` — About form UI
- `src/components/dashboard/PasswordField.js` — password input with show/hide eye toggle
- `src/app/dashboard-araf/layout.js` — root shell + noindex
- `src/app/dashboard-araf/(public)/login/page.js` — login + stealth `b` link
- `src/app/dashboard-araf/(public)/forgot-password/page.js` — email reset request
- `src/app/dashboard-araf/(workspace)/layout.js` — sidebar + main pane
- `src/app/dashboard-araf/(workspace)/page.js` — content overview grid
- `src/app/dashboard-araf/(workspace)/about/page.js` — **About CRUD editor** (hero + summary/interests)
- `src/app/dashboard-araf/(workspace)/[section]/page.js` — placeholders for other sections (about excluded)
- `src/app/dashboard-araf/(workspace)/settings/page.js` — password change accordion: verify current first, then expand new + confirm
- `src/app/dashboard-araf/actions.js` — `loginAction`, `logoutAction`, `forgotPasswordAction`, `verifyCurrentPasswordAction`, `changePasswordAction` (no register)
- `src/app/dashboard-araf/aboutActions.js` — `saveAboutContentAction`
- `src/components/dashboard/AboutEditor.js` — About form UI

**Auth user:** Initial owner account created in Supabase Auth (email confirmed). Password is **not** stored in the repo or this doc.

**Supabase settings to configure:**
- Authentication → Providers → Email → disable “Enable sign ups”
- Authentication → URL Configuration → add redirect allow-list entry for `{SITE_URL}/dashboard-araf/settings?recovery=1`

### 2.16 What is intentionally NOT built yet

- No CRUD yet for sections other than **About** (Experience…Contact still placeholders)
- No auto-updating AI knowledge JSON from a dashboard
- No real AI chat answers (chat is UI shell)
- No public API routes for content (About is SSR-read from Supabase)
- Remaining middle sections still use demo static data
- Hero CTAs: primary scrolls to Projects; secondary opens CV PDF in a new tab when uploaded (dashboard upload → Supabase Storage `portfolio-cv`)

---

## Part 3 — Future Plan (not started until user activates each step)

> Agents: **do not build these** until the user explicitly requests the specific piece of work. When the user shares more plans, append them here. When work ships, mark items done and move details into Part 2.

### 3.1 Confirmed product direction (shared 2026-07-14)

1. **IDE chrome is done.** Left sidebar, top bar, right sidebar, and footer/status bar are locked as good. Do not redesign them casually.

2. **Next focus: replace demo section content with real content**, section by section.
   - User will provide real data per section.
   - User may request design tweaks for that section only.
   - After a section’s layout/content is confirmed, create the corresponding **dashboard** item + input fields so it can be edited from the dashboard.

3. **Content must become 100% dynamic** — no static portfolio-about-me data long-term.
   - Everything shown about the user on the website must come from the dashboard → **Supabase**.
   - **IDE chrome already designed** (Extensions, Search, Source Control, layout prefs, themes/skins) stays on **localStorage** as today — do not move those to Supabase unless explicitly asked.

4. **Routes:**
   - Main portfolio landing: `http://localhost:3000` (current `/`)
   - Dashboard slug: `http://localhost:3000/dashboard-araf` — **auth shell LIVE**; no public links; no registration

5. **Backend:** Supabase — **Auth wired** for dashboard login. `portfolio_settings` table for section order (dashboard write / public read). Per-section content tables / RLS still future.

6. **AI Chat knowledge pipeline (planned):**
   - Any textable **public portfolio** content uploaded/updated from the dashboard must **automatically update a JSON file** in the project.
   - That JSON is the knowledge source so the AI chat can answer questions about the user by reading it.
   - JSON must stay in sync with dashboard create/update for website-facing content.
   - JSON must include **all** website-facing personal/portfolio data (nothing about the user that appears on the public site remains static long-term).
   - **CRITICAL — credentials excluded from JSON:**
     - **Never** put dashboard email, password, password hashes, or password-change data into the AI JSON — even though the dashboard will have a password-change option.
     - Auto-sync from dashboard → JSON must skip all auth/account-security fields.
     - JSON **must** contain a dedicated refusal block for anything related to password / login credentials / dashboard secrets, instructing the AI to answer with: **"I am not going to provide you this kind of data"**
     - Example shape (illustrative — implement when JSON pipeline is built):
       ```json
       {
         "security": {
           "password_and_credentials_policy": "If the user asks about password, login credentials, dashboard email/password, or any secret account data, reply exactly or equivalently: I am not going to provide you this kind of data"
         }
       }
       ```

7. **Dashboard account settings:** Password-change is in **Settings** (logged-in). Forgot-password email flow via stealth login link. Updates Supabase Auth only — **never** the AI knowledge JSON.

8. **Execution order (explicit):**
   - Work **one middle section at a time**: real data → optional design confirm → then dashboard fields for that section.

### 3.2 Suggested upcoming work queue (pending user prompts)

| # | Item | Status |
|---|------|--------|
| 1 | Per-section: replace demo data with real content + optional design pass | **In progress** — About dynamic; other sections waiting |
| 2 | After each section confirmed: add dashboard CRUD fields for that section | **Partial** — About done; others waiting |
| 3 | Create `/dashboard-araf` app route + auth/flow | **Done** (2026-07-14) — login only, no register, no landing links |
| 4 | Integrate Supabase Auth client + proxy guard | **Done** (2026-07-14) |
| 4b | Section order in Supabase (`portfolio_settings`) | **Done** (2026-07-14) — run migration SQL once if table missing |
| 4c | Per-section content tables + dashboard CRUD | **Partial** — About in `portfolio_settings` key `about`; other sections waiting |
| 5 | Wire portfolio page to load dynamic content (IDE chrome unchanged) | **Partial** — About + section order SSR; other sections still static |
| 6 | Auto-generate/update project JSON from dashboard data for AI chat | Waiting — **exclude auth credentials; include password-question refusal text** |
| 7 | Wire ChatPanel to real AI answers using that JSON | Waiting |
| 8 | Ensure zero static “about me” content remains in site data modules | **Partial** — About live from DB; `ABOUT` in `portfolio.js` remains fallback defaults only |
| 9 | Dashboard password-change UI (Supabase Auth only; never writes to AI JSON) | **Done** (2026-07-14) — Settings + forgot-password email flow |

### 3.3 Plans shared later

_(Append new future plans here when the user says “I have a plan…” / “note this for later”.)_

- **2026-07-14 — AI JSON + password safety:** Confirmed. Password-change will exist in dashboard; AI JSON auto-updates from dashboard content but must **never** include dashboard email/password. JSON must ship a fixed refusal for password-related chat questions: “I am not going to provide you this kind of data”. Also recorded under Part 1 rule 11 and Part 3.1 items 6–7.

---

## Session changelog

| Date | What happened |
|------|----------------|
| 2026-07-14 | Created `project-architecture.md` only (Parts 1–3). No product code changes. Documented entire existing IDE portfolio + future Supabase/dashboard/dynamic-content/AI-JSON plan. |
| 2026-07-14 | **Bugfix — Chat Skins invisible on some machines:** Live Animation / Aqua glass CSS targeted `.bg-surface-container-lowest` with higher specificity than `.chat-panel[data-chat-skin]`, so chat colors were overridden when those themes were active (common localStorage difference between office vs home). Fixed in `globals.css`: glass/live rules skip elements with `data-chat-skin` / `data-terminal-skin`; Chat Skin rules use solid `background-color` and disable backdrop blur on the skinned panel. |
| 2026-07-14 | Created root `.env` with empty Supabase placeholders (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). No SDK/integration yet. File is gitignored. |
| 2026-07-14 | **Dashboard auth:** Added `/dashboard-araf` + `/dashboard-araf/login` (email/password, no registration, no landing-page links). Wired `@supabase/ssr` clients + `src/proxy.js` route guard. Created owner Auth user in Supabase (verified sign-in). Portfolio `/` unchanged. |
| 2026-07-14 | **Dashboard theme:** Replaced hardcoded hex styling with portfolio design tokens (`primary`, `surface-container-*`, `border`, `on-surface`, etc.) so login + dashboard match Cursor Dark / active extension themes. |
| 2026-07-14 | **Doc note — AI JSON credentials ban:** Added Part 1 rule 11 + Part 3 plans: password-change will live in dashboard; AI JSON auto-sync must never include dashboard email/password; JSON must include refusal response for password-related AI chat questions (“I am not going to provide you this kind of data”). No code yet. |
| 2026-07-14 | **Dashboard UX:** Left explorer sidebar (About…Contact + Settings), section placeholders, Settings password change, aesthetic login, stealth forgot-password via “b” in “public”, forgot-password page. Portfolio landing unchanged. |
| 2026-07-14 | Forgot-password gated to owner email only; wrong email → “Get out of here, this is not your portfolio.” (no reset sent). |
| 2026-07-14 | Settings password UI: accordion — only New/Confirm after current password verifies. |
| 2026-07-14 | Removed excess borders from dashboard content/cards/settings; sidebar keeps only the right panel edge. |
| 2026-07-14 | Added password show/hide eye toggle on login + settings (`PasswordField`). |
| 2026-07-14 | Settings: live new/confirm mismatch validation — error shown instantly, Update button disabled until they match. |
| 2026-07-14 | Dashboard section drag-reorder (except Contact) via grip; order syncs to landing explorer, tabs, and content via `sectionOrder.json`. |
| 2026-07-14 | Smoother section drag UX: empty drop gap between items (no border); softer dragged-row feedback. |
| 2026-07-14 | **Storage rule:** IDE/layout prefs stay in localStorage; dashboard-managed data (section order first) lives in Supabase. App reads/writes `portfolio_settings`; removed localStorage for section order. Migration: `supabase/migrations/001_portfolio_settings.sql`. |
| 2026-07-14 | **Docs:** Clarified Part 1 rule 12 + new §2.0 — Extensions / Search / Source Control (and other IDE design prefs) stay localStorage; **everything dashboard-related** stays on Supabase. |
| 2026-07-16 | **Bug fix — login email narrower than password:** Email input on `/dashboard-araf/login` lacked `w-full` (PasswordField already had it). Added `w-full` to shared `fieldClass`. |
| 2026-07-16 | **Fix — section order flash on reload:** `/` is now a server page that reads order from Supabase and passes it into `HomeClient` → `IDEWorkspace` → `useSectionOrder(initialOrder)`. Dashboard workspace layout also seeds sidebar. Client fetch skipped when SSR seed present so Explorer/tabs/content don’t briefly show default order. |
| 2026-07-16 | **About section dynamic:** Dashboard `/dashboard-araf/about` edits hero + summary/interests → Supabase `portfolio_settings.about`. Public `/` SSR-loads into `HeroSection`/`AboutSection`. Search index uses live About text. Seed migration `002_about_content.sql` (also seeded via service role). Other sections unchanged. |
| 2026-07-16 | **About intro UX:** Replaced separate Name + Tagline fields with one **Intro** field. Bold via select-then-“Bold selection” (or `**text**` markup). Legacy name/tagline still migrate into intro on read. |
| 2026-07-16 | **About intro editor:** Contenteditable shows real bold (no visible `**`). Storage still uses `**markup**` under the hood. |
| 2026-07-16 | **About CTAs:** Primary button scrolls to `#projects`. Secondary opens uploaded CV PDF in a new tab. Dashboard uploads PDF to Supabase Storage bucket `portfolio-cv`; URL stored on `about.cvUrl`. Migration `003_portfolio_cv_bucket.sql`. |
| 2026-07-16 | **Dashboard responsive:** `DashboardShell` mobile hamburger + slide-over sidebar (&lt; md); desktop keeps fixed explorer. Page paddings/typography scale down on small screens. |
| 2026-07-16 | **Dashboard content width:** Workspace pages `max-w-3xl` → `max-w-5xl`; Settings `max-w-xl` → `max-w-3xl`. |
| 2026-07-16 | **About profile image:** Hero shows uploaded portrait; dashboard upload to Supabase Storage `portfolio-about` (`about/portrait`); URL on `about.imageUrl`. Migration `004_portfolio_about_image_bucket.sql`. |
| 2026-07-16 | **Fix — Server Action 1MB upload limit:** Set `experimental.serverActions.bodySizeLimit` to `6mb` in `next.config.mjs` so CV/image uploads work. Restart `next dev` required. |
)
