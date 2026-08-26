# Project Architecture — arafat.workspace

> **Mandatory for every Cursor agent session:** Read this entire file before writing or changing any code. After finishing work from a user prompt, update this file so office PC and home PC sessions stay in sync.

**Last updated:** 2026-08-26 (Dashboard Extension UX polish)

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
| **localStorage** | Existing IDE chrome & design prefs (already built; keep) | Extensions install/activate + theme/font/skin options; Search query/session; Source Control “discard prefs”; sidebar widths; workspace/activity tabs; glass / live animation; **AI chat thread** |
| **Supabase** | Everything dashboard-related / public shared content | Auth; `portfolio_settings.section_order`; portfolio section content; **`portfolio_settings.ui_extensions`** (site default IDE theme/extensions); anything editable under `/dashboard-araf` that drives the landing page |

**Agent reminder:** Do not “upgrade” Extensions, Search, or Source Control to Supabase unless the user explicitly asks. Do not store dashboard section order or portfolio content in localStorage.

### 2.1 Project purpose

Personal portfolio for **Arafat**, branded **`arafat.workspace`**. The entire site is presented as a **VS Code / Cursor-style IDE**:

- Portfolio sections appear as “files” in a fake workspace.
- Left activity bar switches Explorer / Search / Extensions / Source Control / Chat.
- Top bar has window chrome, breadcrumb, and editor-style tabs.
- Main editor area scrolls through portfolio content (and extension detail views).
- Right panel is an AI chat sidebar (Gemini + live `ai_knowledge`; thread in localStorage).
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
├── next.config.mjs                # serverActions bodySizeLimit + turbopack.root
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

**API:** `GET /api/section-order` (public read of Supabase `portfolio_settings.section_order`). `GET /api/ai-knowledge` (public read of cached AI knowledge). Auth uses Server Actions + Supabase Auth cookies via `src/proxy.js`.

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
| explorer | `ExplorerSidebar.js` | Tree of `NAV_ITEMS` (“files”); expand/collapse portfolio folder; OUTLINE + TIMELINE |
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
- Live Gemini answers via `POST /api/chat`, grounded on Supabase `ai_knowledge` (system prompt in `geminiChat.js`)
- Thread persists in **localStorage** (`chatSession.js` → `portfolio-chat-session-v1`) — not the database
- Appears in Source Control as `chat/thread`; discard/clear removes the thread
- Themeable via Chat Skins extension (`data-chat-theme` etc.)

#### Status bar / footer (`StatusBar.js`)
- IDE-style footer status
- Ties into terminal message ticker (`useTerminalMessages.js`) / preference change count metaphor

#### Contact experience (not a normal middle section)
- `ContactReveal.js` + `ContactScrollTrack` — custom scroll reveal dock
- `ContactTerminal.js` — “Let’s Connect” terminal UI (`email` mailto, `github` link, brand-colored `social` pipe links)
- `TerminalLiveCanvas.js` — live motion inside terminal when terminal-theme live skins active
- Contact data from Supabase `portfolio_settings` key `contact` (fallback: `DEFAULT_CONTACT_CONTENT` / legacy `CONTACT` in `portfolio.js`); ticker still uses `TERMINAL_MESSAGES`
- Smooth scrolling via `lib/smoothScroll.js`
- Edited at `/dashboard-araf/contact` — migration `015_contact_content.sql`

---

### 2.6 Main / middle content — portfolio sections

`PortfolioContent.js` stacks sections inside a max-width column (`max-w-[900px]`, large vertical spacing). Each section (except the overall contact dock) is wrapped in `SectionSearchTarget` for search highlighting.

| Hash / “file” | Label (explorer) | Component | Data export | Status |
|---------------|------------------|-----------|-------------|--------|
| `#about` | About.tsx | `HeroSection` + `AboutSection` | Supabase `portfolio_settings` key `about` (+ `visibility` toggles) | **Dynamic** — edited at `/dashboard-araf/about` |
| `#experience` | Experience.json | `ExperienceSection` | Supabase `portfolio_settings` key `experience` | **Dynamic** — edited at `/dashboard-araf/experience` |
| `#skills` | Skills.ts | `SkillsSection` | Supabase `portfolio_settings` key `skills` | **Dynamic** — edited at `/dashboard-araf/skills` |
| `#projects` | Projects.tsx | `ProjectsSection` | Supabase `portfolio_settings` key `projects` | **Dynamic** — edited at `/dashboard-araf/projects` |
| `#education` | Education.json | `EducationSection` | Supabase `portfolio_settings` key `education` | **Dynamic** — edited at `/dashboard-araf/education` |
| `#awards` | Awards.md | `AwardsSection` | Supabase `portfolio_settings` key `awards` | **Dynamic** — edited at `/dashboard-araf/awards` |
| `#publication` | Publication.md | `PublicationSection` | Supabase `portfolio_settings` key `publication` | **Dynamic** — edited at `/dashboard-araf/publication` |
| `#gallery` | Gallery.tsx | `GallerySection` | Supabase `portfolio_settings` key `gallery` | **Dynamic** — edited at `/dashboard-araf/gallery` |
| `#clubing` | Clubing.ts | `ClubingSection` | Supabase `portfolio_settings` key `clubing` | **Dynamic** — edited at `/dashboard-araf/clubing` |
| `#mentorship` | Mentorship.ts | `MentorshipSection` | Supabase `portfolio_settings` key `mentorship` | **Dynamic** — edited at `/dashboard-araf/mentorship` |
| `#contact` | Contact.sh | Contact reveal/terminal (IDE layer) | Supabase `portfolio_settings` key `contact` | **Dynamic** — edited at `/dashboard-araf/contact` |

