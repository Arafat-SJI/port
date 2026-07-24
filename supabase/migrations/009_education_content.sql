-- Seed Education section content in portfolio_settings.
-- Safe to re-run: does not overwrite an existing education row.

insert into public.portfolio_settings (key, value)
values (
  'education',
  $json${
    "title": "Education",
    "items": [
      {
        "id": "edu-buet",
        "degree": "B.Sc. in Computer Science & Engineering",
        "institution": "Bangladesh University of Engineering and Technology",
        "period": "2016 — 2020",
        "gpa": "3.85 / 4.00",
        "highlights": ["Dean's List", "Thesis: Distributed Caching for Edge Networks"],
        "visible": true
      },
      {
        "id": "edu-ndc",
        "degree": "Higher Secondary Certificate",
        "institution": "Notre Dame College, Dhaka",
        "period": "2014 — 2016",
        "gpa": "5.00 / 5.00",
        "highlights": ["Science Division", "National Math Olympiad — Regional Finalist"],
        "visible": true
      }
    ]
  }$json$::jsonb
)
on conflict (key) do nothing;
