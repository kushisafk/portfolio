import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { trpc } from "@/lib/trpc";
import Lenis from "lenis";
import { ArrowUpRight, BadgeCheck, Github, Linkedin, Mail, Plus, X } from "lucide-react";
import { toast } from "sonner";

const backgroundImage =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85";
const portraitImage = "/manus-storage/YoungManinMall-optimized_f03628da.webp";

const siteLinks = ["About Me", "Experience", "Achievements", "Projects", "Skills", "Get in Touch"];
const aboutParagraphs = [
  "I'm Kushal, a CS student at IARE who enjoys exploring how technology can solve real-world problems. I'm particularly interested in AI, machine learning, computer vision, RAG, and agentic AI, but I'm always curious to learn about things beyond software.",
  "For me, solving meaningful problems starts with being open to learning something new. That mindset led me to explore hardware, sensors, and IoT while working on a project focused on smart EV charging and localized grid management. Our project won first place at a hackathon, and the experience made me even more excited about building solutions that connect software with the physical world.",
  "I've also worked on making diabetic retinopathy screening more accessible and built a satellite imagery segmentation pipeline for flood detection. The latter earned us a Top 10 finish at AISeHack 1.0 at IIITH. More recently, I've been exploring autonomous AI systems through StakeNet, which I presented at a React Hyderabad meetup.",
  "Outside of tech, I enjoy meeting people, exchanging ideas, and being involved in the community. I also love hosting events at E-Cell and creating spaces where people can connect and collaborate. Having won two hackathons, I'm looking forward to taking on new challenges, learning from others, and building technology that makes a real difference.",
];
const projects = [
  {
    number: "01",
    title: "StakeNet",
    category: "AI AGENT ECONOMY / ALGORAND",
    note: "A trust-backed marketplace for agent-to-agent services.",
    description: "Lets AI agents discover and hire providers, with staked collateral, x402 micropayments, escrow, and output verification building trust into each transaction.",
    stack: ["React", "TypeScript", "FastAPI", "Algorand", "PyTeal", "x402"],
    repoUrl: "https://github.com/kushisafk/StakeNet",
  },
  {
    number: "02",
    title: "Stonks",
    category: "AI RESEARCH / PAPER TRADING",
    note: "An event-driven AI research and paper-trading command line.",
    description: "Combines calibrated machine-learning predictions and FinBERT news sentiment with risk filters, mock portfolio tools, and a background runtime. Designed as an educational decision-support simulator, not for live trade execution.",
    stack: ["Python", "CatBoost", "XGBoost", "FinBERT", "Pandas", "NumPy"],
    repoUrl: "https://github.com/kushisafk/Stonks",
  },
  {
    number: "03",
    title: "AISEHack 1.0",
    category: "NATIONAL AI/ML / IIITH",
    note: "Top 10 finish · satellite-imagery flood segmentation.",
    description: "Placed in the top 10 among hundreds of participants across India. Built a satellite-imagery flood-segmentation system using multispectral and SAR data. The ensemble combines UNet++ (EfficientNet-B5) and UNet (ResNet34).",
    stack: ["Multispectral + SAR", "UNet++", "EfficientNet-B5", "UNet", "ResNet34"],
    repoUrl: "https://github.com/kushisafk/AISEHack",
  },
];
const skillGroups = [
  { category: "Languages", skills: ["Python", "Java", "SQL", "JavaScript"] },
  { category: "Generative AI & Agents", skills: ["Large Language Models (LLMs)", "Prompt Engineering", "Generative AI", "LangChain", "LLM APIs", "Structured Outputs"] },
  { category: "RAG & Vector Search", skills: ["Retrieval-Augmented Generation (RAG)", "Embeddings", "Semantic Search", "Vector Databases", "Weaviate", "FAISS", "Document Chunking"] },
  { category: "Machine Learning & NLP", skills: ["Machine Learning", "Deep Learning", "TensorFlow", "Hugging Face Transformers"] },
  { category: "Backend & Deployment", skills: ["FastAPI", "REST APIs", "PostgreSQL", "SQLite", "Git", "GitHub", "Linux"] },
  { category: "Cloud Infrastructure", skills: ["AWS", "Google Cloud", "Docker"] },
];
const achievements = [
  { number: "01", title: "Top 10 — AISEHack 1.0", distinction: "NATIONAL-LEVEL AI/ML COMPETITION", venue: "IIITH", description: "Placed in the top 10 among hundreds of participants across India. Built a satellite-imagery flood-segmentation system using multispectral and SAR data.", repoUrl: "https://github.com/kushisafk/AISEHack" },
  { number: "02", title: "1st Place — Convergence2k26", distinction: "CLIMATE & ENVIRONMENT", venue: "VNR VJIET", description: "Won first place in the Climate & Environment domain.", repoUrl: "https://github.com/kushisafk/GridWise" },
  { number: "03", title: "1st Place — Innovation", distinction: "HACKATHON WIN", venue: "IARE", description: "Secured first place at Innovation in IARE.", repoUrl: "https://github.com/kushisafk/AquaWise" },
  { number: "04", title: "3rd Place — Nexora", distinction: "HACKATHON WIN", venue: "IARE", description: "Earned third place at Nexora in IARE.", repoUrl: "https://github.com/CreatorsHiring/MedVisionAI" },
];
const certificates = [
  { title: "Retrieval-Augmented Generation (RAG)", issuer: "DeepLearning.AI · Coursera", kind: "COURSE CERTIFICATE", href: "https://www.coursera.org/account/accomplishments/verify/VDEQOYO294RH" },
  { title: "Machine Learning Specialization", issuer: "DeepLearning.AI · Coursera", kind: "SPECIALIZATION", href: "https://coursera.org/verify/specialization/H8D77UJQW3H7" },
  { title: "Fundamentals of LLMs", issuer: "Hugging Face", kind: "COURSE CERTIFICATE" },
  { title: "Google Cloud Skill Badges", issuer: "Google Cloud", kind: "SKILL BADGES", href: "https://www.credly.com/users/saha-kushal" },
];

