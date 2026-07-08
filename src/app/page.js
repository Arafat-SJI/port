"use client";

import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { href: "#about", label: "About.tsx", icon: "description" },
  { href: "#experience", label: "Experience.json", icon: "data_object" },
  { href: "#projects", label: "Projects.py", icon: "terminal" },
  { href: "#skills", label: "Skills.ts", icon: "settings_ethernet" },
  { href: "#achievements", label: "Awards.md", icon: "workspace_premium" },
  { href: "#contact", label: "Contact.css", icon: "mail" },
];

const OPEN_TABS = [
  { href: "#about", label: "About.tsx", icon: "description", color: "text-primary" },
  { href: "#projects", label: "Projects.py", icon: "terminal", color: "text-secondary" },
  {
    href: "#experience",
    label: "Experience.json",
    icon: "data_object",
    color: "text-tertiary",
  },
  { href: "#contact", label: "Contact.css", icon: "mail", color: "text-primary" },
];

const PROJECTS = [
  {
    title: "Nexus IDE",
    description:
      "An AI-first code editor built for the web with real-time collaborative features and integrated LLM code generation.",
    tags: ["React", "Next.js", "TypeScript"],
    links: ["link", "code"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGuYpex1AaA1tpiolhBgalyVsUkE5bQ6RAi28cqU2s5W-NvLolh2WOnhsMzZX7XXSfDbfFjzBn2UZwu5hzCDkU_SNKMMnljWhYvf0bguI8a999zYx8Lv9mDUVlVRiZ7gPnyvX-8oY6hBK9QuVGWMUGywG8any5gXmsIFcmUoDVaYvQW2TK_STVndixa9DlzvI4VlgYBs1yvkL-0kdMwEUvpWUdQ81-V1KYJBmqQ7OM5Bq3fXJoKsNoxp7bRK9gpjUd4jKX0GfLvAk",
    alt: "A sleek dark-themed interface of a code editor, featuring sophisticated syntax highlighting in blues and teals.",
  },
  {
    title: "Linear Clone",
    description:
      "A high-performance project management tool focused on keyboard-first navigation and extreme UI responsiveness.",
    tags: ["Rust", "Wasm", "PostgreSQL"],
    links: ["link"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzAdWw8w4WeYUFLyG1hKC_HyYjqN07r2fYLlsDjY7yDWxupaKUSPTHj_PX75goZkVek6SRxkRkOuHnrhTopnW_G13xBq4g1uHMMRIlXvdLXDaKxjf1Zts-N7QbBOt4FTGX7e0JMl9h70XpJjecuoZMTpJD2ZPpLKiZGHKOhejEcZImTJr9akNt70OtmyxaIFHSQAvGlUqewe7XApbvOZFoXAxTXkD9l_umG0r0dh29ONGGfJIVlbeD3l5aF6o783vyEIToVUZF5P0",
    alt: "A sophisticated project management dashboard layout featuring task cards, progress bars, and team avatars.",
  },
];

const EXPERIENCE = [
  {
    role: "Senior Developer",
    company: "Vercel",
    period: "2022 — Present",
    current: true,
    description:
      "Leading the edge runtime infrastructure team. Optimized cold boot times by 40% and implemented global cache invalidation protocols.",
  },
  {
    role: "Fullstack Developer",
    company: "Stripe",
    period: "2020 — 2022",
    current: false,
    description:
      "Worked on the Billing API team. Architected high-availability payment gateways processing millions of transactions daily.",
  },
];

const SKILLS = [
  { title: "Frontend", items: ["React", "Next.js", "Vue", "Tailwind"] },
  { title: "Backend", items: ["Node.js", "Go", "PostgreSQL", "Redis"] },
  { title: "AI & Data", items: ["OpenAI", "LangChain", "PyTorch"] },
  { title: "Cloud", items: ["AWS", "Docker", "K8s"] },
];

const TERMINAL_MESSAGES = [
  "> npm run build... success",
  "> git status... 2 modified",
  "> indexing local files...",
  "> v8 engine... optimal",
];

function ShaderBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float noise = sin(uv.x * 10.0 + u_time * 0.5) * cos(uv.y * 10.0 + u_time * 0.5);
    vec3 color = vec3(0.04, 0.05, 0.08);
    color += vec3(0.02, 0.03, 0.06) * noise * 0.2;

    float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv - 0.5));
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
}`;

    function cs(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const onMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    let raf;
    function render(t) {
      if (typeof ResizeObserver === "undefined") syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    }
    render(0);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
      <div className="absolute inset-0 w-full h-full" style={{ display: "block" }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
          width={1280}
          height={1024}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const mainRef = useRef(null);
  const [activeHref, setActiveHref] = useState("#about");
  const [terminalMsg, setTerminalMsg] = useState(TERMINAL_MESSAGES[1]);

  const activeNav =
    NAV_ITEMS.find((item) => item.href === activeHref) ?? NAV_ITEMS[0];

  useEffect(() => {
    let current = 1;
    const interval = setInterval(() => {
      current = (current + 1) % TERMINAL_MESSAGES.length;
      setTerminalMsg(TERMINAL_MESSAGES[current]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target && mainRef.current) {
      mainRef.current.scrollTo({
        top: target.offsetTop - 60,
        behavior: "smooth",
      });
      setActiveHref(href);
    }
  };

  return (
    <>
      <ShaderBackground />

      {/* Title Bar */}
      <header className="flex justify-between items-center w-full px-3 z-50 bg-surface-container-lowest backdrop-blur-md border-b border-outline-variant fixed top-0 h-6">
        <div className="flex items-center gap-3 h-full">
          <div className="flex gap-1.5 px-1">
            <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f56]" />
            <div className="w-[10px] h-[10px] rounded-full bg-[#ffbd2e]" />
            <div className="w-[10px] h-[10px] rounded-full bg-[#27c93f]" />
          </div>
          <div className="hidden md:flex items-center gap-0.5 text-on-surface-variant">
            <button className="material-symbols-outlined text-[14px] hover:text-on-surface disabled:opacity-30 transition-colors">
              chevron_left
            </button>
            <button className="material-symbols-outlined text-[14px] hover:text-on-surface transition-colors">
              chevron_right
            </button>
          </div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-[11px] text-on-surface-variant">
          <span className="material-symbols-outlined text-[13px] text-primary">
            developer_board
          </span>
          <span className="text-on-surface">portfolio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-surface-container-high transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[12px] text-on-surface-variant">
              account_tree
            </span>
            <span className="text-[10px] text-on-surface-variant">main*</span>
          </div>
        </div>
      </header>

      <div className="flex h-screen pb-8 pt-6">
        {/* Side Navigation */}
        <aside className="flex flex-col w-[280px] bg-surface-container-lowest border-r border-outline-variant z-40 shrink-0">
          <div className="flex items-center justify-between px-4 py-2 border-b border-outline-variant/30">
            <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">keyboard_arrow_down</span>{" "}
              EXPLORER
            </span>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
              more_horiz
            </span>
          </div>
          <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
            <div className="px-4 py-1 flex items-center gap-1 text-[10px] font-bold text-on-surface-variant opacity-60 uppercase">
              PORTFOLIO
            </div>
            <div className="space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`flex items-center gap-2 px-4 py-1 text-[12px] transition-all ${
                    activeHref === item.href
                      ? "active-tab text-primary"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{item.icon}</span>{" "}
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
          <div className="mt-auto border-t border-outline-variant/30 p-2">
            <div className="flex items-center justify-around">
              <button className="material-symbols-outlined text-on-surface-variant hover:text-primary text-[18px]">
                settings
              </button>
              <button className="material-symbols-outlined text-on-surface-variant hover:text-primary text-[18px]">
                account_circle
              </button>
              <button className="material-symbols-outlined text-on-surface-variant hover:text-primary text-[18px]">
                extension
              </button>
            </div>
          </div>
        </aside>

        {/* Editor Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor Tab Strip */}
          <div className="flex items-stretch h-7 bg-surface-container-lowest border-b border-outline-variant shrink-0 overflow-x-auto custom-scrollbar">
            {OPEN_TABS.map((tab) => {
              const isActive = activeHref === tab.href;
              return (
                <button
                  key={tab.href}
                  onClick={(e) => handleNavClick(e, tab.href)}
                  className={`group relative flex items-center gap-1.5 pl-3 pr-2 text-[12px] border-r border-outline-variant/30 whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-background text-on-surface"
                      : "text-on-surface-variant/70 hover:bg-surface-container-low hover:text-on-surface-variant"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-x-0 top-0 h-[2px] bg-primary" />
                  )}
                  <span
                    className={`material-symbols-outlined ${
                      isActive ? tab.color : "opacity-60"
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
       
                  <span
                    className={`material-symbols-outlined ml-0.5 rounded-sm p-0.5 hover:bg-surface-container-highest transition-opacity ${
                      isActive ? "opacity-70" : "opacity-0 group-hover:opacity-70"
                    }`}
                  >
                    close
                  </span>
             
                </button>
              );
            })}

          </div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 px-4 h-6 text-[11px] text-on-surface-variant bg-background/50 border-b border-outline-variant/30 shrink-0">
            <span className="material-symbols-outlined text-[13px] opacity-60">folder</span>
            <span className="opacity-70">portfolio</span>
            <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
            <span className="opacity-70">src</span>
            <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
            <span className="flex items-center gap-1 text-on-surface">
              <span className="material-symbols-outlined text-[13px] text-primary">
                {activeNav.icon}
              </span>
              {activeNav.label}
            </span>
          </div>
          {/* Main Content Area */}
          <main ref={mainRef} className="flex-1 overflow-y-auto custom-scrollbar relative">
            <div className="max-w-[900px] mx-auto px-8 py-12 space-y-24">
            {/* Hero Section */}
            <section className="pt-12 text-center md:text-left" id="hero">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/50">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="font-label-mono text-[10px] text-secondary tracking-widest uppercase">
                      Available for Hire
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight leading-none">
                    Crafting digital <span className="text-primary">intelligence</span> &amp;
                    architecture.
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                    I&apos;m <span className="text-on-surface font-semibold">Arafat</span>, a
                    Software Engineer focused on building high-performance AI-driven experiences
                    and scalable backend architectures.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                    <button className="px-8 py-3 bg-primary text-on-primary font-semibold rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/10">
                      View Projects
                    </button>
                    <button className="px-8 py-3 bg-surface-container-low border border-outline-variant text-on-surface font-semibold rounded-lg hover:bg-surface-container-highest transition-all">
                      Download CV
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Bento About */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4" id="about">
              <div className="md:col-span-2 p-8 bg-surface-container-low border border-outline-variant rounded-xl group hover:border-primary/50 transition-colors">
                <h3 className="font-headline-md text-lg text-on-surface mb-4">Summary</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Passionate about the intersection of human-computer interaction and machine
                  intelligence. I specialize in building developer tools and complex dashboards
                  that prioritize speed and developer experience. Currently exploring Large
                  Language Model orchestrations.
                </p>
              </div>
              <div className="p-8 bg-surface-container-low border border-outline-variant rounded-xl group hover:border-primary/50 transition-colors">
                <h3 className="font-headline-md text-lg text-on-surface mb-4">Interests</h3>
                <ul className="space-y-2 text-on-surface-variant font-label-mono text-xs">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">▹</span> Generative AI
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">▹</span> Distributed Systems
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">▹</span> Type Safety
                  </li>
                </ul>
              </div>
            </section>

            {/* Projects Grid */}
            <section className="space-y-8" id="projects">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    Selected Projects
                  </h2>
                  <p className="text-on-surface-variant">
                    Tools and platforms engineered for scale.
                  </p>
                </div>
                <a
                  className="text-primary text-sm font-label-mono hover:underline"
                  href="#projects"
                >
                  view_all_src
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROJECTS.map((project) => (
                  <div
                    key={project.title}
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden group hover:border-primary transition-all"
                  >
                    <div className="h-48 relative overflow-hidden bg-surface-container-highest">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                        alt={project.alt}
                        src={project.image}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest to-transparent" />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline-md text-lg text-on-surface">
                          {project.title}
                        </h3>
                        <div className="flex gap-2">
                          {project.links.map((link) => (
                            <span
                              key={link}
                              className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer"
                            >
                              {link}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-on-surface-variant text-sm line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-surface-container-highest text-[10px] text-primary font-label-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Experience Timeline */}
            <section className="space-y-8" id="experience">
              <h2 className="font-headline-md text-headline-md text-on-surface">Experience</h2>
              <div className="relative border-l border-outline-variant ml-4 space-y-12 pb-4">
                {EXPERIENCE.map((exp) => (
                  <div key={exp.company} className="relative pl-8">
                    <div
                      className={`absolute left-[-9px] top-1.5 w-4 h-4 rounded-full border-4 border-background ${
                        exp.current ? "bg-primary" : "bg-outline-variant"
                      }`}
                    />
                    <div
                      className={`bg-surface-container-low border border-outline-variant p-6 rounded-xl ${
                        exp.current
                          ? ""
                          : "opacity-80 hover:opacity-100 transition-opacity"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-on-surface">{exp.role}</h4>
                        <span
                          className={`font-label-mono text-[10px] uppercase px-2 py-1 rounded ${
                            exp.current
                              ? "text-primary bg-primary/10"
                              : "text-on-surface-variant bg-surface-container-highest"
                          }`}
                        >
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-secondary mb-3">{exp.company}</p>
                      <p className="text-on-surface-variant text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section className="space-y-8" id="skills">
              <h2 className="font-headline-md text-headline-md text-on-surface">Tech Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SKILLS.map((group) => (
                  <div
                    key={group.title}
                    className="p-5 bg-surface-container border border-outline-variant rounded-xl"
                  >
                    <p className="font-label-mono text-[10px] text-primary uppercase mb-4 tracking-tighter">
                      {group.title}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="px-2 py-1 bg-surface-container-highest rounded text-[11px] text-on-surface"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Panel */}
            <section className="pb-24" id="contact">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/3 p-8 bg-surface-container-low border-b md:border-b-0 md:border-r border-outline-variant space-y-6">
                  <h2 className="font-headline-md text-on-surface">Let&apos;s Connect</h2>
                  <p className="text-sm text-on-surface-variant">
                    Looking for a collaborator, mentor, or engineer? Drop a message or reach out
                    via socials.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
                      <span className="material-symbols-outlined">alternate_email</span>
                      <span>hello@arafat.workspace</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
                      <span className="material-symbols-outlined">share</span>
                      <span>@arafat_dev</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-8 bg-surface-container-lowest">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        className="w-full bg-background border border-outline-variant rounded-lg p-3 text-sm focus:border-primary focus:ring-0 transition-colors"
                        placeholder="Name"
                        type="text"
                      />
                      <input
                        className="w-full bg-background border border-outline-variant rounded-lg p-3 text-sm focus:border-primary focus:ring-0 transition-colors"
                        placeholder="Email"
                        type="email"
                      />
                    </div>
                    <textarea
                      className="w-full bg-background border border-outline-variant rounded-lg p-3 text-sm focus:border-primary focus:ring-0 transition-colors"
                      placeholder="How can I help?"
                      rows={4}
                    />
                    <button className="w-full py-3 bg-on-background text-background font-bold rounded-lg hover:bg-on-surface transition-colors">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </section>
            </div>
          </main>
        </div>

        {/* Right Panel: AI Assistant (Cursor-style) */}
        <aside className="hidden xl:flex flex-col w-[360px] bg-surface-container-lowest border-l border-outline-variant shrink-0">
          {/* Chat header with tabs */}
          <div className="flex items-center justify-between px-2 h-7 border-b border-outline-variant/40 shrink-0">
            <div className="flex items-center gap-1 text-on-surface-variant">
              <button className="flex items-center gap-1.5 px-2 py-0 rounded text-[11px] text-on-surface bg-surface-container-high">
                <span className="material-symbols-outlined text-[14px] text-primary">forum</span>
                Chat
              </button>
            </div>
            <div className="flex items-center gap-0.5 text-on-surface-variant">

              <button className="material-symbols-outlined text-[16px] p-1 rounded hover:bg-surface-container-low hover:text-on-surface transition-colors">
                history
              </button>
              <button className="material-symbols-outlined text-[16px] p-1 rounded hover:bg-surface-container-low hover:text-on-surface transition-colors">
                more_horiz
              </button>
            </div>
          </div>

          {/* Conversation thread */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar text-[13px]">
            <div className="flex flex-col items-end">
              <div className="max-w-[90%] rounded-lg bg-surface-container-high px-3 py-2 text-on-surface">
                What is Arafat&apos;s tech stack?
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-on-surface-variant font-label-mono">
                <span className="material-symbols-outlined text-[14px] text-primary">
                  auto_awesome
                </span>
                Assistant
              </div>
              <div className="text-on-surface-variant leading-relaxed space-y-2">
                <p>Arafat works across the full stack. A few highlights:</p>
                <ul className="space-y-1 pl-1">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <span className="text-on-surface">Frontend:</span> React, Next.js, Tailwind
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <span className="text-on-surface">Backend:</span> Node.js, Go, PostgreSQL
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <span className="text-on-surface">AI:</span> OpenAI, LangChain, PyTorch
                    </span>
                  </li>
                </ul>
                <div className="rounded-md border border-outline-variant/50 bg-surface-container-low overflow-hidden font-code-sm text-[11px]">
                  <div className="flex items-center justify-between px-3 py-1 bg-surface-container-high border-b border-outline-variant/40 text-on-surface-variant">
                    <span>Skills.ts</span>
                    <span className="material-symbols-outlined text-[13px] hover:text-on-surface cursor-pointer">
                      content_copy
                    </span>
                  </div>
                  <pre className="px-3 py-2 text-secondary whitespace-pre-wrap">
                    export const stack = [&quot;React&quot;, &quot;Go&quot;, &quot;OpenAI&quot;];
                  </pre>
                </div>
              </div>
            </div>

            <div className="pt-1 space-y-1.5">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                Suggested
              </p>
              {[
                "Tell me about Nexus IDE",
                "View experience history",
                "How can I get in touch?",
              ].map((q) => (
                <button
                  key={q}
                  className="w-full text-left px-3 py-2 rounded-md border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary/30 transition-all text-[12px] text-on-surface-variant flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary/70">
                    arrow_outward
                  </span>
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Cursor-style input box */}
          <div className="p-3 border-t border-outline-variant/40 shrink-0">
            <div className="rounded-lg border border-outline-variant bg-surface-container-low focus-within:border-primary/60 transition-colors">
              <div className="flex items-center gap-1.5 px-2 pt-2">
                <button className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-outline-variant/60 text-[10px] text-on-surface-variant hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[12px]">alternate_email</span>
                  Add context
                </button>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container-high text-[10px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-[12px] text-primary">
                    description
                  </span>
                  About.tsx
                </span>
              </div>
              <textarea
                rows={2}
                placeholder="Plan, search, build anything"
                className="w-full bg-transparent resize-none px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none custom-scrollbar"
              />
              <div className="flex items-center justify-between px-2 pb-2">
                <div className="flex items-center gap-1">
                  <button className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-on-surface-variant hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-[13px]">smart_toy</span>
                    Agent
                    <span className="material-symbols-outlined text-[13px]">expand_more</span>
                  </button>
                  <button className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-on-surface-variant hover:bg-surface-container-high transition-colors">
                    claude-4.5-sonnet
                    <span className="material-symbols-outlined text-[13px]">expand_more</span>
                  </button>
                </div>
                <button className="flex items-center justify-center w-6 h-6 rounded-md bg-primary text-on-primary hover:brightness-110 transition-all">
                  <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Terminal Footer */}
      <footer className="flex justify-between items-center w-full px-4 h-8 fixed bottom-0 z-50 bg-surface-container border-t border-outline-variant">
        <div className="flex items-center gap-4 h-full">
          <div className="flex items-center gap-2 px-2 hover:bg-surface-container-highest cursor-pointer h-full transition-colors">
            <span className="material-symbols-outlined text-[14px]">error</span>
            <span className="font-code-sm text-code-sm text-on-surface-variant">0</span>
          </div>
          <div className="flex items-center gap-2 px-2 hover:bg-surface-container-highest cursor-pointer h-full transition-colors">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span className="font-code-sm text-code-sm text-on-surface-variant">2</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-2 h-full">
            <span className="font-code-sm text-[11px] text-secondary">{terminalMsg}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 h-full">
          <span className="font-code-sm text-[11px] text-on-surface-variant px-2 hover:bg-surface-container-highest cursor-default h-full flex items-center">
            UTF-8
          </span>
          <span className="font-code-sm text-[11px] text-on-surface-variant px-2 hover:bg-surface-container-highest cursor-default h-full flex items-center">
            TypeScript JSX
          </span>
          <div className="flex items-center gap-1 text-on-surface-variant px-2 h-full border-l border-outline-variant/30">
            <span className="material-symbols-outlined text-[14px]">notifications</span>
          </div>
        </div>
      </footer>
    </>
  );
}
