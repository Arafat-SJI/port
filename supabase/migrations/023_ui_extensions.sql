-- Site-wide default UI / extension state (dashboard Settings → UI → Extension).
-- Safe to re-run: does not overwrite an existing ui_extensions row.
-- Never included in ai_knowledge.

insert into public.portfolio_settings (key, value)
values (
  'ui_extensions',
  $json${
    "installed": [
      "typograph",
      "theme-pack",
      "macintosh-theme",
      "live-animation",
      "terminal-theme",
      "chat-theme"
    ],
    "activeTypography": false,
    "activeThemeSource": "default",
    "packTheme": "default",
    "fontPack": "inter",
    "macVariant": "sonoma",
    "macTrafficLights": true,
    "liveAnimation": "aurora",
    "activeTerminalTheme": false,
    "terminalTheme": "slate",
    "activeChatTheme": false,
    "chatTheme": "midnight",
    "revision": "2026-08-26T00:00:00.000Z"
  }$json$::jsonb
)
on conflict (key) do nothing;
