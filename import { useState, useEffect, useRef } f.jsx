import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0b0c0e;
    --surface: #13151a;
    --border: #1f2330;
    --accent: #c8f04a;
    --accent2: #4af0c8;
    --text: #e8eaf0;
    --muted: #6b7080;
    --font-display: 'Syne', sans-serif;
    --font-serif: 'Instrument Serif', serif;
    --font-mono: 'DM Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-display);
    overflow-x: hidden;
    line-height: 1.6;
  }

  ::selection { background: var(--accent); color: #000; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

  /* Noise overlay */
  .noise::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.4;
  }

  /* NAV */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 4rem;
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease;
  }
  nav.scrolled {
    background: rgba(11,12,14,0.85);
    backdrop-filter: blur(18px);
    border-bottom-color: var(--border);
  }
  .nav-logo {
    font-weight: 800;
    font-size: 1.1rem;
    letter-spacing: -0.02em;
    color: var(--accent);
    cursor: pointer;
  }
  .nav-logo span { color: var(--text); }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a {
    color: var(--muted);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--accent); }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: grid;
    place-items: center;
    position: relative;
    padding: 8rem 4rem 4rem;
    overflow: hidden;
  }
  .hero-grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    opacity: 0.4;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%);
  }
  .hero-glow {
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,240,74,0.12) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 900px;
    text-align: center;
  }
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 0.35rem 1rem;
    font-size: 0.78rem;
    font-family: var(--font-mono);
    color: var(--accent);
    margin-bottom: 2.5rem;
    background: rgba(200,240,74,0.05);
    animation: fadeSlideDown 0.8s ease both;
  }
  .badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }
  .hero h1 {
    font-size: clamp(3.5rem, 10vw, 7rem);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.04em;
    margin-bottom: 1.5rem;
    animation: fadeSlideUp 0.9s 0.1s ease both;
  }
  .hero h1 em {
    font-family: var(--font-serif);
    font-style: italic;
    font-weight: 400;
    color: var(--accent);
  }
  .hero-desc {
    font-size: 1.1rem;
    color: var(--muted);
    max-width: 520px;
    margin: 0 auto 3rem;
    line-height: 1.7;
    animation: fadeSlideUp 0.9s 0.2s ease both;
  }
  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    animation: fadeSlideUp 0.9s 0.3s ease both;
  }
  .btn-primary {
    background: var(--accent);
    color: #000;
    border: none;
    padding: 0.85rem 2rem;
    border-radius: 6px;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(200,240,74,0.3); }
  .btn-outline {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border);
    padding: 0.85rem 2rem;
    border-radius: 6px;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }

  /* SCROLL INDICATOR */
  .scroll-indicator {
    position: absolute;
    bottom: 2.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--muted);
    font-size: 0.7rem;
    font-family: var(--font-mono);
    letter-spacing: 0.1em;
    animation: fadeSlideUp 1s 0.6s ease both;
  }
  .scroll-line {
    width: 1px; height: 40px;
    background: linear-gradient(to bottom, var(--accent), transparent);
    animation: scrollPulse 2s infinite;
  }
  @keyframes scrollPulse {
    0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
  }

  /* SECTION COMMONS */
  section { padding: 7rem 4rem; max-width: 1100px; margin: 0 auto; }
  .section-label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--accent);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
    max-width: 80px;
  }
  .section-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 1rem;
  }
  .section-title em {
    font-family: var(--font-serif);
    font-style: italic;
    font-weight: 400;
    color: var(--accent);
  }

  /* ABOUT */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: center;
    margin-top: 4rem;
  }
  .about-text p {
    color: var(--muted);
    font-size: 1.05rem;
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }
  .about-text p strong { color: var(--text); }
  .about-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.5rem;
    transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: var(--accent); }
  .stat-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--accent);
    line-height: 1;
    margin-bottom: 0.3rem;
  }
  .stat-label { font-size: 0.85rem; color: var(--muted); }

  /* SKILLS */
  .skills-wrapper { margin-top: 4rem; }
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.75rem;
  }
  .skill-chip {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.85rem 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.88rem;
    font-weight: 600;
    transition: all 0.2s;
    cursor: default;
  }
  .skill-chip:hover {
    border-color: var(--accent);
    background: rgba(200,240,74,0.05);
    transform: translateY(-2px);
  }
  .skill-icon { font-size: 1.1rem; }

  /* PROJECTS */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
    margin-top: 4rem;
  }
  .project-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    transition: all 0.3s;
    cursor: pointer;
  }
  .project-card:hover {
    border-color: var(--accent);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  }
  .project-thumb {
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.5rem;
    position: relative;
    overflow: hidden;
  }
  .project-body { padding: 1.5rem; }
  .project-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.8rem; }
  .tag {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--accent2);
    background: rgba(74,240,200,0.08);
    border: 1px solid rgba(74,240,200,0.2);
    border-radius: 4px;
    padding: 0.2rem 0.6rem;
  }
  .project-name {
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
  }
  .project-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.6; margin-bottom: 1.2rem; }
  .project-links { display: flex; gap: 0.75rem; }
  .project-link {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    transition: color 0.2s;
    font-family: var(--font-mono);
  }
  .project-link:hover { color: var(--accent); }

  /* CONTACT */
  .contact-inner {
    margin-top: 4rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 4rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .contact-inner::before {
    content: '';
    position: absolute;
    top: 0; left: 50%; transform: translateX(-50%);
    width: 300px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
  }
  .contact-title {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 1rem;
  }
  .contact-title em {
    font-family: var(--font-serif);
    font-style: italic;
    font-weight: 400;
    color: var(--accent);
  }
  .contact-desc { color: var(--muted); margin-bottom: 2.5rem; font-size: 1rem; }
  .contact-links { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .contact-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    color: var(--muted);
    text-decoration: none;
    font-size: 0.88rem;
    font-weight: 600;
    transition: all 0.2s;
    font-family: var(--font-mono);
  }
  .contact-link:hover { border-color: var(--accent); color: var(--accent); background: rgba(200,240,74,0.05); }

  /* FOOTER */
  footer {
    border-top: 1px solid var(--border);
    padding: 2rem 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--muted);
    font-size: 0.8rem;
    font-family: var(--font-mono);
  }
  footer a { color: var(--accent); text-decoration: none; }

  /* ANIMATIONS */
  @keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    nav { padding: 1rem 1.5rem; }
    .nav-links { display: none; }
    .hero { padding: 7rem 1.5rem 4rem; }
    section { padding: 5rem 1.5rem; }
    .about-grid { grid-template-columns: 1fr; gap: 3rem; }
    .projects-grid { grid-template-columns: 1fr; }
    footer { flex-direction: column; gap: 1rem; text-align: center; padding: 2rem 1.5rem; }
    .contact-inner { padding: 2.5rem 1.5rem; }
  }
