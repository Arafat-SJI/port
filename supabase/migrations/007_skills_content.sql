-- Seed Skills section content in portfolio_settings.
-- Safe to re-run: does not overwrite an existing skills row.

insert into public.portfolio_settings (key, value)
values (
  'skills',
  $json${
    "groups": [
      {
        "id": "skill-frontend",
        "title": "Frontend",
        "items": ["React", "Next.js", "Vue", "Tailwind"],
        "visible": true
      },
      {
        "id": "skill-backend",
        "title": "Backend",
        "items": ["Node.js", "Go", "PostgreSQL", "Redis"],
        "visible": true
      },
      {
        "id": "skill-ai",
        "title": "AI & Data",
        "items": ["OpenAI", "LangChain", "PyTorch"],
        "visible": true
      },
      {
        "id": "skill-cloud",
        "title": "Cloud",
        "items": ["AWS", "Docker", "K8s"],
        "visible": true
      }
    ]
  }$json$::jsonb
)
on conflict (key) do nothing;