Shared portfolio UI:
- `SectionHeader.js` — section title + underline rule
- `SectionSearchTarget.js` — wraps section DOM for search mark/`<mark>` highlighting

**Known gaps in middle content:**
- Hero CTAs (e.g. “View Projects”, “Download CV”) appear non-wired / demo
- Content is placeholder (Vercel/Stripe-style sample résumé), not final real data
- Per-section layouts may still change when real data arrives (user will approve per section)

---

### 2.7 Extensions marketplace system

**Persistence:** Visitor overrides stay in **localStorage** (`portfolio-extensions-v7`). **Site defaults** live in Supabase `portfolio_settings` key `ui_extensions` (dashboard Settings → UI → Extension), with a `revision` stamp. First visit / empty localStorage / Source Control discard → site defaults. When the dashboard owner changes defaults, `revision` bumps and visitors’ extension localStorage is cleared on next load so they see the new defaults (then they can customize again). Frontend Extensions marketplace behavior otherwise unchanged.

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
- `lib/sourceControl.js` — collect changes, discard one, discard all (extensions, search, layout, **chat thread**)
- Chat dirty state: `chat:thread` → path `chat/thread` when `isChatSessionDirty()`; discard calls `clearChatSession()`
- Emits / listens with prefs-changed event from `sidebarPrefs`
- Dirty state also influences terminal message ticker / status metaphors
- Expanding Explorer **OUTLINE** / **TIMELINE** flags Source Control changes (`explorer/outline`, `explorer/timeline`); state persists in localStorage until discarded

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
| `experienceContent.js` | Normalize Experience payload; defaults; search/AI helpers |
| `experienceContentServer.js` | Read/write Experience in Supabase `portfolio_settings`; triggers AI knowledge sync |
| `skillsContent.js` | Normalize Skills payload; defaults; search/AI helpers |
| `skillsContentServer.js` | Read/write Skills in Supabase `portfolio_settings`; triggers AI knowledge sync |
| `projectsContent.js` | Normalize Projects payload; defaults; search/AI helpers |
| `projectsContentServer.js` | Read/write Projects in Supabase `portfolio_settings`; triggers AI knowledge sync |
| `educationContent.js` | Normalize Education payload; defaults; search/AI helpers |
| `educationContentServer.js` | Read/write Education in Supabase `portfolio_settings`; triggers AI knowledge sync |
| `awardsContent.js` | Normalize Awards payload; defaults; search/AI helpers |
| `awardsContentServer.js` | Read/write Awards in Supabase `portfolio_settings`; triggers AI knowledge sync |
| `publicationContent.js` | Normalize Publication payload; defaults; search/AI helpers |
| `publicationContentServer.js` | Read/write Publication in Supabase `portfolio_settings`; triggers AI knowledge sync |
| `aiKnowledge.js` | Build AI chat knowledge payload + security refusal constants (no auth fields) |
| `aiKnowledgeServer.js` | Sync/read `portfolio_settings.ai_knowledge`; optional local JSON mirror |
| `extensionStorage.js` | Read/write extension + workspace localStorage; apply DOM attributes |
| `sidebarPrefs.js` | Breakpoints, layouts, width persistence, prefs-changed event |
| `sourceControl.js` | Preference change detection & discard vs **site UI defaults** (`ui_extensions`) |
| `uiExtensions.js` / `uiExtensionsServer.js` | Normalize + read/write site default extension state (`portfolio_settings.ui_extensions`); no AI sync |
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
- **System** block (below content files): **Message**, **AI Chat**, then **Settings**. Message / AI Chat are not in `DASHBOARD_NAV` / not reorderable.
- **Message inbox (live):** `/dashboard-araf/messages` — opens a second left sidebar (same slide pattern as Settings) listing **senders** by email. Thread route: `/dashboard-araf/messages/[emailKey]`. Contact form submissions stored in Supabase table `contact_messages`. Same visitor email → one chat thread; different emails → separate threads. Mark-read on open; delete conversation. Public form in `ContactTerminal` inserts via `submitContactMessageAction` (service role). Helpers: `contactMessages.js`, `contactMessagesServer.js`, `messageActions.js`. UI: `MessagesSidebar.js`, `MessageThreadView.js`. Migration: `016_contact_messages.sql`. **Never** written to `ai_knowledge`.
- **AI Chat inbox (live):** `/dashboard-araf/ai-chats` — second sidebar listing **visitors by IP** (display name = IP). Thread route: `/dashboard-araf/ai-chats/[ipKey]`. Each portfolio AI question from `POST /api/chat` is logged (user message only) into Supabase `ai_chat_messages` via service role; same IP → one thread. Mark-read on open; delete conversation. Helpers: `clientIp.js`, `aiChatMessages.js`, `aiChatMessagesServer.js`, `aiChatActions.js`. UI: `AiChatsSidebar.js`, `AiChatThreadView.js`. Migration: `020_ai_chat_messages.sql`. **Never** written to `ai_knowledge`. (Visitor’s local chat thread still stays in localStorage.)
- **Settings** item in sidebar → opens a second left **Settings** sidebar (smooth width slide on desktop). Items: **Change email**, **Change password**, **Gemini API key**, **AI Context Knowledgebase**, **UI → Extension** (site default themes/skins). Auth/email/password/API keys/UI defaults never touch AI JSON. `/dashboard-araf/settings` redirects to email.
- **Gemini API key (live):** `/dashboard-araf/settings/gemini-api` — multiple free Gemini keys in private Supabase table `gemini_api_keys` (authenticated + service_role only; **not** `portfolio_settings`). Up to **5 keys Active** at once; one **In use** checkbox among actives (persisted `is_current`) — green toggle = in use; other actives standby. Chat tries in-use first, then standby; **auto-deactivates** on quota/invalid and promotes next in use. Masked list + runtime errors in settings. Token-lean chat: compact knowledge JSON, short system prompt, 6-turn history, Flash Lite model. Visitors never see key errors — funny fallback. Migrations: `017` (legacy), `018`, `021` (multi-active), `022_gemini_in_use_key.sql`. Helpers: `geminiKey.js`, `geminiKeyServer.js`, `geminiChat.js`, `geminiKeyActions.js`, `GeminiApiKeyForm.js`.
- **Portfolio chat panel (live):** `ChatPanel` posts to `/api/chat`; server loads `ai_knowledge` + active Gemini key pool with failover; also logs the visitor’s question for the AI Chat inbox. Thread in localStorage (`chatSession.js`); Source Control can discard `chat/thread`. Key never sent to the browser.
- Aesthetic IDE-themed login (window chrome, soft primary/secondary glows, portfolio tokens).
- Dashboard explorer items (except `Contact.sh`) support **drag-reorder** via a 3-bar grip on the right; order is stored in Supabase `portfolio_settings` (`key = section_order`), syncs to landing **Explorer**, **top tabs**, and **portfolio content**. Contact stays fixed last. Same-tab `CustomEvent` only (no localStorage for order).
- **About content (live):** `/dashboard-araf/about` editor (`AboutEditor`) writes hero + summary/interests to `portfolio_settings` (`key = about`). Per-block **show/hide** toggles (`visibility`: image, headline, intro, primaryCta, secondaryCta, summary, interests) control public landing display; hidden content is kept in Supabase. Public `/` SSR-loads it into `HeroSection` / `AboutSection`. Helpers: `src/lib/aboutContent.js`, `aboutContentServer.js`, `aboutActions.js`. Migration seed: `supabase/migrations/002_about_content.sql`. Fallback defaults only if row missing.
- **Experience content (live):** `/dashboard-araf/experience` editor (`ExperienceEditor`) writes section header `title` (landing `SectionHeader`, default `Experience`) + jobs (company, optional company URL, role, On-site/Remote dropdown, employment type as plain text, start/end date pickers displaying `June 25, 2024`, location, bullets, per-entry show/hide) to `portfolio_settings` (`key = experience`). Company name links open `companyUrl` when set. Hidden entries stay in Supabase but are omitted from the public portfolio, search, and AI knowledge. Remove actions use shared `ConfirmModal` (“Are you sure?”). Public `/` SSR-loads into `ExperienceSection`. Helpers: `experienceContent.js`, `experienceContentServer.js`, `experienceActions.js`. Migration seed: `supabase/migrations/006_experience_content.sql`.
- **Skills content (live):** `/dashboard-araf/skills` editor (`SkillsEditor`) writes section header `title` (landing `SectionHeader`, default `Tech Stack`) + skill groups (title, items one-per-line, reorder, per-group show/hide) to `portfolio_settings` (`key = skills`). Hidden groups stay in Supabase but are omitted from the public portfolio, search, and AI knowledge. Public `/` SSR-loads into `SkillsSection`. Helpers: `skillsContent.js`, `skillsContentServer.js`, `skillsActions.js`. Migration seed: `supabase/migrations/007_skills_content.sql`.
- **Projects content (live):** `/dashboard-araf/projects` editor (`ProjectsEditor`) writes section header `title` (landing `SectionHeader`, default `Selected Projects`), subtitle, and projects (item title, description, tags, live/code URLs, image URL/alt, reorder, per-item show/hide) to `portfolio_settings` (`key = projects`). Live/code icons open URLs when set. Hidden projects stay in Supabase but are omitted from public portfolio, search, and AI knowledge. Public `/` SSR-loads into `ProjectsSection`. Helpers: `projectsContent.js`, `projectsContentServer.js`, `projectsActions.js`. Migration seed: `supabase/migrations/008_projects_content.sql`.
- **Education content (live):** `/dashboard-araf/education` editor (`EducationEditor`) writes section header `title` (default `Education`) + entries (degree, institution, period, optional GPA, highlights one-per-line, reorder, per-entry show/hide) to `portfolio_settings` (`key = education`). Layout matches Experience (full-width stacked cards). Hidden entries stay in Supabase but are omitted from public portfolio, search, and AI knowledge. Public `/` SSR-loads into `EducationSection`. Helpers: `educationContent.js`, `educationContentServer.js`, `educationActions.js`. Migration seed: `supabase/migrations/009_education_content.sql`.
- **Awards content (live):** `/dashboard-araf/awards` editor (`AwardsEditor`) writes section header `title` (default `Awards`) + entries (title, issuer, year, description, reorder, per-entry show/hide) to `portfolio_settings` (`key = awards`). Layout matches Experience (full-width stacked cards). Hidden entries stay in Supabase but are omitted from public portfolio, search, and AI knowledge. Public `/` SSR-loads into `AwardsSection` (2-col card grid). Helpers: `awardsContent.js`, `awardsContentServer.js`, `awardsActions.js`. Migration seed: `supabase/migrations/010_awards_content.sql`.
- **Publication content (live):** `/dashboard-araf/publication` editor (`PublicationEditor`) writes section header `title` (default `Publication`) + entries (title, authors, venue, type, year, optional link, reorder, per-entry show/hide) to `portfolio_settings` (`key = publication`). Layout matches Experience (full-width stacked cards). Hidden entries stay in Supabase but are omitted from public portfolio, search, and AI knowledge. Public `/` SSR-loads into `PublicationSection` (Read link only when URL set). Helpers: `publicationContent.js`, `publicationContentServer.js`, `publicationActions.js`. Migration seed: `supabase/migrations/011_publication_content.sql`.
- **Gallery content (live):** `/dashboard-araf/gallery` — caption, image URL/alt, wide layout flag, reorder, show/hide → `portfolio_settings.gallery`. Migration `012_gallery_content.sql`.
- **Clubing content (live):** `/dashboard-araf/clubing` — name, role, period, description, reorder, show/hide → `portfolio_settings.clubing`. Migration `013_clubing_content.sql`.
- **Mentorship content (live):** `/dashboard-araf/mentorship` — summary stats (mentees/programs/active) + entries (program, role, period, mentees, topics, description, reorder, show/hide) → `portfolio_settings.mentorship`. Migration `014_mentorship_content.sql`.
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
- `src/app/dashboard-araf/layout.js` — root shell + noindex + `DashboardThemeLock` (fixed Cursor Dark; ignores portfolio themes)
- `src/app/dashboard-araf/(public)/login/page.js` — login + stealth `b` link
- `src/app/dashboard-araf/(public)/forgot-password/page.js` — email reset request
- `src/app/dashboard-araf/(workspace)/layout.js` — sidebar + main pane
- `src/app/dashboard-araf/(workspace)/page.js` — content overview grid
- `src/app/dashboard-araf/(workspace)/about/page.js` — **About CRUD editor** (hero + summary/interests)
- `src/app/dashboard-araf/(workspace)/experience/page.js` — **Experience CRUD editor**
- `src/app/dashboard-araf/(workspace)/skills/page.js` — **Skills CRUD editor**
- `src/app/dashboard-araf/(workspace)/projects/page.js` — **Projects CRUD editor**
- `src/app/dashboard-araf/(workspace)/education/page.js` — **Education CRUD editor**
- `src/app/dashboard-araf/(workspace)/awards/page.js` — **Awards CRUD editor**
- `src/app/dashboard-araf/(workspace)/publication/page.js` — **Publication CRUD editor**
- `src/app/dashboard-araf/(workspace)/[section]/page.js` — placeholders for other sections (about + experience + skills + projects + education + awards + publication excluded)
- `src/app/dashboard-araf/experienceActions.js` — `saveExperienceContentAction`
- `src/app/dashboard-araf/skillsActions.js` — `saveSkillsContentAction`
- `src/app/dashboard-araf/projectsActions.js` — `saveProjectsContentAction`
- `src/app/dashboard-araf/educationActions.js` — `saveEducationContentAction`
- `src/app/dashboard-araf/awardsActions.js` — `saveAwardsContentAction`
- `src/app/dashboard-araf/publicationActions.js` — `savePublicationContentAction`
- `src/components/dashboard/ExperienceEditor.js` — Experience form UI
- `src/components/dashboard/SkillsEditor.js` — Skills form UI
- `src/components/dashboard/ProjectsEditor.js` — Projects form UI
- `src/components/dashboard/EducationEditor.js` — Education form UI
- `src/components/dashboard/AwardsEditor.js` — Awards form UI
- `src/components/dashboard/PublicationEditor.js` — Publication form UI
- `src/components/dashboard/ItemActionsMenu.js` — ⋮ menu (show/hide, delete, move) for Experience/Skills/Projects/Education/Awards/Publication cards
- `src/components/dashboard/Modal.js` — shared `Modal` shell + `ConfirmModal` + `StatusModal` (blurred backdrop)
- `src/components/dashboard/SettingsSidebar.js` — nested settings nav (email / password) with back control
- `src/components/dashboard/ChangeEmailForm.js` / `ChangePasswordForm.js` — separate settings forms
- `src/app/dashboard-araf/(workspace)/settings/page.js` — redirects to `/settings/email`
- `src/app/dashboard-araf/(workspace)/settings/email/page.js` — change email page
- `src/app/dashboard-araf/(workspace)/settings/password/page.js` — change password page
- `src/app/dashboard-araf/(workspace)/settings/ai-knowledge/page.js` — read-only live JSON from Supabase `ai_knowledge`
- `src/app/dashboard-araf/actions.js` — `loginAction`, `logoutAction`, `forgotPasswordAction`, `verifyCurrentPasswordAction`, `changePasswordAction`, `changeEmailAction` (no register)
- `src/app/dashboard-araf/aboutActions.js` — `saveAboutContentAction`
- `src/components/dashboard/AboutEditor.js` — About form UI

