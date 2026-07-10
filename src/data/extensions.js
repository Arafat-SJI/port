export const EXTENSIONS = [
  {
    id: "default-theme",
    name: "Cursor Dark",
    publisher: "arafat.workspace",
    tagline: "The default portfolio workspace theme.",
    description:
      "The built-in dark theme powering this portfolio IDE — soft blue accents, deep charcoal surfaces, and the same look you see on first load.",
    longDescription: `Cursor Dark is the native theme for arafat.workspace. It uses a carefully tuned palette with **#adc6ff** accent blue, layered surface containers, and subtle borders designed for long reading sessions.

This theme ships with the workspace and requires no installation. Activate it anytime to reset colors back to the original design.`,
    version: "1.0.0",
    icon: "dark_mode",
    iconColor: "#adc6ff",
    downloads: "Built-in",
    rating: 5,
    category: "Themes",
    identifier: "arafat.workspace.cursor-dark",
    published: "2024-01-01",
    builtin: true,
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

export function getExtensionById(id) {
  return EXTENSIONS.find((ext) => ext.id === id) ?? null;
}
