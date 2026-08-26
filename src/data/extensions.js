export const EXTENSIONS = [
  {
    id: "default-theme",
    name: "Cursor Dark",
    publisher: "arafat.workspace",
    tagline: "The default portfolio workspace theme.",
    description:
      "The original dark theme for this portfolio IDE — soft blue accents, deep charcoal surfaces, and layered editor chrome.",
    longDescription: `Cursor Dark is the native theme for arafat.workspace. It uses a carefully tuned palette with **#adc6ff** accent blue, layered surface containers, and subtle borders designed for long reading sessions.

This theme ships with the workspace. Activate it anytime to use the original Cursor Dark palette — or set another theme as the site default from the dashboard.`,
    version: "1.0.0",
    icon: "dark_mode",
    iconColor: "#adc6ff",
    downloads: "Core",
    rating: 5,
    category: "Themes",
    identifier: "arafat.workspace.cursor-dark",
    published: "2024-01-01",
    features: [
      "Native portfolio color tokens",
      "Soft blue primary accent",
      "Optimized for IDE-style layout",
      "Zero configuration required",
    ],
    changelog: ["1.0.0 — Initial built-in release"],
  },
  {
    id: "typograph",
    name: "Typograph",
    publisher: "arafat.workspace",
    tagline: "Professional font switching for UI and code.",
    description:
      "Change the typeface across the entire workspace — UI labels, headings, and editor content.",
    longDescription: `Typograph lets you preview and apply different font personalities without leaving the IDE.

Choose from **Inter** (default), **System UI**, **Georgia Serif**, or a full **Mono UI** experience. Changes apply workspace-wide and persist across sessions once activated.`,
    version: "1.2.0",
    icon: "text_fields",
    iconColor: "#98c379",
    downloads: "12.4K",
    rating: 5,
    category: "Other",
    identifier: "arafat.workspace.typograph",
    published: "2024-06-12",
    features: [
      "4 font packs included",
      "Live preview before activation",
      "Separate UI and code font stacks",
      "Persists across reloads",
    ],
    changelog: [
      "1.2.0 — Added Mono UI pack",
      "1.1.0 — System UI support",
      "1.0.0 — Initial release",
    ],
  },
  {
    id: "theme-pack",
    name: "Theme Studio",
    publisher: "VS Code Themes",
    tagline: "A collection of popular editor color themes.",
    description:
      "Six hand-picked dark themes — Cursor Dark, One Dark Pro, Dracula, GitHub Dark, Nord, and Monokai.",
    longDescription: `Theme Studio bundles the most loved VS Code dark themes into one extension. Pick a theme from the gallery below, then **Activate** to apply it across the workspace.

The default **Cursor Dark** palette is listed first so you can always return to the familiar look.`,
    version: "2.4.1",
    icon: "palette",
    iconColor: "#bd93f9",
    downloads: "8.1M",
    rating: 5,
    category: "Themes",
    identifier: "vscode-themes.theme-studio",
    published: "2023-03-08",
    features: [
      "6 curated dark themes",
      "One-click theme preview swatches",
      "Cursor Dark included as default",
      "Sidebar and tab colors synced",
    ],
    changelog: [
      "2.4.1 — Added Monokai",
      "2.3.0 — Nord theme",
      "2.0.0 — GitHub Dark & Dracula",
      "1.0.0 — One Dark Pro",
    ],
  },
  {
    id: "macintosh-theme",
    name: "Aqua Desktop",
    publisher: "Macintosh Labs",
    tagline: "macOS Sonoma dark mode for your workspace.",
    description:
      "System blues, green accents, frosted vibrancy, and a Sonoma mesh wallpaper background.",
    longDescription: `Aqua Desktop transforms arafat.workspace into a Macintosh-inspired environment.

Expect **#0A84FF** system blue, Finder-style sidebar selections, translucent panels, and an animated Sonoma gradient wallpaper behind the window.`,
    version: "3.1.0",
    icon: "laptop_mac",
    iconColor: "#0a84ff",
    downloads: "2.3K",
    rating: 5,
    category: "Themes",
    identifier: "macintosh-labs.aqua-desktop",
    published: "2024-09-26",
    features: [
      "4 macOS theme variants",
      "Sonoma, Monterey, Sequoia & Aqua Classic",
      "Frosted glass panel vibrancy",
      "Animated mesh wallpapers per variant",
    ],
    changelog: [
      "3.2.0 — Added 4 macOS theme variants",
      "3.1.0 — Sonoma wallpaper refresh",
      "3.0.0 — Vibrancy glass panels",
      "2.0.0 — System blue palette",
    ],
  },
  {
    id: "live-animation",
    name: "Live Animation Theme",
    publisher: "arafat.workspace",
    tagline: "Soft living motion for your workspace background.",
    description:
      "Five smooth ambient animations — aurora, particles, waves, orbits, and constellation — that drift quietly behind the IDE.",
    longDescription: `Live Animation Theme adds a calm, motion-driven backdrop without changing your editor colors.

Pick an animation from the gallery, and it will **activate instantly** and keep running behind the panels. Animations are lightweight canvas loops tuned for smooth idle motion.`,
    version: "1.0.0",
    icon: "animation",
    iconColor: "#7dd3fc",
    downloads: "1.8K",
    rating: 5,
    category: "Themes",
    identifier: "arafat.workspace.live-animation",
    published: "2025-07-11",
    features: [
      "5 live ambient animations",
      "Aurora, Particles, Waves, Orbits, Constellation",
      "Keeps default IDE color tokens",
      "One-click activate from the gallery",
    ],
    changelog: ["1.0.0 — Initial release with 5 animations"],
  },
  {
    id: "terminal-theme",
    name: "Terminal Skins",
    publisher: "arafat.workspace",
    tagline: "Dedicated looks for the Let's Connect terminal.",
    description:
      "Six terminal-only skins — three static palettes and three live motion themes — without changing the rest of the IDE.",
    longDescription: `Terminal Skins restyles only the contact terminal panel.

Choose a **static** look for solid color polish, or a **live** theme for soft motion inside the terminal chrome. Activating an option applies instantly and leaves other extensions untouched.`,
    version: "1.0.0",
    icon: "terminal",
    iconColor: "#4edea3",
    downloads: "920",
    rating: 5,
    category: "Themes",
    identifier: "arafat.workspace.terminal-skins",
    published: "2025-07-11",
    features: [
      "3 static terminal palettes",
      "3 live terminal motion themes",
      "Scoped to Let's Connect only",
      "One-click activate from the gallery",
    ],
    changelog: ["1.0.0 — Initial release"],
  },
  {
    id: "chat-theme",
    name: "Chat Skins",
    publisher: "arafat.workspace",
    tagline: "Dedicated looks for the AI chat sidebar.",
    description:
      "Six chat-only skins — three static palettes and three live motion themes — scoped to the right sidebar.",
    longDescription: `Chat Skins restyles only the AI chat panel.

Pick a **static** palette or a **live** motion theme. Options activate instantly and do not alter the editor, explorer, or terminal.`,
    version: "1.0.0",
    icon: "forum",
    iconColor: "#c4b5fd",
    downloads: "870",
    rating: 5,
    category: "Themes",
    identifier: "arafat.workspace.chat-skins",
    published: "2025-07-11",
    features: [
      "3 static chat palettes",
      "3 live chat motion themes",
      "Scoped to the AI sidebar only",
      "One-click activate from the gallery",
    ],
    changelog: ["1.0.0 — Initial release"],
  },
];