**Auth user:** Initial owner account created in Supabase Auth (email confirmed). Password is **not** stored in the repo or this doc.

**Supabase settings to configure:**
- Authentication → Providers → Email → disable “Enable sign ups”
- Authentication → URL Configuration → add redirect allow-list entry for `{SITE_URL}/dashboard-araf/settings/password?recovery=1`

### 2.16 AI knowledge JSON (dashboard → Supabase sync)

**Source of truth (production):** Supabase `portfolio_settings` key `ai_knowledge` (JSONB).

Local mirror removed — production reads the Supabase `portfolio_settings.ai_knowledge` row directly.

**Rules (Part 1 §11):**
- Public portfolio content only (About, section order today; more sections as CRUD ships).
- **Never** includes dashboard email, password, password-change fields, or auth secrets.
- **Never** includes Message inbox / `contact_messages` (visitor form submissions) — private dashboard-only.
- **Never** includes AI Chat inbox / `ai_chat_messages` (visitor questions by IP) — private dashboard-only.
- **Never** includes Gemini API keys / `dashboard_secrets`.
- **Never** includes UI extension defaults / `ui_extensions` (IDE chrome, not résumé content).
- Always includes `security.password_and_credentials_policy` refusal text: `I am not going to provide you this kind of data`.
- Settings / auth / Gemini key actions must **never** write to this knowledge blob.
- Message inbox and AI Chat inbox save/read/delete must **never** call `syncAiKnowledgeFromDashboard()`.

