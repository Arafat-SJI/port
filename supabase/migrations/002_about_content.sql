-- Seed About section content in portfolio_settings (same table as section_order).
-- Safe to re-run: does not overwrite an existing about row.

insert into public.portfolio_settings (key, value)
values (
  'about',
  $json${
    "headlinePrefix": "Crafting digital ",
    "headlineHighlight": "intelligence",
    "headlineSuffix": " & architecture.",
    "intro": "I'm **Arafat**, a Software Engineer focused on building high-performance AI-driven experiences and scalable backend architectures.",
    "primaryCta": "View Projects",
    "secondaryCta": "Download CV",
    "summary": "Passionate about the intersection of human-computer interaction and machine intelligence. I specialize in building developer tools and complex dashboards that prioritize speed and developer experience. Currently exploring Large Language Model orchestrations.",
    "interests": ["Generative AI", "Distributed Systems", "Type Safety", "Open Source"]
  }$json$::jsonb
)
on conflict (key) do nothing;