`;

const SKILLS = [
  { icon: "⚛️", name: "React" },
  { icon: "🔷", name: "TypeScript" },
  { icon: "🟨", name: "JavaScript" },
  { icon: "🎨", name: "CSS / Tailwind" },
  { icon: "🌐", name: "Next.js" },
  { icon: "🟢", name: "Node.js" },
  { icon: "🛢️", name: "MongoDB" },
  { icon: "🐘", name: "PostgreSQL" },
  { icon: "🔥", name: "Firebase" },
  { icon: "🐙", name: "Git & GitHub" },
  { icon: "🐳", name: "Docker" },
  { icon: "☁️", name: "AWS Basics" },
];

const PROJECTS = [
  {
    emoji: "🛒",
    bg: "linear-gradient(135deg, #1a1a2e, #16213e)",
    tags: ["React", "Node.js", "MongoDB"],
    name: "ShopEase — E-Commerce Platform",
    desc: "A full-featured online store with cart, payments, and admin dashboard. Users can browse products, filter by category, and checkout securely.",
    github: "#",
    live: "#",
  },
  {
    emoji: "✅",
    bg: "linear-gradient(135deg, #0d1117, #161b22)",
    tags: ["Next.js", "TypeScript", "Firebase"],
    name: "TaskFlow — Project Manager",
    desc: "A Kanban-style task manager with drag-and-drop boards, team collaboration, and real-time updates using Firebase.",
    github: "#",
    live: "#",
  },
  {
    emoji: "💬",
    bg: "linear-gradient(135deg, #0f2027, #203a43)",
    tags: ["React", "Socket.io", "Express"],
    name: "ChatSpace — Real-time Chat App",
    desc: "A modern chat application with rooms, direct messages, file sharing, and emoji reactions — built with WebSockets.",
    github: "#",
    live: "#",
  },
  {
    emoji: "🌦️",
    bg: "linear-gradient(135deg, #1a1a2e, #0f3460)",
    tags: ["JavaScript", "REST API", "CSS"],
    name: "WeatherNow — Weather Dashboard",
    desc: "Clean weather app showing 7-day forecasts, live conditions, and animated weather icons using the OpenWeather API.",
    github: "#",
    live: "#",
  },
  {
    emoji: "📝",
    bg: "linear-gradient(135deg, #12151c, #1c2333)",
    tags: ["Next.js", "MDX", "Tailwind"],
    name: "DevBlog — Personal Blog CMS",
    desc: "A markdown-powered developer blog with syntax highlighting, dark mode, SEO optimization, and fast static generation.",
    github: "#",
    live: "#",
  },
  {
    emoji: "🤖",
    bg: "linear-gradient(135deg, #0d1117, #1f2d1f)",
    tags: ["Python", "OpenAI API", "FastAPI"],
    name: "AskBot — AI Assistant",
    desc: "A conversational AI chatbot using OpenAI's API with conversation history, streaming responses, and markdown rendering.",
    github: "#",
    live: "#",
  },
];

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = "" }) {
  const ref = useScrollReveal();
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{style}</style>
      <div className="noise">

        {/* NAV */}
        <nav className={scrolled ? "scrolled" : ""}>
          <div className="nav-logo">Alex<span>.dev</span></div>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-grid-bg" />
          <div className="hero-glow" />
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" />
              Available for work
            </div>
            <h1>
              Hi, I'm Alex —<br />
              <em>Full Stack</em> Developer
            </h1>
            <p className="hero-desc">
              I build clean, fast, and user-friendly web applications.
              Turning ideas into real products with modern tools and good code.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="btn-primary">See My Work →</a>
              <a href="#contact" className="btn-outline">Let's Talk</a>
            </div>
          </div>
          <div className="scroll-indicator">
            <span>scroll</span>
            <div className="scroll-line" />
          </div>
        </div>

        {/* ABOUT */}
        <section id="about">
          <RevealSection>
            <p className="section-label">01 — About Me</p>
            <h2 className="section-title">Who <em>I am</em></h2>
          </RevealSection>
          <div className="about-grid">
            <RevealSection>
              <div className="about-text">
                <p>
                  I'm <strong>Alex Johnson</strong>, a full stack developer based in New York with
                  a love for building things that live on the internet. I care deeply about
                  writing clean code and creating experiences that feel natural to use.
                </p>
                <p>
                  I started coding at 16, building small websites for fun. Today I work on
                  real products — from early startup ideas to large-scale web apps — helping
                  teams ship fast without cutting corners on quality.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring hiking trails, reading about
                  design, or experimenting with new JavaScript frameworks (there's always a new one 😄).
                </p>
              </div>
            </RevealSection>
            <RevealSection>
              <div className="about-stats">
                {[
                  { n: "4+", l: "Years of Experience" },
                  { n: "30+", l: "Projects Shipped" },
                  { n: "15+", l: "Happy Clients" },
                  { n: "∞", l: "Cups of Coffee" },
                ].map((s, i) => (
                  <div className="stat-card" key={i}>
                    <div className="stat-number">{s.n}</div>
                    <div className="stat-label">{s.l}</div>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" style={{ background: "var(--bg)" }}>
          <RevealSection>
            <p className="section-label">02 — Skills</p>
            <h2 className="section-title">What I <em>work with</em></h2>
            <p style={{ color: "var(--muted)", marginTop: "0.5rem", marginBottom: "3rem" }}>
              My go-to tools for building modern web applications.
            </p>
          </RevealSection>
          <RevealSection>
            <div className="skills-wrapper">
              <div className="skills-grid">
                {SKILLS.map((s, i) => (
                  <div className="skill-chip" key={i}>
                    <span className="skill-icon">{s.icon}</span>
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <RevealSection>
            <p className="section-label">03 — Projects</p>
            <h2 className="section-title">Things I've <em>built</em></h2>
            <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
              A mix of personal projects, freelance work, and side experiments.
            </p>
          </RevealSection>
          <div className="projects-grid">
            {PROJECTS.map((p, i) => (
              <RevealSection key={i}>
                <div className="project-card">
                  <div className="project-thumb" style={{ background: p.bg }}>
                    <span style={{ fontSize: "3.5rem", filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.5))" }}>
                      {p.emoji}
                    </span>
                  </div>
                  <div className="project-body">
                    <div className="project-tags">
                      {p.tags.map((t, j) => <span key={j} className="tag">{t}</span>)}
                    </div>
                    <div className="project-name">{p.name}</div>
                    <p className="project-desc">{p.desc}</p>
                    <div className="project-links">
                      <a href={p.github} className="project-link">⬡ GitHub</a>
                      <a href={p.live} className="project-link">↗ Live Demo</a>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <RevealSection>
            <p className="section-label">04 — Contact</p>
          </RevealSection>
          <RevealSection>
            <div className="contact-inner">
              <h2 className="contact-title">Let's <em>work together</em></h2>
              <p className="contact-desc">
                Got a project idea, a job opportunity, or just want to say hi?<br />
                My inbox is always open. I'll reply within 24 hours!
              </p>
              <div className="contact-links">
                <a href="mailto:alex@example.com" className="contact-link">✉ alex@example.com</a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="contact-link">⬡ GitHub</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="contact-link">in LinkedIn</a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="contact-link">𝕏 Twitter</a>
              </div>
            </div>
          </RevealSection>
        </section>

        {/* FOOTER */}
        <footer>
          <span>© 2026 <a href="#">Alex Johnson</a> — All rights reserved.</span>
          <span>Built with React · Designed with ❤️</span>
        </footer>

      </div>
    </>
  );
}