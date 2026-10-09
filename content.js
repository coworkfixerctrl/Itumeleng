export const PROFILE = {
  name: "Itumeleng D. Kgongwane",
  short: "Kgongwane",
  credentials: "MS Finance · MBA · PGDip · BSc Chem Eng",
  role: "Lead Engineer, Sappi R&D",
  location: "Pretoria, South Africa",
  email: "kgongwane@icloud.com",
  linkedin: "https://www.linkedin.com/in/itumelengidk/",
};

export const SOCIALS = [
  { id: "linkedin", label: "LinkedIn", href: PROFILE.linkedin, brand: "#0A66C2" },
  { id: "email", label: "Email", href: `mailto:${PROFILE.email}`, brand: "#38BDF8", fg: "#0b1220" },
  { id: "phone", label: "Call", href: "tel:+27829730324", brand: "#F8FAFC", fg: "#0b1220" },
];

export const MARQUEE = [
  "Molecular Execution",
  "Corporate Strategy",
  "Capital Allocation",
  "R&D Commercialisation",
  "Process Optimisation",
  "Equity Analysis",
  "Sustainability Strategy",
  "Agentic AI",
];

export const AWARDS = [
  { year: "2022", title: "Sappi Global Gold Technical Innovation Award", note: "Graz, Austria · 9 May 2022" },
  { year: "2021", title: "Sappi Annual Value Award", note: "Project execution with speed during COVID-19" },
  { year: "2024", title: "General Manager's Award", note: "Stage-gate (Accolade) financial metrics roll-out" },
  { year: "2013", title: "Global Catalyst Compass Award nominee", note: "BASF inventory optimisation project" },
];

