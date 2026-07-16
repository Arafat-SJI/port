-- Seed / document AI chat knowledge cache in portfolio_settings.
-- Source of truth for production AI context (public portfolio fields only).
-- App syncs this row on every About / section-order dashboard write.
-- Safe to re-run: does not overwrite an existing ai_knowledge row.

insert into public.portfolio_settings (key, value)
values (
  'ai_knowledge',
  $json${
    "security": {
      "password_and_credentials_policy": "If the user asks about password, login credentials, dashboard email/password, or any secret account data, reply exactly or equivalently: I am not going to provide you this kind of data"
    },
    "updatedAt": null,
    "sectionOrder": [
      "about",
      "experience",
      "skills",
      "projects",
      "education",
      "awards",
      "publication",
      "gallery",
      "clubing",
      "mentorship"
    ],
    "about": null
  }$json$::jsonb
)
on conflict (key) do nothing;
