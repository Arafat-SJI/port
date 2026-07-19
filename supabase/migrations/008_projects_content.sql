-- Seed Projects section content in portfolio_settings.
-- Safe to re-run: does not overwrite an existing projects row.

insert into public.portfolio_settings (key, value)
values (
  'projects',
  $json${
    "subtitle": "Tools and platforms engineered for scale.",
    "items": [
      {
        "id": "proj-nexus-ide",
        "title": "Nexus IDE",
        "description": "An AI-first code editor built for the web with real-time collaborative features and integrated LLM code generation.",
        "tags": ["React", "Next.js", "TypeScript"],
        "liveUrl": "",
        "codeUrl": "",
        "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuDGuYpex1AaA1tpiolhBgalyVsUkE5bQ6RAi28cqU2s5W-NvLolh2WOnhsMzZX7XXSfDbfFjzBn2UZwu5hzCDkU_SNKMMnljWhYvf0bguI8a999zYx8Lv9mDUVlVRiZ7gPnyvX-8oY6hBK9QuVGWMUGywG8any5gXmsIFcmUoDVaYvQW2TK_STVndixa9DlzvI4VlgYBs1yvkL-0kdMwEUvpWUdQ81-V1KYJBmqQ7OM5Bq3fXJoKsNoxp7bRK9gpjUd4jKX0GfLvAk",
        "imageAlt": "A sleek dark-themed interface of a code editor, featuring sophisticated syntax highlighting in blues and teals.",
        "visible": true
      },
      {
        "id": "proj-linear-clone",
        "title": "Linear Clone",
        "description": "A high-performance project management tool focused on keyboard-first navigation and extreme UI responsiveness.",
        "tags": ["Rust", "Wasm", "PostgreSQL"],
        "liveUrl": "",
        "codeUrl": "",
        "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuBzAdWw8w4WeYUFLyG1hKC_HyYjqN07r2fYLlsDjY7yDWxupaKUSPTHj_PX75goZkVek6SRxkRkOuHnrhTopnW_G13xBq4g1uHMMRIlXvdLXDaKxjf1Zts-N7QbBOt4FTGX7e0JMl9h70XpJjecuoZMTpJD2ZPpLKiZGHKOhejEcZImTJr9akNt70OtmyxaIFHSQAvGlUqewe7XApbvOZFoXAxTXkD9l_umG0r0dh29ONGGfJIVlbeD3l5aF6o783vyEIToVUZF5P0",
        "imageAlt": "A sophisticated project management dashboard layout featuring task cards, progress bars, and team avatars.",
        "visible": true
      },
      {
        "id": "proj-pulse-analytics",
        "title": "Pulse Analytics",
        "description": "Real-time observability dashboard for microservices with custom alerting pipelines and anomaly detection.",
        "tags": ["Go", "Grafana", "Kafka"],
        "liveUrl": "",
        "codeUrl": "",
        "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuDGuYpex1AaA1tpiolhBgalyVsUkE5bQ6RAi28cqU2s5W-NvLolh2WOnhsMzZX7XXSfDbfFjzBn2UZwu5hzCDkU_SNKMMnljWhYvf0bguI8a999zYx8Lv9mDUVlVRiZ7gPnyvX-8oY6hBK9QuVGWMUGywG8any5gXmsIFcmUoDVaYvQW2TK_STVndixa9DlzvI4VlgYBs1yvkL-0kdMwEUvpWUdQ81-V1KYJBmqQ7OM5Bq3fXJoKsNoxp7bRK9gpjUd4jKX0GfLvAk",
        "imageAlt": "Analytics dashboard with charts and metrics on a dark interface.",
        "visible": true
      },
      {
        "id": "proj-devkit-cli",
        "title": "DevKit CLI",
        "description": "Command-line toolkit for scaffolding monorepos, running health checks, and automating release workflows.",
        "tags": ["Node.js", "CLI", "Docker"],
        "liveUrl": "",
        "codeUrl": "",
        "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuBzAdWw8w4WeYUFLyG1hKC_HyYjqN07r2fYLlsDjY7yDWxupaKUSPTHj_PX75goZkVek6SRxkRkOuHnrhTopnW_G13xBq4g1uHMMRIlXvdLXDaKxjf1Zts-N7QbBOt4FTGX7e0JMl9h70XpJjecuoZMTpJD2ZPpLKiZGHKOhejEcZImTJr9akNt70OtmyxaIFHSQAvGlUqewe7XApbvOZFoXAxTXkD9l_umG0r0dh29ONGGfJIVlbeD3l5aF6o783vyEIToVUZF5P0",
        "imageAlt": "Terminal window showing CLI commands and output.",
        "visible": true
      }
    ]
  }$json$::jsonb
)
on conflict (key) do nothing;
