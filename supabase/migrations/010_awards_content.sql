-- Seed Awards section content in portfolio_settings.
-- Safe to re-run: does not overwrite an existing awards row.

insert into public.portfolio_settings (key, value)
values (
  'awards',
  $json${
    "title": "Awards",
    "items": [
      {
        "id": "award-nexus",
        "title": "Best Developer Tool",
        "issuer": "DevFest Bangladesh",
        "year": "2024",
        "description": "Recognized for Nexus IDE — an open-source AI-powered code editor.",
        "visible": true
      },
      {
        "id": "award-hackathon",
        "title": "1st Place — Hackathon",
        "issuer": "Google Developer Groups",
        "year": "2023",
        "description": "Built a real-time collaboration platform in 36 hours with a team of four.",
        "visible": true
      },
      {
        "id": "award-graduate",
        "title": "Outstanding Graduate",
        "issuer": "BUET CSE Department",
        "year": "2020",
        "description": "Awarded for academic excellence and contributions to the programming club.",
        "visible": true
      },
      {
        "id": "award-oss",
        "title": "Open Source Contributor",
        "issuer": "GitHub",
        "year": "2022",
        "description": "Arctic Vault contributor with 500+ merged PRs across ecosystem projects.",
        "visible": true
      }
    ]
  }$json$::jsonb
)
on conflict (key) do nothing;