**Auto-sync:** After every successful write of any dynamic portfolio section (About…Contact) or section order, `syncAiKnowledgeFromDashboard()` rebuilds the payload and **upserts** `ai_knowledge` in Supabase. Sync errors are logged and do not fail the dashboard save.

**Chat:**
- Next.js: `POST /api/chat` (no-store) — server-only Gemini call grounded on `ai_knowledge`
- Next.js: `GET /api/ai-knowledge` (no-store)
- Supabase Edge Function: `supabase/functions/ai-knowledge` — deploy with `supabase functions deploy ai-knowledge` → `https://<project-ref>.supabase.co/functions/v1/ai-knowledge`
- Migration seed: `supabase/migrations/005_ai_knowledge.sql` (run once in SQL Editor if needed)

### 2.17 What is intentionally NOT built yet

- Hero CTAs: primary scrolls to Projects; secondary opens CV PDF in a new tab when uploaded (dashboard upload → Supabase Storage `portfolio-cv`)
- Streaming / multi-turn tool use beyond portfolio Q&A

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

6. **AI Chat knowledge pipeline:**
   - **Supabase sync LIVE** — dashboard public content upserts `portfolio_settings` key `ai_knowledge` (About + section order today). Readable via `GET /api/ai-knowledge` and Edge Function `ai-knowledge`.
  - (Local JSON mirror removed) Production reads Supabase directly.
   - Wire ChatPanel to real AI answers using that knowledge — **Done** (localStorage thread + SCM).
   - Expand as each section gets CRUD.
   - **CRITICAL — credentials excluded** (enforced in builder): never dashboard email/password; always include refusal: **"I am not going to provide you this kind of data"**