export const TIMELINE = [
  {
    track: "fin", year: "2026", period: "Aug 2026", title: "MS Finance — Summa Cum Laude",
    org: "Fordham Gabelli School of Business, New York",
    summary: "GPA 3.94. Corporate finance and investment applications, fund strategies and performance, fintech, global finance.",
    metrics: ["GPA 3.94", "Summa Cum Laude"],
    photo: { id: "fordham", pos: "30% 38%", src: "/img/fordham.webp", alt: "Itumeleng Kgongwane at Fordham Gabelli School of Business, Midtown NYC", tag: "Midtown NYC · 2026", kicker: "Fordham Gabelli", caption: "Determination. New York drive.", badge: "GPA 3.94" },
    details: ["Upskilled straight into agentic AI to automate finance and strategy workflows", "Built an automated market-intelligence workflow: three daily briefs from the FT, Bloomberg and WSJ (overnight, US pre-open, US post-open)"],
  },
  {
    track: "fin", year: "2025", period: "Dec 2025", title: "MBA",
    org: "Gordon Institute of Business Science (GIBS), Sandton",
    summary: "Distinctions in Decision Making, Entrepreneurial Finance and Financial Modelling.",
    metrics: ["3 Distinctions"],
    photo: { id: "mba", pos: "50% 68%", src: "/img/gibs-mba.jpg", alt: "Itumeleng Kgongwane presenting Responsible Leadership in South Africa during the GIBS MBA", tag: "", kicker: "GIBS MBA · Leadership", caption: "Responsible Leadership in South Africa.", badge: "3 Distinctions" },
    details: ["Electives: strategy execution with the balanced scorecard, AI-driven leadership, sales & business development, negotiation"],
  },
  {
    track: "fin", year: "2024", period: "2024 — 2025", title: "Business Development: MFC Corrugator Adhesive",
    org: "Sappi R&D",
    summary: "Applied MBA strategy and finance tools from opportunity identification to customer trials, sizing TAM/SAM/SOM and building the pricing model.",
    metrics: ["−60% variability", "+141% bond strength"],
    details: ["Business Model Canvas used to win executive buy-in", "Business case and pricing model built from customer research, literature and competitor data", "Trials delivered a 10 m/min machine-speed increase on heavier boards"],
  },
  {
    track: "fin", year: "2024", period: "Nov 2024", title: "PGDip & General Manager's Award",
    org: "GIBS · Sappi",
    summary: "Distinctions in Financial & Management Accounting, Corporate Finance and Macroeconomics. Awarded for supporting the Accolade stage-gate roll-out.",
    metrics: ["3 Distinctions", "GM's Award"],
    photo: { id: "gibs", pos: "50% 10%", src: "/img/gibs-pgdip.webp", alt: "Itumeleng Kgongwane at the GIBS PGDip Class of 2024 celebration", tag: "", kicker: "GIBS · University of Pretoria", caption: "PGDip Class of 2024. What a journey.", badge: "3 Distinctions" },
    details: ["Helped teams set, quantify and interpret financial metrics across project categories", "Applied business project on SDG 13, Target 13.3.1"],
  },
  {
    track: "fin", year: "2023", period: "2023 — Present", title: "Sappi Global Sustainability Task Force",
    org: "Group strategy, with the Director & Head of Sustainability",
    summary: "Built the sustainability criteria framework for Sappi Southern Africa's full portfolio using EN 13432, turning compliance into market opportunity.",
    metrics: ["2030 targets", "USA · EU · RSA"],
    details: ["Portfolio scope: pulp, containerboard, kraft bag, graphic paper, tissue, cellulose and lignin", "Standardised sustainability scoring of new and existing products for the Sappi Sustainability Report"],
  },
  {
    track: "eng", year: "2023", period: "Jan 2023 — Present", title: "Lead Engineer",
    org: "Sappi R&D, Pretoria",
    summary: "Leads a team of scientists. Scaled microfibrillated cellulose (MFC) at Stanger Mill with Sappi Europe R&D (Netherlands).",
    metrics: ["R24M EBITDA p.a.", "R203M NPV"],
    details: ["Established the energy input for superior MFC performance from South African pulps", "Bagasse-derived MFC offset raw material at ~R1,000/t while maintaining quality", "Direct report nominated for the 2024 South African TIA for the implementation"],
  },
  {
    track: "eng", year: "2017", period: "Mar 2017 — Dec 2022", title: "Senior Engineer",
    org: "Sappi R&D, Pretoria",
    summary: "Spearheaded sustainable packaging grades to offset the digitisation-driven decline of graphic paper. Launched September 2020.",
    metrics: ["R36M → R51M EBITDA", "Global Gold TIA"],
    photo: { id: "tia", pos: "50% 24%", yearBelow: true, src: "/img/tia-graz.jpg", alt: "Itumeleng Kgongwane receiving the Sappi Global Gold Technical Innovation Award in Graz, Austria", tag: "Graz, Austria · 2022", kicker: "Sappi Technical Innovation Awards", caption: "Global Gold. Sustainable packaging.", badge: "Global Gold TIA" },
    details: ["Market share from zero to 16% in year one; now 25–30%", "Annual Value Award (Nov 2021) for speed of execution during COVID-19", "Won the South African and then the global TIA against Sappi Europe and North America"],
  },
  {
    track: "eng", year: "2013", period: "Jul 2013 — Feb 2017", title: "Process Engineer",
    org: "Sappi Enstra, Springs",
    summary: "Acted as both production and technical manager. Built a quasi-dynamic dashboard tracking water, steam and energy daily.",
    metrics: ["R20M saved", "15 → 9 ML/day water"],
    details: ["Filler-increase chemistry offset expensive imported fibre carrying exchange-rate risk", "Coordinated chemical trials through management of change"],
  },
  {
    track: "eng", year: "2011", period: "Jan 2011 — Jun 2013", title: "Process Project Engineer",
    org: "BASF Environmental Catalyst & Metal Solutions, Port Elizabeth",
    summary: "Virtual cross-cultural project with BASF Germany's SAP team and Dimension Data to unlock optimal use of PGM recycle inventory.",
    metrics: ["−45% recycle inventory"],
    details: ["Wrote pseudo-algorithms translated into SAP and Oracle logic", "Nominated for the Global Catalyst Compass Award"],
  },
  {
    track: "eng", year: "2009", period: "Jan 2009 — Dec 2010", title: "Junior Process Engineer",
    org: "BASF, Port Elizabeth",
    summary: "Re-engineered a 'two-tank process' that eliminated back-pressure defects on asymmetric soot-filter technology.",
    metrics: ["+27% throughput", "Production record"],
    details: ["Used the 5Ms to resolve a 25% defect rate", "Coordinated technology transfer with the German R&D centre"],
  },
  {
    track: "eng", year: "2005", period: "2005 — 2007", title: "BSc Chemical Engineering → Metallurgist",
    org: "Wits University · Anglo Coal, Bank Colliery",
    summary: "Graduated in chemical engineering and learnt the unit operations of a thermal coal processing plant.",
    metrics: ["BSc Chem Eng"],
    details: ["Project Management, Wits Plus (2008)", "Intermediate Leadership Program, NMMU (2013)"],
  },
];

