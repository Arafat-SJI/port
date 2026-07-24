-- Seed Contact section content in portfolio_settings.
-- Safe to re-run: does not overwrite an existing contact row.

insert into public.portfolio_settings (key, value)
values (
  'contact',
  $json${
    "intro": "Happy to connect — whether it's a project idea, a quick question, or just saying hello. Reach out anytime.",
    "email": "hello@arafat.workspace",
    "githubLabel": "github",
    "githubUrl": "",
    "socials": [
      { "id": "linkedin", "platform": "linkedin", "label": "linkedin", "url": "", "visible": true },
      { "id": "facebook", "platform": "facebook", "label": "facebook", "url": "", "visible": true },
      { "id": "whatsapp", "platform": "whatsapp", "label": "whatsapp", "url": "", "visible": true },
      { "id": "telegram", "platform": "telegram", "label": "telegram", "url": "", "visible": true }
    ]
  }$json$::jsonb
)
on conflict (key) do nothing;