export default function Home() {
  const assetsQuery = trpc.portfolio.list.useQuery(undefined, { staleTime: 30_000 });
  const assets = assetsQuery.data ?? [];

  const [menuOpen, setMenuOpen] = useState(false);
  const [portraitHovered, setPortraitHovered] = useState(false);
  const [portraitLoaded, setPortraitLoaded] = useState(false);
  const [projectsVisible, setProjectsVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [revealedAboutParagraphs, setRevealedAboutParagraphs] = useState<number[]>([]);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [focusedProject, setFocusedProject] = useState<string | null>(null);
  const [pinnedProject, setPinnedProject] = useState<string | null>(null);
  const [openAchievement, setOpenAchievement] = useState<string | null>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const achievementsRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [experienceVisible, setExperienceVisible] = useState(false);
  const [achievementsVisible, setAchievementsVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      lerp: 0.11,
      wheelMultiplier: 0.92,
      smoothWheel: true,
      respectReducedMotion: true,
    });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (menuOpen) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const section = projectsRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setProjectsVisible(true);
        observer.unobserve(section);
      }
    }, { threshold: 0.15 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = aboutRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setAboutVisible(true);
        observer.unobserve(section);
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = aboutRef.current;
    if (!section) return;
    const paragraphs = section.querySelectorAll<HTMLElement>(".about-paragraph");
    const paragraphObserver = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Number((entry.target as HTMLElement).dataset.aboutIndex);
        setRevealedAboutParagraphs((current) => current.includes(index) ? current : [...current, index]);
        observerInstance.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -35% 0px" });
    paragraphs.forEach((paragraph) => paragraphObserver.observe(paragraph));
    return () => paragraphObserver.disconnect();
  }, []);

  useEffect(() => {
    const section = skillsRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSkillsVisible(true);
        observer.unobserve(section);
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = contactRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setContactVisible(true);
        observer.unobserve(section);
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = experienceRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setExperienceVisible(true);
        observer.unobserve(section);
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = achievementsRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setAchievementsVisible(true);
        observer.unobserve(section);
      }
    }, { threshold: 0.1 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const page = document.querySelector(".site-page");
    const cursor = cursorRef.current;
    if (!page || !cursor || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let pointerX = -100;
    let pointerY = -100;
    let isHovering = false;
    let isVisible = false;

    const render = () => {
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      frame = 0;
    };

    const moveCursor: EventListener = (nativeEvent) => {
      const event = nativeEvent as PointerEvent;
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!isVisible) {
        isVisible = true;
        cursor.classList.add("is-visible");
      }
      if (!frame) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const handlePointerOver: EventListener = (nativeEvent) => {
      const target = nativeEvent.target instanceof Element ? nativeEvent.target.closest("[data-cursor-hover]") : null;
      const shouldHover = target !== null;
      if (shouldHover !== isHovering) {
        isHovering = shouldHover;
        cursor.classList.toggle("is-hovering", isHovering);
      }
    };

    const hideCursor = () => {
      isVisible = false;
      isHovering = false;
      cursor.classList.remove("is-visible", "is-hovering");
    };

    page.addEventListener("pointermove", moveCursor, { passive: true });
    page.addEventListener("pointerover", handlePointerOver, { passive: true });
    page.addEventListener("pointerleave", hideCursor);
    return () => {
      page.removeEventListener("pointermove", moveCursor);
      page.removeEventListener("pointerover", handlePointerOver);
      page.removeEventListener("pointerleave", hideCursor);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const scrollToTop = (event?: ReactMouseEvent<HTMLAnchorElement>) => {
    if (event) event.preventDefault();
    closeMenu();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top: 0, behavior: "auto" });
    } else if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handleSiteLink = (event: ReactMouseEvent<HTMLAnchorElement>, label: string) => {
    event.preventDefault();
    const sectionId = label === "Projects" ? "projects" : label === "Experience" ? "experience" : label === "Achievements" ? "achievements" : label === "About Me" ? "about" : label === "Skills" ? "skills" : label === "Get in Touch" ? "contact" : null;
    if (!sectionId) {
      closeMenu();
      toast.info(`${label} is ready for your details. Add that section's content to make this link active.`);
      return;
    }
    closeMenu();
    window.setTimeout(() => {
      const target = document.getElementById(sectionId);
      if (!target) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
      } else if (lenisRef.current) {
        lenisRef.current.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, menuOpen ? 80 : 0);
  };

  return (
    <main className="site-page">
      <section className="hero-screen relative h-[100dvh] w-full overflow-hidden bg-black text-cream">
        <img src={backgroundImage} alt="" className="hero-background absolute inset-0 h-full w-full object-cover anim-fade-in" />
        <div className="image-tone absolute inset-0" aria-hidden="true" />

        <div className="marquee-wrap absolute inset-x-0 top-[16vh] z-10 overflow-hidden sm:top-[14vh] anim-fade-up delay-500">
          <div className="marquee flex w-max whitespace-nowrap font-hn text-[16vh] leading-none text-cream sm:text-[26vh]">
            <span className="pr-[6vw]">Kushal Saha | </span>
            <span className="pr-[6vw]" aria-hidden="true">Kushal Saha | </span>
          </div>
        </div>

        <div className={`portrait-layer absolute inset-0 z-20 ${portraitLoaded ? "is-loaded" : ""} ${portraitHovered ? "is-hovered" : ""}`}>
          <img src={portraitImage} alt="Kushal Saha, wearing a white T-shirt and standing with his arms crossed." fetchPriority="high" onLoad={() => setPortraitLoaded(true)} className="hero-portrait pointer-events-none absolute inset-0 h-full w-full object-contain" />
          <span className="portrait-hover-target" aria-hidden="true" onMouseEnter={() => setPortraitHovered(true)} onMouseLeave={() => setPortraitHovered(false)} />
        </div>

        <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 font-hn sm:px-10 sm:pt-8">
          <a href="#" data-cursor-hover className="brand anim-fade-up delay-800 text-lg tracking-wide" onClick={scrollToTop}>
            Kushal
          </a>

          <div className="desktop-links hidden items-start sm:flex">
            <nav className="link-column" aria-label="Portfolio navigation" data-cursor-hover>
              {siteLinks.map((label, index) => (
                <a
                  className="desktop-link anim-fade-up"
                  href={label === "Projects" ? "#projects" : label === "Experience" ? "#experience" : label === "Achievements" ? "#achievements" : label === "About Me" ? "#about" : label === "Skills" ? "#skills" : label === "Get in Touch" ? "#contact" : "#"}
                  key={label}
                  onClick={(event) => handleSiteLink(event, label)}
                  style={{ animationDelay: `${1000 + index * 80}ms` }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <div
          className={`drawer-backdrop fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden ${menuOpen ? "is-open" : ""}`}
          aria-hidden="true"
          onClick={closeMenu}
        />
        <aside
          className={`mobile-drawer fixed inset-y-0 right-0 z-40 flex w-[80%] max-w-sm flex-col bg-[#141414] px-8 py-10 font-hn sm:hidden ${menuOpen ? "is-open" : ""}`}
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          <div className="drawer-group">
            <nav className="drawer-nav" aria-label="Portfolio navigation" data-cursor-hover>
              {siteLinks.map((label, index) => (
                <a
                  href={label === "Projects" ? "#projects" : label === "Experience" ? "#experience" : label === "Achievements" ? "#achievements" : label === "About Me" ? "#about" : label === "Skills" ? "#skills" : label === "Get in Touch" ? "#contact" : "#"}
                  key={label}
                  onClick={(event) => handleSiteLink(event, label)}
                  className={`drawer-nav-link ${menuOpen ? "is-visible" : ""}`}
                  style={{ transitionDelay: menuOpen ? `${300 + index * 80}ms` : "0ms" }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="cream-rule anim-line" aria-hidden="true" />

        <footer className="desktop-footer absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-6 pb-5 font-hn text-xs leading-relaxed sm:px-10 sm:pb-8 sm:text-sm">
          <div className="footer-left anim-fade-up delay-1400">
            <p>Second-year CS student</p>
            <p>3x hackathon winner</p>
            <p>building ai solutions</p>
          </div>
          <div className="footer-right anim-fade-up delay-1550 text-right">
            <p>A portfolio by</p>
            <p>Kushal Saha</p>
          </div>
        </footer>

        <button
          type="button"
          className={`mobile-menu-button absolute right-6 top-6 z-50 grid h-10 w-10 place-items-center sm:hidden ${menuOpen ? "is-open" : ""}`}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="hamburger-bars" aria-hidden="true">
            <span className="hamburger-bar bar-top" />
            <span className="hamburger-bar bar-middle" />
            <span className="hamburger-bar bar-bottom" />
          </span>
          <X className="mobile-close-icon" size={26} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </section>

      <section
        ref={aboutRef}
        id="about"
        className={`about-section ${aboutVisible ? "is-visible" : ""}`}
        aria-labelledby="about-title"
      >
        <div className="about-inner">
          <div className="about-meta">
            <span>ABOUT ME&nbsp; / &nbsp;KUSHAL SAHA</span>
            <a href="#projects" data-cursor-hover>SELECTED PROJECTS ↑</a>
          </div>
          <div className="about-layout">
            <header className="about-heading">
              <p className="experience-kicker"><span /> THE PERSON BEHIND THE PROJECTS</p>
              <h2 id="about-title">Curious by <em>default.</em></h2>
              <span className="about-index">01 — A LITTLE ABOUT ME</span>
            </header>
            <div className="about-copy">
              <figure className="about-photo">
                <img src="/manus-storage/react-hyderabad-pitch_fea4d64a.webp" alt="Kushal presenting StakeNet to an audience at a React Hyderabad meetup." loading="lazy" decoding="async" />
              </figure>
              {aboutParagraphs.map((paragraph, index) => (
                <p className={`about-paragraph ${revealedAboutParagraphs.includes(index) ? "is-revealed" : ""}`} data-about-index={index} key={paragraph} style={{ transitionDelay: `${index * 70}ms` }}>{paragraph}</p>
              ))}
            </div>
          </div>
          <footer className="about-footer">
            <a href="#experience" data-cursor-hover>COMMUNITY &amp; EXPERIENCE ↓</a>
            <span>LEARNING / BUILDING / CONNECTING</span>
          </footer>
        </div>
      </section>
      <section
        ref={projectsRef}
        id="projects"
        className={`projects-section ${projectsVisible ? "is-visible" : ""}`}
        aria-labelledby="projects-title"
      >
        <div className="projects-inner">
          <div className="projects-meta">
            <span>SELECTED WORK&nbsp; / &nbsp;KUSHAL SAHA</span>
            <div className="projects-meta-actions">
              <a href="#" data-cursor-hover onClick={scrollToTop}>BACK TO TOP ↑</a>
            </div>
          </div>
          <div className="projects-heading">
            <p className="projects-kicker"><span /> A FEW THINGS I’VE MADE</p>
            <h1 id="projects-title">Selected <em>Projects</em></h1>
            <p className="projects-intro">A small collection of experiments, ideas, and work in progress.</p>
          </div>
          <div className="projects-list">
            {projects.map((project, index) => (
              <article
                className={`project-item ${hoveredProject === project.number || focusedProject === project.number || pinnedProject === project.number ? "is-open" : ""}`}
                id={`project-${project.number}`}
                key={project.number}
                style={{ transitionDelay: projectsVisible ? `${150 + index * 120}ms` : "0ms" }}
                onMouseEnter={() => setHoveredProject(project.number)}
                onMouseLeave={() => setHoveredProject((current) => current === project.number ? null : current)}
                onFocus={() => setFocusedProject(project.number)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setFocusedProject((current) => current === project.number ? null : current);
                  }
                }}
              >
                <button
                  type="button"
                  className="project-row"
                  data-cursor-hover
                  aria-expanded={hoveredProject === project.number || focusedProject === project.number || pinnedProject === project.number}
                  aria-controls={`project-details-${project.number}`}
                  onClick={(event) => {
                    const closing = pinnedProject === project.number;
                    setPinnedProject(closing ? null : project.number);
                    if (closing) {
                      setFocusedProject(null);
                      event.currentTarget.blur();
                    }
                  }}
                >
                  <span className="project-number">{project.number}</span>
                  <span className="project-rule" aria-hidden="true" />
                  <span className="project-copy"><strong>{project.title}</strong><small>{project.note}</small></span>
                  <span className="project-category">{project.category}</span>
                  <span className="project-arrow" aria-hidden="true">⌄</span>
                </button>
                <div className="project-details" id={`project-details-${project.number}`} aria-hidden={!(hoveredProject === project.number || focusedProject === project.number || pinnedProject === project.number)} inert={!(hoveredProject === project.number || focusedProject === project.number || pinnedProject === project.number)}>
                  <div className="project-details-inner">
                    <p>{project.description}</p>
                    <div className="project-detail-meta" aria-label={`${project.title} technology stack`}>
                      {project.stack.map((technology) => <span className="project-stack-tag" key={technology}>{technology}</span>)}
                    </div>
                    <a className="project-repository" href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub`} data-cursor-hover>
                      <Github size={15} strokeWidth={1.7} aria-hidden="true" /> VIEW ON GITHUB <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {assets.length > 0 ? (
            <div className="asset-gallery" aria-label="Portfolio images">
              {assets.map((asset, index) => (
                <figure className="asset-card" data-cursor-hover key={asset.id} style={{ transitionDelay: `${index * 70}ms` }}>
                  <div className="asset-image-wrap"><img src={asset.url} alt={asset.title} loading="lazy" /></div>
                  <figcaption><strong>{asset.title}</strong><span>{asset.mimeType.replace("image/", "").toUpperCase()} / {new Date(asset.createdAt).toLocaleDateString()}</span></figcaption>
                </figure>
              ))}
            </div>
          ) : null}
          <div className="projects-footnote"><span>01 — 03</span><span>MORE TO COME</span></div>
        </div>
      </section>
      <section
        ref={experienceRef}
        id="experience"
        className={`experience-section ${experienceVisible ? "is-visible" : ""}`}
        aria-labelledby="experience-title"
      >
        <div className="experience-inner">
          <div className="experience-meta">
            <span>EXPERIENCE&nbsp; / &nbsp;KUSHAL SAHA</span>
            <a href="#projects" data-cursor-hover>SELECTED PROJECTS ↑</a>
          </div>
          <header className="experience-heading">
            <p className="experience-kicker"><span /> COMMUNITY &amp; LEADERSHIP</p>
            <h2 id="experience-title">Experience</h2>
            <p>People, events, and communities I’ve contributed to.</p>
          </header>
          <article className="experience-entry">
            <span className="experience-index">01</span>
            <div className="experience-entry-main">
              <p className="experience-role">ASSOCIATE&nbsp; / &nbsp;OUTREACH TEAM</p>
              <h3>E-Cell IARE</h3>
              <p>Contributed to outreach and helped host events.</p>
            </div>
            <span className="experience-duration">8 MONTHS</span>
          </article>
          <footer className="experience-footer">
            <a href="#skills" data-cursor-hover>CONTINUE TO SKILLS ↓</a>
            <span>01 EXPERIENCE</span>
          </footer>
        </div>
      </section>
      <section
        ref={achievementsRef}
        id="achievements"
        className={`achievements-section ${achievementsVisible ? "is-visible" : ""}`}
        aria-labelledby="achievements-title"
      >
        <div className="achievements-inner">
          <div className="achievements-meta">
            <span>ACHIEVEMENTS &amp; CERTIFICATES&nbsp; / &nbsp;KUSHAL SAHA</span>
            <a href="#experience" data-cursor-hover>EXPERIENCE ↑</a>
          </div>
          <header className="achievements-heading">
            <p className="achievements-kicker"><span /> RECOGNITION &amp; LEARNING</p>
            <h2 id="achievements-title">Built to <em>compete.</em></h2>
            <p>A national top-10 finish and three hackathon wins across AI, climate, and innovation.</p>
          </header>
          <div className="achievement-highlight" aria-label="Three-time hackathon winner">
            <div className="achievement-highlight-number">03<span>×</span></div>
            <div className="achievement-highlight-copy">
              <p>HACKATHON WINNER</p>
              <span>Three podium finishes, alongside a national AI/ML top-10.</span>
            </div>
            <span className="achievement-highlight-index">AWARDS / 2026</span>
          </div>
          <div className="achievement-list-heading">
            <span>SELECTED RESULTS</span>
            <span>OPEN AN ENTRY FOR DETAILS&nbsp; ↓</span>
          </div>
          <div className="achievement-list" aria-label="Hackathon achievements">
            {achievements.map((achievement, index) => {
              const isOpen = openAchievement === achievement.number;
              const panelId = `achievement-panel-${achievement.number}`;
              return (
                <article className={`achievement-row ${isOpen ? "is-open" : ""}`} key={achievement.number} style={{ transitionDelay: `${index * 70}ms` }}>
                  <button
                    className="achievement-summary"
                    type="button"
                    data-cursor-hover
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenAchievement(isOpen ? null : achievement.number)}
                  >
                    <span className="achievement-number">{achievement.number}</span>
                    <span className="achievement-copy">
                      <span className="achievement-distinction">{achievement.distinction}&nbsp; / &nbsp;{achievement.venue}</span>
                      <span className="achievement-title" role="heading" aria-level={3}>{achievement.title}</span>
                    </span>
                    <span className="achievement-toggle" aria-hidden="true"><Plus size={16} strokeWidth={1.5} /></span>
                  </button>
                  <div id={panelId} className="achievement-disclosure" aria-hidden={!isOpen} inert={!isOpen}>
                    <div className="achievement-detail-inner">
                      <p>{achievement.description}</p>
                      <span>{achievement.venue}&nbsp; / &nbsp;{achievement.distinction}</span>
                      <a className="achievement-repo" href={achievement.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={`View project for ${achievement.title}`}>
                        <Github size={15} strokeWidth={1.7} aria-hidden="true" />
                        VIEW ON GITHUB <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="certificates-block">
            <div className="certificates-heading">
              <p className="achievements-kicker"><span /> SELECTED CERTIFICATES</p>
              <span>04 CREDENTIALS&nbsp; / &nbsp;TAP TO VERIFY</span>
            </div>
            <div className="certificate-list" aria-label="Certificates and skill badges">
              {certificates.map((certificate, index) => (
                <div className="certificate-row" key={certificate.title}>
                  <span className="certificate-index">{String(index + 1).padStart(2, "0")}</span>
                  <div className="certificate-copy">
                    <h3>{certificate.title}</h3>
                    <p>{certificate.issuer}</p>
                    <span className="certificate-kind">{certificate.kind}</span>
                    {certificate.title === "Machine Learning Specialization" && (
                      <p className="certificate-detail">Supervised Machine Learning: Regression and Classification · Advanced Learning Algorithms · Unsupervised Learning, Recommenders, Reinforcement Learning</p>
                    )}
                  </div>
                  {"href" in certificate ? (
                    <a className="certificate-link" href={certificate.href} target="_blank" rel="noopener noreferrer" data-cursor-hover aria-label={`Verify ${certificate.title}`}>
                      <BadgeCheck size={19} strokeWidth={1.5} aria-hidden="true" />
                      <ArrowUpRight className="certificate-link-arrow" size={12} strokeWidth={1.5} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="certificate-unlinked">BADGES</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <footer className="achievements-footer">
            <a href="#skills" data-cursor-hover>CONTINUE TO SKILLS ↓</a>
            <span>04 WINS / 04 CREDENTIALS</span>
          </footer>
        </div>
      </section>
      <section
        ref={skillsRef}
        id="skills"
        className={`skills-section ${skillsVisible ? "is-visible" : ""}`}
        aria-labelledby="skills-title"
      >
        <div className="skills-inner">
          <div className="skills-meta">
            <span>TECHNICAL TOOLKIT&nbsp; / &nbsp;KUSHAL SAHA</span>
            <a href="#projects" data-cursor-hover>SELECTED PROJECTS ↑</a>
          </div>
          <header className="skills-heading">
            <p className="projects-kicker"><span /> TOOLS I WORK WITH</p>
            <h2 id="skills-title">Skills <em>&amp; tools</em></h2>
            <p>A practical toolkit for building software and AI-powered applications.</p>
          </header>
          <div className="skills-grid">
            {skillGroups.map((group, index) => (
              <article className="skill-card" key={group.category} style={{ transitionDelay: `${index * 65}ms` }}>
                <div className="skill-card-heading">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{group.category}</h3>
                </div>
                <ul className="skill-tags" aria-label={group.category}>
                  {group.skills.map((skill) => <li className="skill-tag" key={skill}>{skill}</li>)}
                </ul>
              </article>
            ))}
          </div>
          <footer className="skills-footer">
            <a href="#projects" data-cursor-hover>BACK TO PROJECTS ↑</a>
            <span>6 AREAS / {skillGroups.reduce((total, group) => total + group.skills.length, 0)} SKILLS</span>
          </footer>
        </div>
      </section>
      <section
        ref={contactRef}
        id="contact"
        className={`contact-section ${contactVisible ? "is-visible" : ""}`}
        aria-labelledby="contact-title"
      >
        <div className="contact-inner">
          <div className="contact-meta">
            <span>GET IN TOUCH&nbsp; / &nbsp;KUSHAL SAHA</span>
            <a href="#projects" data-cursor-hover>SELECTED PROJECTS ↑</a>
          </div>
          <header className="contact-heading">
            <p className="projects-kicker"><span /> OPEN TO GOOD IDEAS</p>
            <h2 id="contact-title">Let’s build <em>something.</em></h2>
            <p>Find me around the web, or send me an email.</p>
          </header>
          <p className="opportunity-status"><span aria-hidden="true" /> Currently open to opportunities</p>
          <nav className="contact-links" aria-label="Contact links">
            <a className="contact-link contact-link-github" href="https://github.com/kushisafk" target="_blank" rel="noopener noreferrer" data-cursor-hover>
              <span className="contact-index">01</span>
              <span className="contact-link-label"><span className="contact-brand-icon" aria-hidden="true"><Github size={19} strokeWidth={1.7} /></span>GitHub</span>
              <span className="contact-link-value">github.com/kushisafk</span>
              <span className="contact-arrow" aria-hidden="true">↗</span>
            </a>
            <a className="contact-link contact-link-linkedin" href="https://www.linkedin.com/in/saha-kushal/" target="_blank" rel="noopener noreferrer" data-cursor-hover>
              <span className="contact-index">02</span>
              <span className="contact-link-label"><span className="contact-brand-icon" aria-hidden="true"><Linkedin size={19} strokeWidth={1.7} /></span>LinkedIn</span>
              <span className="contact-link-value">linkedin.com/in/saha-kushal</span>
              <span className="contact-arrow" aria-hidden="true">↗</span>
            </a>
            <a className="contact-link contact-link-email" href="mailto:kushalsaha789@gmail.com" data-cursor-hover>
              <span className="contact-index">03</span>
              <span className="contact-link-label"><span className="contact-brand-icon" aria-hidden="true"><Mail size={19} strokeWidth={1.7} /></span>Email</span>
              <span className="contact-link-value">kushalsaha789@gmail.com</span>
              <span className="contact-arrow" aria-hidden="true">↗</span>
            </a>
          </nav>
          <footer className="contact-footer">
            <span>THANKS FOR STOPPING BY</span>
            <a href="#" data-cursor-hover onClick={scrollToTop}>BACK TO TOP ↑</a>
          </footer>
        </div>
      </section>
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
        <span className="custom-cursor-dot" />
      </div>
    </main>
  );
}
