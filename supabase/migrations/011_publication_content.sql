-- Seed Publication section content in portfolio_settings.
-- Safe to re-run: does not overwrite an existing publication row.

insert into public.portfolio_settings (key, value)
values (
  'publication',
  $json${
    "title": "Publication",
    "items": [
      {
        "id": "pub-cold-starts",
        "title": "Optimizing Cold Starts in Serverless Edge Runtimes",
        "authors": "A. Rahman, J. Chen, M. Patel",
        "venue": "IEEE Cloud Computing",
        "year": "2024",
        "type": "Journal",
        "link": "",
        "visible": true
      },
      {
        "id": "pub-llm-orchestration",
        "title": "A Survey of LLM Orchestration Patterns for Developer Tools",
        "authors": "A. Rahman, S. Kim",
        "venue": "ACM SIGSOFT FSE Companion",
        "year": "2023",
        "type": "Conference",
        "link": "",
        "visible": true
      },
      {
        "id": "pub-payment-gateways",
        "title": "Building Resilient Payment Gateways at Scale",
        "authors": "A. Rahman",
        "venue": "Medium Engineering Blog",
        "year": "2022",
        "type": "Article",
        "link": "",
        "visible": true
      }
    ]
  }$json$::jsonb
)
on conflict (key) do nothing;