export const FONT_PACK_OPTIONS = [
  { value: "inter", label: "Inter", description: "Clean sans-serif — default" },
  { value: "system", label: "System UI", description: "Native OS font stack" },
  { value: "georgia", label: "Georgia Serif", description: "Classic editorial serif" },
  { value: "mono-ui", label: "Mono UI", description: "JetBrains Mono everywhere" },
];

export const THEME_PACK_OPTIONS = [
  { value: "default", label: "Cursor Dark", swatch: ["#121317", "#adc6ff", "#1a1b20"] },
  { value: "one-dark", label: "One Dark Pro", swatch: ["#282c34", "#61afef", "#21252b"] },
  { value: "dracula", label: "Dracula", swatch: ["#282a36", "#bd93f9", "#44475a"] },
  { value: "github-dark", label: "GitHub Dark", swatch: ["#0d1117", "#58a6ff", "#161b22"] },
  { value: "nord", label: "Nord", swatch: ["#2e3440", "#88c0d0", "#3b4252"] },
  { value: "monokai", label: "Monokai", swatch: ["#272822", "#f92672", "#3e3d32"] },
];

export const MAC_THEME_VARIANTS = [
  {
    value: "sonoma",
    label: "Sonoma Dark",
    description: "Purple & blue mesh — system blue accents",
    swatch: ["#1c1c1e", "#0a84ff", "#3d2a5c"],
    wallpaper: "linear-gradient(135deg, #3d2a5c 0%, #1a4a8a 45%, #8b3a62 100%)",
  },
  {
    value: "monterey",
    label: "Monterey Night",
    description: "Cool slate blues with teal undertones",
    swatch: ["#1a2332", "#409cff", "#243044"],
    wallpaper: "linear-gradient(145deg, #0f1c2e 0%, #1a3a5c 50%, #0d2840 100%)",
  },
  {
    value: "sequoia",
    label: "Sequoia Dusk",
    description: "Warm earth tones and golden highlights",
    swatch: ["#2a2420", "#ff9f0a", "#4a3528"],
    wallpaper: "linear-gradient(135deg, #3d2a1a 0%, #5c3a20 40%, #2a1a30 100%)",
  },
  {
    value: "aqua-classic",
    label: "Aqua Classic",
    description: "Classic graphite with silver titlebar feel",
    swatch: ["#2d2d2d", "#0066cc", "#c8c8c8"],
    wallpaper: "linear-gradient(180deg, #e8e8ec 0%, #b8b8be 45%, #9898a0 100%)",
  },
];

