-- Seed Experience section content in portfolio_settings.
-- Safe to re-run: does not overwrite an existing experience row.

insert into public.portfolio_settings (key, value)
values (
  'experience',
  $json${
    "items": [
      {
        "id": "exp-sj-innovation",
        "company": "SJ Innovation",
        "companyUrl": "",
        "role": "Jr. Software Engineer (On-site)",
        "employmentType": "Full-time",
        "startDate": "June 25, 2024",
        "endDate": "Present",
        "current": true,
        "location": "Dhaka, Bangladesh",
        "bullets": [
          "Collaborated on the \"CollabAI\" project as a key team member. Integrated important features such as WorkBoard, Google SSO, Domain control, and more for enhanced functionality.",
          "Worked on multiple DXP and CMS projects with WordPress, Contentful, Contentstack, focused on optimizing performance, scalability, and user engagement.",
          "Conducted book reading sessions to encourage knowledge sharing and collaboration among team members."
        ]
      }
    ]
  }$json$::jsonb
)
on conflict (key) do nothing;
