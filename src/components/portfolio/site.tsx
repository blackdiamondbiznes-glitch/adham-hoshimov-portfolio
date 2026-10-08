import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Atom,
  Bot,
  Braces,
  Cloud,
  CodeXml,
  Database,
  FileCode,
  Github,
  LifeBuoy,
  Menu,
  Monitor,
  Moon,
  MousePointer2,
  PanelsTopLeft,
  Phone,
  Play,
  QrCode,
  Send,
  Server,
  Smartphone,
  Sparkles,
  Sun,
  Terminal,
  Triangle,
  Webhook,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { shownValue, type ProjectView } from "@/config/portfolio";
import { LocaleProvider, useContent } from "@/lib/locale";
import { ThemeProvider, useTheme } from "@/lib/theme";
import { About } from "@/components/portfolio/about";
import { driveImageUrl, youtubeEmbed, youtubeId } from "@/lib/media";
import { cn } from "@/lib/utils";

const techIcons: Record<string, LucideIcon> = {
  React: Atom,
  TypeScript: FileCode,
  Vite: Zap,
  "HTML/CSS": CodeXml,
  JavaScript: Braces,
  "Python (FastAPI, aiogram)": Terminal,
  "Node.js": Server,
  Express: Server,
  "PostgreSQL (Neon)": Database,
  SQLite: Database,
  Supabase: Database,
  "Bot API": Bot,
  "Telegram Mini App": Smartphone,
  webhook: Webhook,
  Render: Cloud,
  Vercel: Triangle,
  GitHub: Github,
  Cursor: MousePointer2,
  "Grok Build": Sparkles,
  Python: Terminal,
  aiogram: Bot,
  PostgreSQL: Database,
  Telegram: Send,
  Tailwind: CodeXml,
};

const serviceIcons: LucideIcon[] = [
  Bot,
  Smartphone,
  Server,
  QrCode,
  PanelsTopLeft,
  LifeBuoy,
  Monitor,
];

const heroChips = [
  "React",
  "TypeScript",
  "Python",
  "aiogram",
  "PostgreSQL",
  "Telegram",
  "Vite",
  "Tailwind",
];