7. **Dashboard account settings:** Password-change + email-change in **Settings** (logged-in). Forgot-password email flow via stealth login link. Updates Supabase Auth only — **never** the AI knowledge JSON. Forgot-password owner check uses Auth user list (works after email change).

8. **Execution order (explicit):**
   - Work **one middle section at a time**: real data → optional design confirm → then dashboard fields for that section.

### 3.2 Suggested upcoming work queue (pending user prompts)

| # | Item | Status |
|---|------|--------|
| 1 | Per-section: replace demo data with real content + optional design pass | **Done** — all portfolio sections dynamic (Contact terminal included) |
| 2 | After each section confirmed: add dashboard CRUD fields for that section | **Done** — all sections including Contact |
| 3 | Create `/dashboard-araf` app route + auth/flow | **Done** (2026-07-14) — login only, no register, no landing links |
| 4 | Integrate Supabase Auth client + proxy guard | **Done** (2026-07-14) |
| 4b | Section order in Supabase (`portfolio_settings`) | **Done** (2026-07-14) — run migration SQL once if table missing |
| 4c | Per-section content tables + dashboard CRUD | **Done** — all sections in `portfolio_settings` (Contact: `015`) |
| 5 | Wire portfolio page to load dynamic content (IDE chrome unchanged) | **Done** — all sections SSR from Supabase |
| 6 | Auto-generate/update project JSON from dashboard data for AI chat | **Done** — syncs all sections incl. Contact to Supabase `ai_knowledge`. Auth excluded; refusal text included |
| 7 | Wire ChatPanel to real AI answers using that JSON | **Done** (2026-07-24) — Gemini via dashboard-managed key + funny fallback on key failure |
| 8 | Ensure zero static “about me” content remains in site data modules | **Partial** — live content from DB; `portfolio.js` keeps fallbacks only |
| 9 | Dashboard password-change UI (Supabase Auth only; never writes to AI JSON) | **Done** (2026-07-14) — Settings + forgot-password email flow |
| 9b | Dashboard email-change UI (verify password → new email; Auth only; never AI JSON) | **Done** (2026-07-17) |

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
| 2026-07-17 | **About hero image ratio:** Landing `HeroSection` portrait aspect from `6/10` → `10/12`. Dashboard upload unchanged. |
| 2026-07-17 | **About hero mobile align:** Headline + intro always `text-left` (removed mobile `text-center`); text column `w-full` so left align works under `items-center`. |
| 2026-07-17 | **About hero mobile layout:** Always `flex-row` (text + image side by side). Smaller headline (`text-2xl`→`text-4xl`) and image (`w-24`→`w-40`, `aspect-[10/12]`) only — intro + CTAs unchanged. |
| 2026-07-17 | **About hero mobile structure:** Headline + image side by side; intro + CTAs full-width block below on small screens. From `md`, image sits beside the whole text column again. |
| 2026-07-17 | **About hero breakpoint:** Headline+image side-by-side only for `0–500px`; from `501px` image sits beside the full text column (`min-[501px]:` instead of `md:`). |
| 2026-07-17 | **About hero image ≥501px:** Top-aligned (`items-start` / `self-start`); larger size (`w-44` → `md:w-52`). ≤500px stays `w-24` + vertically centered with headline. |
| 2026-07-17 | **Dashboard About:** Removed helper blurb under About.tsx title (“Edit hero + summary… Saved to Supabase…”). |
| 2026-07-17 | **AI knowledge JSON:** Added `aiKnowledge.js` / `aiKnowledgeServer.js` and Supabase cache (`portfolio_settings.ai_knowledge`). Local `src/data/ai-knowledge.json` mirror removed to avoid repo writes. ChatPanel still not wired. |
| 2026-07-17 | **AI knowledge → Supabase:** Sync upserts `portfolio_settings.ai_knowledge` (production source of truth). Added `GET /api/ai-knowledge`, Edge Function `supabase/functions/ai-knowledge`, migration `005_ai_knowledge.sql`. Local JSON mirror removed. |
| 2026-07-17 | **About visibility toggles:** Dashboard About editor show/hide per block (image, headline, intro, primary/secondary CTA, summary, interests). Stored on `about.visibility` in Supabase; landing + search respect flags. AI knowledge excludes `visibility` to reduce token size. Content kept when hidden. |
| 2026-07-17 | **About visibility UI:** Small ash/gray switch toggles (not primary blue); Shown/Hidden label. |
| 2026-07-17 | **About editor inputs:** Field backgrounds `surface-container-low` → `surface-container-high` (slightly lighter). |
| 2026-07-17 | **Fix — dashboard main bg seam:** Glow overlay was `absolute inset-0` on the scrollport only, so past the viewport height showed a hard color cut. Wrapped content so the gradient spans full scroll height. |
| 2026-07-17 | **Settings change email:** Accordion like password — verify current password, then new email. `changeEmailAction` updates Supabase Auth only (never AI JSON). Forgot-password owner check now uses Auth user list so it survives email changes. |
| 2026-07-17 | **Settings nested sidebar:** Clicking Settings opens a second left sidebar (smooth slide). Separate pages: `/settings/email`, `/settings/password`. Index redirects to email. |
| 2026-07-17 | **Settings AI Context Knowledgebase:** Read-only page at `/settings/ai-knowledge` fetches `portfolio_settings.ai_knowledge` and displays formatted JSON (not editable). |
| 2026-07-17 | **Experience dynamic:** Dashboard `/dashboard-araf/experience` CRUD (company, optional company URL, role, employment type, dates, location, bullets) → Supabase `portfolio_settings.experience`. Landing SSR + company name link. AI knowledge sync includes experience. Migration `006_experience_content.sql`. |
| 2026-07-17 | **Experience editor UX:** On-site/Remote select; start/end date pickers with `June 25, 2024` display; employment type plain input (no datalist arrow); per-entry Shown/Hidden toggle (`visible`). |
| 2026-07-18 | **Dashboard remove confirm:** Shared `ConfirmModal` — Experience entry Remove, About image Remove, and Remove CV all ask “Are you sure?” before deleting. |
| 2026-07-18 | **Dashboard modals unified:** `src/components/dashboard/Modal.js` — base `Modal` + `ConfirmModal` + `StatusModal` (same panel UI). Backdrop dim overlay (`bg-black/70`, no blur) + modal panel shadow/border so it reads against matching surface colors. Portaled to `document.body` at `z-[100]`. About + Experience success/error use `StatusModal`. |
| 2026-07-18 | **Skills dynamic:** Dashboard `/dashboard-araf/skills` CRUD (skill groups: title, items, reorder, show/hide) → Supabase `portfolio_settings.skills`. Landing SSR. Search + AI knowledge sync. Migration `007_skills_content.sql`. |
| 2026-07-20 | **Projects dynamic:** Dashboard `/dashboard-araf/projects` CRUD (subtitle, title, description, tags, live/code URLs, image URL/alt, reorder, show/hide) → Supabase `portfolio_settings.projects`. Landing SSR + real link icons. Search + AI knowledge sync. Migration `008_projects_content.sql`. |
| 2026-07-24 | **Projects dashboard layout:** `ProjectsEditor` cards switched from Skills-style 2-column grid to Experience-style full-width stacked sections. Fields/actions unchanged. |
| 2026-07-24 | **Dynamic section headers:** Experience / Skills / Projects store a section `title` in Supabase (defaults: Experience, Tech Stack, Selected Projects). Editable in each dashboard editor; landing `SectionHeader` + search + AI knowledge use it. About hero headline already dynamic (unchanged). |
| 2026-07-24 | **Education dynamic:** Dashboard `/dashboard-araf/education` CRUD (section header title, degree, institution, period, GPA, highlights, reorder, show/hide) → Supabase `portfolio_settings.education`. Landing SSR. Search + AI knowledge sync. Migration `009_education_content.sql`. |
| 2026-07-24 | **Awards dynamic:** Dashboard `/dashboard-araf/awards` CRUD (section header title, award title, issuer, year, description, reorder, show/hide) → Supabase `portfolio_settings.awards`. Landing SSR. Search + AI knowledge sync. Migration `010_awards_content.sql`. |
| 2026-07-24 | **Content workspace Settings:** Dashboard home (`/dashboard-araf`) adds a bottom **System → Settings** link (same destination as sidebar: `/settings/email`). |
| 2026-07-24 | **Publication dynamic:** Dashboard `/dashboard-araf/publication` CRUD (section header title, title, authors, venue, type, year, optional link, reorder, show/hide) → Supabase `portfolio_settings.publication`. Landing SSR. Search + AI knowledge sync. Migration `011_publication_content.sql`. |
| 2026-07-24 | **Gallery + Clubing + Mentorship dynamic:** Dashboard CRUD for all three → Supabase keys `gallery` / `clubing` / `mentorship`. Gallery: caption, image URL/alt, wide flag. Clubing: name, role, period, description. Mentorship: stats (mentees/programs/active) + program entries with topics. Landing SSR + search + AI sync. Migrations `012`–`014`. |
| 2026-07-24 | **Contact dynamic:** Dashboard `/dashboard-araf/contact` CRUD (intro, email mailto, github label/URL, LinkedIn/Facebook/WhatsApp/Telegram URLs) → Supabase `portfolio_settings.contact`. Terminal shows brand-colored pipe-separated socials. Landing SSR + search + AI sync. Migration `015_contact_content.sql`. |
| 2026-07-24 | **Message inbox:** Dashboard System → **Message** (above Settings) opens a second sidebar of senders (Settings-style slide). Threads at `/dashboard-araf/messages/[emailKey]`; Contact form → `contact_messages`. Migration `016_contact_messages.sql`. **Never** synced to AI knowledge (`AI_KNOWLEDGE_EXCLUDED_KEYS` + security policy). |
| 2026-07-24 | **AI chat + Gemini key:** Settings → **Gemini API key** stores keys in private `gemini_api_keys` (migration `018`; multi-key + active toggle). ChatPanel → `POST /api/chat`. Key/quota errors surface on settings; visitors get funny fallbacks. Never in `.env` or AI JSON. |
| 2026-07-24 | **Chat fully functional:** Portfolio system prompt + live `ai_knowledge`. Thread in localStorage (`portfolio-chat-session-v1`). Source Control lists `chat/thread` and can discard/clear it. |
| 2026-07-24 | **AI Chat inbox:** Dashboard System → **AI Chat** (between Message and Settings). Threads by visitor IP at `/dashboard-araf/ai-chats/[ipKey]`. `POST /api/chat` logs each user question to `ai_chat_messages` (service role). Migration `020_ai_chat_messages.sql`. **Never** synced to AI knowledge. |
| 2026-07-24 | **Gemini multi-active + failover:** Up to 5 keys Active at once; quota/invalid key auto-toggles off and chat tries the next active key. Migration `021_gemini_multi_active_keys.sql` drops one-active unique index. Chat token cuts: minified knowledge JSON, shorter system prompt, 6-turn / 1200-char history, `gemini-2.0-flash-lite` (+ flash fallback), maxOutputTokens 512. |
| 2026-07-24 | **Gemini In use checkbox:** Among active keys, one `is_current` (checkbox) picks which key chat uses first; green toggle = in use. Migration `022_gemini_in_use_key.sql`. |
| 2026-07-24 | **Dashboard thin scrollbars:** Scoped `.dashboard-shell` styles (plus Firefox `scrollbar-width: thin` on `.custom-scrollbar`) so textareas and all overflow areas use the same 4px dark thumb as the rest of the IDE. |
| 2026-07-24 | **Explorer Outline/Timeline SCM:** Panels stay in Explorer. Expanding them persists in localStorage and shows as Source Control changes (`explorer/outline`, `explorer/timeline`); discard collapses them. |
| 2026-08-26 | **Fix — Turbopack “Next.js package not found”:** Dev server FATAL panics after a partial `npm audit fix`. Cleared `.next` + reinstalled `node_modules`; set `turbopack.root` to project `__dirname` in `next.config.mjs` so Turbopack always resolves `next` from this app. |
| 2026-08-26 | **Dashboard UI → Extension defaults:** Settings `/dashboard-araf/settings/extension` auto-saves site-wide extension/UI defaults to Supabase `portfolio_settings.ui_extensions` (migration `023`). First visit + ThemeBoot + Source Control discard use those defaults (no hardcoded Cursor Dark as source of truth). Visitor localStorage overrides unchanged. Excluded from AI knowledge. |
| 2026-08-26 | **Dashboard Extension UX:** Full extension catalog (all marketplace extensions) with color swatches, font samples, and a live mini IDE preview of visitor first-paint. Wider settings page (`max-w-5xl`). |
| 2026-08-26 | **Dashboard theme lock:** Portfolio extension / site-default themes never restyle `/dashboard-araf`. Theme boot skips dashboard paths; `DashboardThemeLock` forces Cursor Dark tokens while in dashboard and restores portfolio theme on leave. |
| 2026-08-26 | **UI defaults revision wipe:** Saving changed Extension defaults bumps `ui_extensions.revision`. Visitors whose localStorage rev differs get extension prefs cleared and see the new site default; they can change UI again afterward. |
| 2026-08-26 | **Site default = SCM baseline:** Cursor Dark is no longer a hardcoded built-in. Dashboard-set theme is the baseline (“Site default”). Switching to Cursor Dark (or any other non-site theme) shows in Source Control; deactivate falls back to site default theme. |
| 2026-08-26 | **SCM theme switch:** Switching theme-A→theme-B only lists theme-B Activated (not theme-A Deactivated). |
| 2026-08-26 | **Dashboard Extension UX:** List+detail layout (one extension at a time), compact ash toggles matching About, fixed autosave double-click (no settings-page revalidate; ignore server props while dirty). |
| 2026-08-26 | **Dashboard Extension preview:** Live Animation shows real motion canvas behind Cursor Dark chrome; Mac uses wallpaper + glass; Terminal/Chat previews use real `contact-terminal` / `chat-panel` skin classes + live layers/canvas. |

