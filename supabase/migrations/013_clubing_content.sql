-- Seed Clubing section content in portfolio_settings.
-- Safe to re-run: does not overwrite an existing clubing row.

insert into public.portfolio_settings (key, value)
values (
  'clubing',
  $json${
    "title": "Clubing",
    "items": [
      {
        "id": "club-buetpc",
        "name": "Buet Programming Club",
        "role": "President",
        "period": "2018 — 2020",
        "description": "Led 200+ member community. Organized weekly contests, ICPC training camps, and annual intra-university hackathons.",
        "visible": true
      },
      {
        "id": "club-gdsc",
        "name": "Google Developer Student Clubs",
        "role": "Core Organizer",
        "period": "2019 — 2020",
        "description": "Hosted study jams on Android, Cloud, and ML. Mentored 50+ students through their first open-source contributions.",
        "visible": true
      },
      {
        "id": "club-ieee",
        "name": "IEEE Computer Society — BUET",
        "role": "Technical Lead",
        "period": "2017 — 2019",
        "description": "Coordinated technical workshops on web development, competitive programming, and system design fundamentals.",
        "visible": true
      },
      {
        "id": "club-oss",
        "name": "Open Source Collective",
        "role": "Contributor",
        "period": "2021 — Present",
        "description": "Active maintainer across React ecosystem packages. Reviews PRs and triages issues for downstream dependents.",
        "visible": true
      }
    ]
  }$json$::jsonb
)
on conflict (key) do nothing;