function externalProps(href: string) {
  if (/^https?:/i.test(href)) {
    return { target: "_blank" as const, rel: "noopener noreferrer" };
  }
  return {};
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

function desktopMotion() {
  return (
    window.matchMedia("(min-width: 900px)").matches &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function Site() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <SiteBody />
      </ThemeProvider>
    </LocaleProvider>
  );
}

function SiteBody() {
  const { copy } = useContent();
  const [active, setActive] = useState("");

  useEffect(() => {
    const nodes = copy.nav
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [copy.nav]);

  return (
    <div id="top" className="page min-h-screen">
      <CursorGlow />
      <a
        href="#haqimda"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-[#4f2bff] focus:px-4 focus:py-3 focus:text-white"
      >
        {copy.skip}
      </a>
      <Header active={active} />
      <main>
        <Hero />
        <TechMarquee />
        <About />
        <Skills />
        <Services />
        <Projects />
        <Ticker />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Mark() {
  return <img src="/logo-mark.svg" alt="" width={36} height={36} className="size-9 rounded-lg" />;
}

function Header({ active }: { active: string }) {
  const { copy, locale, setLocale } = useContent();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  function go(id: string) {
    setOpen(false);
    scrollToId(id);
  }

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 md:top-5 md:px-6">
      <div className="header-shell mx-auto flex max-w-5xl items-center gap-3 rounded-full px-3 py-2">
        <a
          href="#top"
          aria-label={copy.name}
          className="inline-flex min-h-11 items-center"
          onClick={(event) => {
            event.preventDefault();
            go("top");
          }}
        >
          <Mark />
        </a>
        <nav aria-label={copy.sectionsLabel} className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {copy.nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={cn(
                "muted inline-flex min-h-11 items-center px-3 text-sm",
                active === item.id && "fg",
              )}
              onClick={(event) => {
                event.preventDefault();
                go(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <LangSwitch locale={locale} label={copy.langLabel} onChange={setLocale} />
          <span className="theme-split" aria-hidden="true" />
          <ThemeSwitch />
          <a
            href={copy.telegram.href}
            {...externalProps(copy.telegram.href)}
            className="btn accent-fill hidden min-h-11 items-center rounded-full px-4 text-sm font-semibold md:inline-flex"
          >
            {copy.telegram.label}
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? copy.menuClose : copy.menuOpen}</span>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id={menuId}
          aria-label={copy.mobileMenu}
          className="menu-panel mx-auto mt-2 max-w-5xl rounded-3xl p-3 md:hidden"
        >
          {copy.nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="muted flex min-h-12 items-center px-3 text-base"
              onClick={(event) => {
                event.preventDefault();
                go(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href={copy.telegram.href}
            {...externalProps(copy.telegram.href)}
            className="accent-fill mt-1 flex min-h-12 items-center justify-center rounded-full text-sm font-semibold"
          >
            {copy.telegram.label}
          </a>
        </nav>
      ) : null}
    </header>
  );
}

function LangSwitch({
  locale,
  label,
  onChange,
}: {
  locale: "uz" | "ru";
  label: string;
  onChange: (locale: "uz" | "ru") => void;
}) {
  return (
    <div className="flex items-center text-sm font-semibold" role="group" aria-label={label}>
      {(["uz", "ru"] as const).map((code, index) => (
        <span key={code} className="inline-flex items-center">
          {index > 0 ? <span className="faint">/</span> : null}
          <button
            type="button"
            aria-pressed={locale === code}
            className={cn(
              "inline-flex min-h-11 items-center px-1.5 tracking-wide",
              locale === code ? "fg" : "muted",
            )}
            onClick={() => onChange(code)}
          >
            {code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}

function ThemeSwitch() {
  const { copy } = useContent();
  const { theme, setTheme } = useTheme();
  const light = theme === "light";
  const label = light ? copy.themeToDark : copy.themeToLight;
  const Icon = light ? Moon : Sun;

  return (
    <button
      type="button"
      className="inline-flex size-11 items-center justify-center rounded-full"
      aria-pressed={light}
      aria-label={label}
      title={label}
      onClick={() => setTheme(light ? "dark" : "light")}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}

function Hero() {
  const { copy } = useContent();
  return (
    <section className="hero-stage flex min-h-dvh items-end">
      <Smoke />
      <div className="hero-wash" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-28 pb-10">
        <p className="kicker">{copy.role}</p>
        <h1 className="mt-4">
          <span className="sr-only">{copy.name}</span>
          <span aria-hidden="true" className="block text-sm font-semibold tracking-[0.42em] muted">
            ADHAM
          </span>
          <span aria-hidden="true" className="hero-outline">
            HOSH<span className="hero-ink">I</span>MOV
          </span>
        </h1>
        <div className="hero-glass mt-6 max-w-xl">
          <p className="text-base leading-relaxed soft md:text-lg">{copy.slogan}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => scrollToId("loyihalar")}
            className="btn accent-fill inline-flex min-h-12 items-center justify-center rounded-full px-5 text-base font-semibold"
          >
            {copy.projectsButton}
          </button>
          <a
            href={copy.telegram.href}
            {...externalProps(copy.telegram.href)}
            className="btn inline-flex min-h-12 items-center justify-center rounded-full ghost px-5 text-base font-semibold"
          >
            {copy.telegram.label}
          </a>
          </div>
        </div>
        <ChipPile />
      </div>
    </section>
  );
}

function Smoke() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !desktopMotion()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let running = true;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, canvas.clientWidth * ratio);
      canvas.height = Math.max(1, canvas.clientHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();

    const blobs = [
      { x: 0.22, y: 0.35, r: 0.42, s: 0.16, p: 0.2 },
      { x: 0.7, y: 0.25, r: 0.36, s: 0.12, p: 1.4 },
      { x: 0.55, y: 0.62, r: 0.48, s: 0.1, p: 2.2 },
      { x: 0.15, y: 0.75, r: 0.3, s: 0.18, p: 3.1 },
      { x: 0.84, y: 0.7, r: 0.34, s: 0.14, p: 4 },
    ];

    const draw = (time: number) => {
      if (!running) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const blob of blobs) {
        const x = (blob.x + Math.sin(time * 0.00012 * (1 + blob.s) + blob.p) * 0.1) * w;
        const y = (blob.y + Math.cos(time * 0.0001 * (1 + blob.s) + blob.p) * 0.08) * h;
        const radius = blob.r * Math.min(w, h) * 0.55;
        const paint = ctx.createRadialGradient(x, y, 0, x, y, radius);
        paint.addColorStop(0, "rgba(79,43,255,0.34)");
        paint.addColorStop(0.4, "rgba(18,6,40,0.2)");
        paint.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = paint;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      running = Boolean(entry?.isIntersecting);
      if (running) frame = requestAnimationFrame(draw);
      else cancelAnimationFrame(frame);
    });
    observer.observe(canvas);
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="smoke-canvas" aria-hidden="true" />;
}

function ChipPile() {
  const { copy } = useContent();
  const host = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el || !desktopMotion()) return;
    let stop = false;
    let frame = 0;
    let cleanup = () => {};

    void import("matter-js").then((mod) => {
      if (stop || !host.current) return;
      const Matter = mod.default;
      const stage = host.current;
      const width = stage.clientWidth;
      const height = 240;
      const engine = Matter.Engine.create();
      engine.gravity.y = 1.05;
      const ground = Matter.Bodies.rectangle(width / 2, height + 18, width + 40, 40, { isStatic: true });
      const left = Matter.Bodies.rectangle(-24, height / 2, 48, height * 2, { isStatic: true });
      const right = Matter.Bodies.rectangle(width + 24, height / 2, 48, height * 2, { isStatic: true });
      const nodes = [...stage.querySelectorAll<HTMLElement>("[data-chip]")];
      const bodies = nodes.map((node, index) => {
        const w = node.offsetWidth || 120;
        const h = 40;
        return Matter.Bodies.rectangle(width * 0.15 + (index % 4) * (width * 0.18), -30 - index * 46, w, h, {
          restitution: 0.18,
          friction: 0.35,
          chamfer: { radius: 20 },
          angle: (index - 3) * 0.12,
        });
      });
      Matter.Composite.add(engine.world, [ground, left, right, ...bodies]);
      const mouse = Matter.Mouse.create(stage);
      Matter.Composite.add(
        engine.world,
        Matter.MouseConstraint.create(engine, {
          mouse,
          constraint: { stiffness: 0.18, damping: 0.1 },
        }),
      );
      const runner = Matter.Runner.create();
      Matter.Runner.run(runner, engine);
      setLive(true);
      const tick = () => {
        nodes.forEach((node, index) => {
          const body = bodies[index];
          if (!body) return;
          const w = node.offsetWidth;
          node.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - 20}px) rotate(${body.angle}rad)`;
        });
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      cleanup = () => {
        cancelAnimationFrame(frame);
        Matter.Runner.stop(runner);
        Matter.Engine.clear(engine);
      };
    });

    return () => {
      stop = true;
      cleanup();
    };
  }, []);

  return (
    <div ref={host} className={cn("chip-stage mt-10", live && "is-live")} aria-label={copy.chipsLabel}>
      {heroChips.map((chip) => (
        <span key={chip} data-chip className="skill-chip mr-2 mb-2 min-h-10">
          {chip}
        </span>
      ))}
    </div>
  );
}

function TechMarquee() {
  const { copy } = useContent();
  const items = copy.skills.flatMap((group) => group.items);
  const rowA = items.filter((_, index) => index % 2 === 0);
  const rowB = items.filter((_, index) => index % 2 === 1);
  return (
    <section aria-label={copy.techLabel} className="border-y line py-6">
      <MarqueeRow items={rowA} />
      <MarqueeRow items={rowB.length ? rowB : rowA} reverse />
    </section>
  );
}

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee-mask py-2">
      <div className={cn("marquee-track gap-10 px-4", reverse && "marquee-rev")}>
        {loop.map((item, index) => {
          const Icon = techIcons[item] ?? Sparkles;
          return (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-2 text-sm font-medium soft">
              <Icon className="size-4 muted" aria-hidden="true" />
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Fade({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Skills() {
  const { copy } = useContent();
  const spans = ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-3", "md:col-span-3"];
  return (
    <section id="konikmalar" className="scroll-mt-28">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Fade>
          <p className="kicker">{copy.skillsKicker}</p>
          <h2 className="section-title mt-3">{copy.skillsTitle}</h2>
        </Fade>
        <div className="mt-10 grid gap-3 md:grid-cols-6">
          {copy.skills.map((group, index) => (
            <Fade key={group.title} delay={index * 0.06} className={spans[index]}>
              <SkillCard title={group.title} items={group.items} />
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCard({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <article className="glass h-full p-5 transition-colors duration-300">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => {
          const Icon = techIcons[item] ?? Sparkles;
          return (
            <li key={item} className="flex items-center gap-2.5 fg text-base">
              <Icon className="size-4 shrink-0 accent-icon" aria-hidden="true" />
              {item}
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function Services() {
  const { copy } = useContent();
  return (
    <section id="xizmatlar" className="scroll-mt-28">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Fade>
          <p className="kicker">{copy.servicesKicker}</p>
          <h2 className="section-title mt-3">{copy.servicesTitle}</h2>
        </Fade>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {copy.services.map((service, index) => {
            const Icon = serviceIcons[index] ?? Bot;
            const price = shownValue(service.price);
            return (
              <li key={service.title}>
                <Fade delay={index * 0.05}>
                  <article className="glass h-full p-5 transition-colors duration-300">
                    <Icon className="size-5 accent-icon" aria-hidden="true" />
                    <h3 className="mt-4 text-lg font-semibold tracking-tight">{service.title}</h3>
                    <p className="mt-1 text-base muted">{service.detail}</p>
                    <p className="mt-3 text-sm soft">
                      {price ? copy.formatPrice(price) : copy.priceAsk}
                    </p>
                  </article>
                </Fade>
              </li>
            );
          })}
        </ul>
        <Fade className="mt-12">
          <p className="kicker">{copy.processKicker}</p>
          <h2 className="section-title mt-3">{copy.processTitle}</h2>
        </Fade>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {copy.steps.map((step, index) => (
            <li key={step.title} className="glass p-5">
              <span className="text-sm font-semibold accent-icon">0{index + 1}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-base muted">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Projects() {
  const { copy } = useContent();
  return (
    <section id="loyihalar" className="scroll-mt-28">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Fade>
          <p className="kicker">{copy.projectsKicker}</p>
          <h2 className="section-title mt-3">{copy.projectsTitle}</h2>
        </Fade>
        <ul className="mt-10 grid items-stretch gap-5 md:grid-cols-2">
          {copy.projects.map((project, index) => (
            <Fade key={project.id} delay={index * 0.06} className="h-full">
              <ProjectCard project={project} />
            </Fade>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: ProjectView }) {
  const { copy } = useContent();
  const ref = useRef<HTMLElement>(null);
  const video = youtubeId(project.video);
  const [playing, setPlaying] = useState(false);

  function onMove(event: PointerEvent<HTMLElement>) {
    const card = ref.current;
    if (!card || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - box.left}px`);
    card.style.setProperty("--my", `${event.clientY - box.top}px`);
  }

  return (
    <article ref={ref} onPointerMove={onMove} className="project-card glass flex h-full flex-col overflow-hidden">
      <ProjectMedia project={project} video={video} playing={playing} />
        <div className="relative z-[3] flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-3 text-base leading-relaxed muted">{project.summary}</p>
        <p className="mt-3 text-base leading-relaxed soft">
          {copy.resultLabel}: {project.result}
          {shownValue(project.metric) ? ` — ${shownValue(project.metric)}` : ""}
        </p>
        <Gallery urls={project.gallery} title={project.title} />
        {project.tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-full tag px-2.5 py-1 text-sm muted">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {project.links.map((link) => {
            const external = /^https?:/i.test(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                {...externalProps(link.href)}
                className={cn(
                  "btn inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium",
                  link.href.startsWith("/")
                    ? "accent-fill"
                    : "ghost",
                )}
              >
                {link.label}
                {external ? <ArrowUpRight className="size-4" aria-hidden="true" /> : null}
              </a>
            );
          })}
          {video ? (
            <button
              type="button"
              className="btn inline-flex min-h-11 items-center gap-1.5 rounded-full ghost px-4 text-sm font-medium"
              onClick={() => setPlaying(true)}
            >
              <Play className="size-4" aria-hidden="true" />
              {copy.videoLabel}
            </button>
          ) : null}
          {project.links.length === 0 && !video ? (
            <span className="inline-flex min-h-11 items-center rounded-full tag px-4 text-sm muted">
              {copy.closedLabel}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ProjectMedia({
  project,
  video,
  playing,
}: {
  project: ProjectView;
  video: string | null;
  playing: boolean;
}) {
  if (playing && video) {
    return (
      <div className="relative aspect-project bg-black">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={youtubeEmbed(video)}
          title={`${project.title} videosi`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return <DriveImage url={project.image} title={project.title} />;
}

function DriveImage({ url, title }: { url: string; title: string }) {
  const src = driveImageUrl(url);
  const [visible, setVisible] = useState(Boolean(src));

  if (!src || !visible) {
    return <div className="media-fallback aspect-project" />;
  }

  return (
    <div className="cine-media">
      <img
        src={src}
        alt={title}
        width={1200}
        height={750}
        loading="lazy"
        decoding="async"
        onError={() => setVisible(false)}
        className="aspect-project w-full object-cover"
      />
    </div>
  );
}

function Gallery({ urls, title }: { urls: string[]; title: string }) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const shots = urls
    .map((url) => driveImageUrl(url))
    .filter((url): url is string => Boolean(url))
    .filter((url) => !failed[url]);
  if (shots.length === 0) return null;

  return (
    <ul className="mt-4 grid grid-cols-3 gap-2">
      {shots.map((src) => (
        <li key={src}>
          <img
            src={src}
            alt={title}
            width={480}
            height={300}
            loading="lazy"
            decoding="async"
            onError={() => setFailed((current) => ({ ...current, [src]: true }))}
            className="aspect-project w-full rounded-xl object-cover"
          />
        </li>
      ))}
    </ul>
  );
}

function Ticker() {
  const { copy } = useContent();
  return (
    <div className="ticker py-4" aria-hidden="true">
      <div className="ticker-track">
        <span className="px-4">{copy.ticker.repeat(2)}</span>
        <span className="px-4">{copy.ticker.repeat(2)}</span>
      </div>
    </div>
  );
}

function Contact() {
  const { copy } = useContent();
  return (
    <section id="aloqa" className="scroll-mt-28">
      <Fade className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <p className="kicker">{copy.contactKicker}</p>
        <h2 className="section-title mt-4 max-w-4xl">{copy.contactTitle}</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed soft md:text-lg">{copy.contactText}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Magnetic href={copy.telegram.href} className="accent-fill">
            <Send className="size-5" aria-hidden="true" />
            {copy.telegram.label}
          </Magnetic>
          <a
            href={copy.phone.href}
            className="btn inline-flex min-h-16 items-center justify-center gap-3 rounded-full ghost px-8 text-lg font-semibold"
          >
            <Phone className="size-5" aria-hidden="true" />
            {copy.phone.label}
          </a>
        </div>
      </Fade>
    </section>
  );
}

function Magnetic({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function move(event: PointerEvent<HTMLAnchorElement>) {
    const node = ref.current;
    if (!node || event.pointerType !== "mouse" || !desktopMotion()) return;
    const box = node.getBoundingClientRect();
    const x = event.clientX - (box.left + box.width / 2);
    const y = event.clientY - (box.top + box.height / 2);
    node.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
  }

  return (
    <a
      ref={ref}
      href={href}
      {...externalProps(href)}
      onPointerMove={move}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
      className={cn(
        "btn inline-flex min-h-16 items-center justify-center gap-3 rounded-full px-8 text-lg font-semibold",
        className,
      )}
    >
      {children}
    </a>
  );
}

function Footer() {
  const { copy } = useContent();
  return (
    <footer className="border-t line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-sm muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {copy.name}</p>
        <div className="flex gap-5">
          <a href={copy.telegram.href} {...externalProps(copy.telegram.href)} className="inline-flex min-h-11 items-center">
            {copy.footerTelegram}
          </a>
          <a href={copy.phone.href} className="inline-flex min-h-11 items-center">
            {copy.phone.label}
          </a>
        </div>
      </div>
    </footer>
  );
}

function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !desktopMotion()) return;
    const onMove = (event: globalThis.PointerEvent) => {
      node.style.opacity = "1";
      node.style.transform = `translate(${event.clientX - 224}px, ${event.clientY - 224}px)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 hidden overflow-hidden md:block" aria-hidden="true">
      <div ref={ref} className="cursor-glow" />
    </div>
  );
}
