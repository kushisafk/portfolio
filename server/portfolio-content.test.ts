import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(resolve(import.meta.dirname, "../client/src/pages/Home.tsx"), "utf8");
const styleSource = readFileSync(resolve(import.meta.dirname, "../client/src/index.css"), "utf8");

describe("portfolio contact and projects content", () => {
  it("shows the opportunity status immediately before the contact links", () => {
    const statusIndex = homeSource.indexOf("Currently open to opportunities");
    const linksIndex = homeSource.indexOf('<nav className="contact-links"');

    expect(statusIndex).toBeGreaterThan(-1);
    expect(linksIndex).toBeGreaterThan(statusIndex);
  });

  it("does not expose owner sign-in or image-upload controls in Selected Projects", () => {
    expect(homeSource).not.toMatch(/ADD WORK|OWNER SIGN IN|PRIVATE CREATOR TOOL|UPLOAD TO PORTFOLIO/i);
  });

  it("keeps the public file-storage gallery query", () => {
    expect(homeSource).toContain("trpc.portfolio.list.useQuery");
    expect(homeSource).toContain("asset-gallery");
  });

  it("shows researched StakeNet, Stonks, and AISEHack project details with repository links", () => {
    expect(homeSource).toContain('title: "StakeNet"');
    expect(homeSource).toContain("staked collateral, x402 micropayments, escrow, and output verification");
    expect(homeSource).toContain('"https://github.com/kushisafk/StakeNet"');
    expect(homeSource).toContain('title: "Stonks"');
    expect(homeSource).toContain("FinBERT news sentiment");
    expect(homeSource).toContain("educational decision-support simulator, not for live trade execution");
    expect(homeSource).toContain('"https://github.com/kushisafk/Stonks"');
    expect(homeSource).toContain('title: "AISEHack 1.0"');
    expect(homeSource).toContain("hundreds of participants across India");
    expect(homeSource).toContain('"https://github.com/kushisafk/AISEHack"');
    expect(homeSource).toContain("project.stack.map((technology)");
    expect(homeSource).toContain('className="project-repository"');
    expect(homeSource).not.toContain("Add a short overview, your role");
    expect(homeSource).not.toContain("ADD YOUR TOOLS / STACK");
  });

  it("shows the E-Cell IARE outreach role and its eight-month duration", () => {
    expect(homeSource).toContain('id="experience"');
    expect(homeSource).toContain("E-Cell IARE");
    expect(homeSource).toContain("ASSOCIATE");
    expect(homeSource).toContain("OUTREACH TEAM");
    expect(homeSource).toContain("8 MONTHS");
    expect(homeSource).toContain("helped host events");
  });

  it("maps desktop and mobile navigation to the Experience section", () => {
    expect(homeSource).toContain('label === "Experience" ? "experience"');
    expect(homeSource).toContain('label === "Experience" ? "#experience"');
  });

  it("includes the About Me story and routes it from the two-column six-link navigation", () => {
    const aboutSectionIndex = homeSource.indexOf('ref={aboutRef}');
    const projectsSectionIndex = homeSource.indexOf('ref={projectsRef}');
    const photoStart = homeSource.indexOf('<figure className="about-photo">');
    const photoEnd = homeSource.indexOf("</figure>", photoStart);
    const photoMarkup = homeSource.slice(photoStart, photoEnd);

    expect(aboutSectionIndex).toBeGreaterThan(-1);
    expect(projectsSectionIndex).toBeGreaterThan(-1);
    expect(aboutSectionIndex).toBeLessThan(projectsSectionIndex);
    expect(homeSource).toContain('id="about"');
    expect(homeSource).toContain('"About Me"');
    expect(homeSource).toContain("CS student at IARE who enjoys exploring how technology can solve real-world problems");
    expect(homeSource).toContain("smart EV charging and localized grid management");
    expect(homeSource).toContain("diabetic retinopathy screening more accessible");
    expect(homeSource).toContain("which I presented at a React Hyderabad meetup");
    expect(homeSource).toContain("hosting events at E-Cell");
    expect(homeSource).toContain('label === "About Me" ? "about"');
    expect(homeSource).toContain('label === "About Me" ? "#about"');
    expect(homeSource).toContain("/manus-storage/react-hyderabad-pitch_fea4d64a.webp");
    expect(homeSource).toContain("Kushal presenting StakeNet to an audience at a React Hyderabad meetup");
    expect(photoStart).toBeGreaterThan(-1);
    expect(photoMarkup).not.toContain("figcaption");
    expect(homeSource).not.toContain("2025");
    expect(homeSource).toContain('const siteLinks = ["About Me", "Experience", "Achievements", "Projects", "Skills", "Get in Touch"]');
    expect(styleSource).toContain("grid-template-rows: repeat(3, auto)");
    expect(homeSource).toContain('querySelectorAll<HTMLElement>(".about-paragraph")');
    expect(homeSource).toContain("paragraphObserver.observe(paragraph)");
    expect(homeSource).toContain('rootMargin: "0px 0px -35% 0px"');
    expect(homeSource).toContain('className={`about-paragraph ${revealedAboutParagraphs.includes(index) ? "is-revealed" : ""}`}');
    expect(styleSource).toContain(".about-copy p.is-revealed { opacity: 1; transform: translateY(0); }");
    expect(styleSource).toContain(".about-layout { display: block; margin: auto 0;");
    expect(styleSource).toContain(".about-photo { float: right; width: clamp(280px, 38%, 470px)");
    expect(styleSource).toContain("shape-outside: margin-box");
    expect(styleSource).toContain(".about-copy { display: flow-root;");
    expect(styleSource).toContain(".about-photo { float: none; width: 100%; margin: 0 0 1.5rem");
    expect(styleSource).toContain(".about-section.is-visible .about-photo img");
    expect(styleSource).toContain("aspect-ratio: 1.5; object-fit: cover");
    expect(styleSource).toContain(".about-photo:hover { transform: translateY(-3px)");
    expect(styleSource).toContain("box-shadow: 0 20px 44px rgb(0 0 0 / 34%)");
  });

  it("lists the four supplied hackathon results in Achievements", () => {
    expect(homeSource).toContain('id="achievements"');
    expect(homeSource).toContain("AISEHack 1.0");
    expect(homeSource).toContain("hundreds of participants across India");
    expect(homeSource).toContain("multispectral and SAR data");
    expect(homeSource).toContain("Convergence2k26");
    expect(homeSource).toContain("CLIMATE & ENVIRONMENT");
    expect(homeSource).toContain("Innovation");
    expect(homeSource).toContain("Nexora");
    expect(homeSource).toContain("https://github.com/kushisafk/AISEHack");
    expect(homeSource).toContain("https://github.com/kushisafk/GridWise");
    expect(homeSource).toContain("https://github.com/kushisafk/AquaWise");
    expect(homeSource).toContain("https://github.com/CreatorsHiring/MedVisionAI");
  });

  it("includes the provided certificate verification URLs and remaining certificate names", () => {
    expect(homeSource).toContain("VDEQOYO294RH");
    expect(homeSource).toContain("H8D77UJQW3H7");
    expect(homeSource).toContain("Fundamentals of LLMs");
    expect(homeSource).toContain("Google Cloud Skill Badges");
    expect(homeSource).toContain("https://www.credly.com/users/saha-kushal");
    expect(homeSource).toContain("Unsupervised Learning, Recommenders, Reinforcement Learning");
  });

  it("presents verification links as accessible clickable certificate icons", () => {
    expect(homeSource).toContain('import { ArrowUpRight, BadgeCheck, Github, Linkedin, Mail, Plus, X }');
    expect(homeSource).toContain('className="certificate-link"');
    expect(homeSource).toContain('aria-label={`Verify ${certificate.title}`}');
    expect(homeSource).toContain('<BadgeCheck size={19}');
    expect(homeSource).toContain('className="certificate-link-arrow"');
  });

  it("makes awards accessible animated disclosures and gives achievements a designed visual focal point", () => {
    expect(homeSource).toContain('Built to <em>compete.</em>');
    expect(homeSource).toContain('className="achievement-highlight"');
    expect(homeSource).toContain('className="achievement-highlight-number">03<span>×</span>');
    expect(homeSource).toContain('className={`achievement-row ${isOpen ? "is-open" : ""}`}');
    expect(homeSource).toContain('aria-expanded={isOpen}');
    expect(homeSource).toContain('aria-controls={panelId}');
    expect(homeSource).toContain('aria-hidden={!isOpen} inert={!isOpen}');
    expect(homeSource).toContain('className="achievement-disclosure"');
    expect(homeSource).toContain('aria-hidden="true"><Plus size={16}');
    expect(homeSource).not.toContain('aria-hidden="true">+</span>');
    expect(homeSource).toContain('className="achievement-repo"');
    expect(homeSource).toContain('aria-label={`View project for ${achievement.title}`}');
    expect(homeSource).toContain('<Github size={15}');
    expect(homeSource).toContain('VIEW ON GITHUB');
    expect(styleSource).toContain(".achievement-row.is-open .achievement-toggle");
    expect(styleSource).toContain(".achievement-row.is-open { background-color: rgb(239 238 233 / 5%); }");
    expect(styleSource).toContain("grid-template-rows 560ms cubic-bezier");
    expect(styleSource).toContain("clip-path: inset(0 0 100% 0)");
    expect(styleSource).toContain("translateY(-14px)");
    expect(styleSource).toContain("achievement-settle-bounce 280ms");
    expect(styleSource).toContain("@keyframes achievement-settle-bounce");
    expect(styleSource).toContain("transition-delay: 0ms, 50ms, 0ms, 0ms");
    expect(styleSource).toContain(".achievement-repo { display: inline-flex;");
    expect(styleSource).toContain("border-radius: 999px");
    expect(styleSource).toContain(".achievement-summary:focus-visible .achievement-toggle");
  });

  it("animates certificate icon interactions and respects reduced-motion preferences", () => {
    expect(styleSource).toContain(".certificate-link:hover, .certificate-link:focus-visible");
    expect(styleSource).toContain(".certificate-link:active");
    expect(styleSource).toContain("prefers-reduced-motion: reduce");
    expect(styleSource).toContain(".achievement-detail-inner, .achievement-repo, .certificate-row, .certificate-link");
    expect(styleSource).toContain(".achievement-row.is-open .achievement-detail-inner { animation: none !important; }");
  });

  it("routes the Achievements navigation item to its section", () => {
    expect(homeSource).toContain('"Achievements"');
    expect(homeSource).toContain('label === "Achievements" ? "achievements"');
    expect(homeSource).toContain('label === "Achievements" ? "#achievements"');
  });

  it("uses the optimized portrait and responsive smooth-scroll tuning", () => {
    expect(homeSource).toContain("YoungManinMall-optimized_f03628da.webp");
    expect(homeSource).toContain('fetchPriority="high"');
    expect(homeSource).toContain('onLoad={() => setPortraitLoaded(true)}');
    expect(homeSource).toContain('portraitLoaded ? "is-loaded" : ""');
    expect(homeSource).toContain("object-contain");
    expect(homeSource).toContain('className={`portrait-layer absolute inset-0 z-20 ${portraitLoaded ? "is-loaded" : ""}');
    expect(styleSource).toContain(".portrait-layer.is-loaded { animation: portrait-rise 1.1s cubic-bezier(.22, 1, .36, 1) 1s both; }");
    expect(styleSource).toContain("@keyframes portrait-rise { from { opacity: 0; transform: translateY(4vh); } to { opacity: 1; transform: translateY(0); } }");
    expect(styleSource).toContain(".anim-line { animation: grow-line 1.1s cubic-bezier(.76, 0, .24, 1) 1s both; }");
    expect(styleSource).toContain("transition: transform 700ms cubic-bezier(0.25, 1, 0.5, 1), filter 700ms cubic-bezier(0.25, 1, 0.5, 1)");
    expect(styleSource).toContain(".portrait-layer.is-hovered .hero-portrait { transform: translateY(-2px) scale(1.008)");
    expect(styleSource).toContain("drop-shadow(0 12px 24px rgb(239 238 233 / 6%))");
    expect(styleSource).toContain(".hero-portrait { transition-duration: .01ms !important");
    expect(homeSource).toContain("lerp: 0.11");
    expect(homeSource).toContain("wheelMultiplier: 0.92");
  });
});
