-- Seed Mentorship section content in portfolio_settings.
-- Safe to re-run: does not overwrite an existing mentorship row.

insert into public.portfolio_settings (key, value)
values (
  'mentorship',
  $json${
    "title": "Mentorship",
    "stats": {
      "mentees": "8+",
      "programs": "3",
      "active": "4yr"
    },
    "items": [
      {
        "id": "mentor-gsoc",
        "program": "Google Summer of Code",
        "role": "Mentor",
        "period": "2023 — Present",
        "mentees": "6",
        "topics": ["Open Source", "Distributed Systems", "Documentation"],
        "description": "Guide students through 12-week coding projects with weekly syncs, code reviews, and milestone planning.",
        "visible": true
      },
      {
        "id": "mentor-outreachy",
        "program": "Outreachy",
        "role": "Mentor",
        "period": "2022 — 2023",
        "mentees": "2",
        "topics": ["Frontend", "Accessibility", "React"],
        "description": "Supported interns building accessible UI components and contributing to production codebases.",
        "visible": true
      },
      {
        "id": "mentor-career",
        "program": "University Career Workshops",
        "role": "Guest Speaker",
        "period": "2021 — Present",
        "mentees": "120+",
        "topics": ["Interview Prep", "System Design", "Career Growth"],
        "description": "Conduct sessions on technical interviews, resume building, and navigating early-career engineering roles.",
        "visible": true
      }
    ]
  }$json$::jsonb
)
on conflict (key) do nothing;