export const CASES = [
  {
    id: "sustainable-packaging", code: "CS/01", sector: "Packaging · Sappi R&D", years: "2017 — 2022",
    image: "/img/packaging.jpg",
    title: "Sustainable packaging grades",
    problem: "Digitisation was eroding graphic-paper demand. A new, higher-margin packaging grade had to be developed and launched across sales, marketing, technical and production — during COVID-19.",
    outcome: "Market share from zero to 16% in year one (now 25–30%), with R36M and R51M EBITDA in the first two years. Won Sappi's Global Gold TIA.",
    stats: [{ v: "R87M", l: "EBITDA, yrs 1–2" }, { v: "0→16%", l: "Share, year one" }],
  },
  {
    id: "mfc-stanger", code: "CS/02", sector: "Advanced Materials · Stanger Mill", years: "2023 — Present",
    image: "/img/mfc.jpg",
    title: "MFC scale-up from bagasse pulp",
    problem: "Turning South African pulps into microfibrillated cellulose required pinning down the right energy input with Sappi Europe R&D, then scaling it at mill level.",
    outcome: "Bagasse MFC offsets raw-material input at ~R1,000/t without compromising quality — adding R24M EBITDA a year.",
    stats: [{ v: "R203M", l: "15-yr NPV" }, { v: "R24M", l: "EBITDA p.a." }],
  },
  {
    id: "mfc-adhesive", code: "CS/03", sector: "Business Development · Corrugators", years: "2024 — 2025",
    image: "/img/adhesive.jpg",
    title: "MFC in corrugator starch adhesive",
    problem: "Customer pain points in corrugating adhesive (variability, bond strength, speed) needed a validated recipe and a business case strong enough to justify trials.",
    outcome: "Sized TAM/SAM/SOM, built the pricing model and won executive buy-in. Customer trials proved the economics on heavier boards.",
    stats: [{ v: "+141%", l: "Bond strength" }, { v: "−60%", l: "Process variability" }],
  },
  {
    id: "enstra-filler", code: "CS/04", sector: "Mill Operations · Sappi Enstra", years: "2013 — 2017",
    image: "/img/enstra.jpg",
    title: "Filler chemistry vs. FX-exposed fibre",
    problem: "Imported pulp fibre was expensive and carried significant exchange-rate risk, while water, steam and energy use lacked daily visibility.",
    outcome: "Filler-increase chemistry substituted costly fibre, and a daily resource dashboard drove water efficiency.",
    stats: [{ v: "R20M", l: "Cost savings" }, { v: "−40%", l: "Water (15→9 ML/day)" }],
  },
  {
    id: "basf-inventory", code: "CS/05", sector: "Digital Supply Chain · BASF", years: "2011 — 2013",
    image: "/img/basf-inventory.jpg",
    title: "PGM recycle inventory optimisation",
    problem: "System glitches across SAP and Oracle prevented optimal use of platinum-group-metal recycle inventory in automotive catalyst production.",
    outcome: "Mapped process, data and physical inventory; wrote pseudo-algorithms for the integrators. Nominated for the Global Catalyst Compass Award.",
    stats: [{ v: "−45%", l: "Recycle inventory" }, { v: "SAP", l: "Digital tracking" }],
  },
  {
    id: "basf-two-tank", code: "CS/06", sector: "Process Engineering · BASF", years: "2009 — 2010",
    image: "/img/basf-process.jpg",
    title: "The two-tank process",
    problem: "Back-pressure defects on asymmetric soot-filter technology were running at 25%, capping output on a critical emissions product.",
    outcome: "A 5M root-cause analysis led to a reconfigured two-tank process that eliminated the defect and set a new production record.",
    stats: [{ v: "+27%", l: "Throughput" }, { v: "25%→0", l: "Back-pressure defects" }],
  },
];

export const ADVISORY_AREAS = [
  "Technical due diligence on process & materials assets",
  "R&D commercialisation, business cases & pricing",
  "Process, energy & cost optimisation",
  "Sustainability strategy & ESG frameworks",
  "Equity & market analysis for industrials",
];

export const TOPICS = [
  "Technical Due Diligence",
  "R&D Commercialisation & Business Cases",
  "Process & Cost Optimisation",
  "Sustainability Strategy & ESG",
  "Equity & Market Analysis",
  "Speaking / Mentorship",
];

export const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export const CATEGORIES = ["Equities & Valuation", "Macro & Commodities", "Fixed Income & FX", "Industrials & Materials", "Strategy & Leadership", "Fintech & AI", "Sustainability & ESG"];

export const COVER_PRESETS = ["/img/li-us10y.jpg", "/img/li-barbell.jpg", "/img/li-triple-threat.jpg", "/img/market-1.jpg", "/img/market-2.jpg", "/img/market-3.jpg", "/img/mill.jpg", "/img/lab.jpg", "/img/packaging.jpg", "/img/basf-inventory.jpg"];