export const LIVE_ANIMATION_OPTIONS = [
  {
    value: "aurora",
    label: "Aurora Drift",
    description: "Soft northern-light ribbons across a deep sky",
    swatch: ["#0b1220", "#38bdf8", "#a78bfa"],
  },
  {
    value: "particles",
    label: "Floating Particles",
    description: "Gentle sparks floating through dark space",
    swatch: ["#0c0f14", "#adc6ff", "#4edea3"],
  },
  {
    value: "waves",
    label: "Silk Waves",
    description: "Slow layered sine waves with cool tones",
    swatch: ["#10141c", "#60a5fa", "#34d399"],
  },
  {
    value: "orbits",
    label: "Orbital Glow",
    description: "Large blurred orbs orbiting in soft haze",
    swatch: ["#0e1016", "#c4b5fd", "#67e8f9"],
  },
  {
    value: "constellation",
    label: "Constellation",
    description: "Stars linked by faint drifting filaments",
    swatch: ["#080a10", "#e2e8f0", "#7dd3fc"],
  },
];

export const TERMINAL_THEME_OPTIONS = [
  {
    value: "slate",
    label: "Slate Console",
    description: "Cool steel blues — static",
    kind: "static",
    swatch: ["#12161e", "#8ba3c7", "#1c2430"],
  },
  {
    value: "ember",
    label: "Ember Shell",
    description: "Warm amber terminal glow — static",
    kind: "static",
    swatch: ["#1a120e", "#f0a46a", "#2a1a14"],
  },
  {
    value: "moss",
    label: "Moss Prompt",
    description: "Muted forest greens — static",
    kind: "static",
    swatch: ["#101612", "#7dba8a", "#1a241c"],
  },
  {
    value: "pulse",
    label: "Floating Particles",
    description: "Soft particles drifting upward — live",
    kind: "live",
    swatch: ["#121417", "#9aa3ad", "#2a2e34"],
  },
  {
    value: "scan",
    label: "Constellation",
    description: "Linked points with a quiet drift — live",
    kind: "live",
    swatch: ["#111315", "#a8b0b8", "#262a2e"],
  },
  {
    value: "neon-wave",
    label: "Star Twinkle",
    description: "Minimal twinkling points — live",
    kind: "live",
    swatch: ["#131518", "#8b93a0", "#2c3036"],
  },
];

export const CHAT_THEME_OPTIONS = [
  {
    value: "midnight",
    label: "Midnight Ask",
    description: "Deep navy chat panel — static",
    kind: "static",
    swatch: ["#0f1420", "#93c5fd", "#1e293b"],
  },
  {
    value: "violet",
    label: "Violet Thread",
    description: "Soft purple conversation — static",
    kind: "static",
    swatch: ["#15121c", "#c4b5fd", "#2e2440"],
  },
  {
    value: "sand",
    label: "Sand Desk",
    description: "Warm neutral chat tones — static",
    kind: "static",
    swatch: ["#17140f", "#d6b891", "#2a241c"],
  },
  {
    value: "shimmer",
    label: "Shimmer Fog",
    description: "Gentle shimmering haze — live",
    kind: "live",
    swatch: ["#10141c", "#a5b4fc", "#312e81"],
  },
  {
    value: "ripple",
    label: "Soft Ripple",
    description: "Expanding soft ripples — live",
    kind: "live",
    swatch: ["#0f1614", "#6ee7b7", "#134e4a"],
  },
  {
    value: "spark",
    label: "Spark Trail",
    description: "Tiny drifting sparks — live",
    kind: "live",
    swatch: ["#141018", "#f9a8d4", "#701a75"],
  },
];

export function getExtensionById(id) {
  return EXTENSIONS.find((ext) => ext.id === id) ?? null;
}

/** Themes that ship pre-installed for visitors (all marketplace themes). */
export const DEFAULT_INSTALLED_EXTENSION_IDS = EXTENSIONS.filter(
  (ext) => ext.id !== "default-theme"
).map((ext) => ext.id);
