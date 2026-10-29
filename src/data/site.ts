/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT: the single source of truth for all business content.
 *
 *  Edit text, contact details, services, process steps and tips here.
 *  Components read from this file; you shouldn't need to touch them.
 *
 *  Images are referenced by path RELATIVE TO src/assets/
 *  (e.g. "stock/kitchen.jpg"). JPG, PNG, WebP, AVIF and SVG all work;
 *  raster photos are resized and converted to WebP at build time.
 *  Only publish the company's own photos or properly licensed stock (credited in
 *  src/assets/stock/CREDITS.md). Never use anything from src/assets/_disabled/.
 *
 *  Items with `placeholder: true` show a small "Placeholder" badge on the page
 *  while `settings.showPlaceholderBadges` is true. Replace the content, then
 *  remove the flag (or turn the badges off globally).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ── Global switches ──────────────────────────────────────────────────────── */

export const settings = {
  /** Show "Placeholder" badges on unfinished content (useful on preview deploys). Off since launch. */
  showPlaceholderBadges: false,
  /** Enable once every service card has a photo, so the grid stays consistent. */
  showServiceImages: false,
  /**
   * Projects gallery (before/after cards, comparison slider, lightbox). Off since v1.1.0: the
   * earlier photos were of a different company's work. Re-enable only with photos of
   * Turnkey Reno's own completed projects. While off, the "How We Work" section takes its place
   * and "Projects" is left out of every nav.
   */
  showProjects: false,
  /** Optional side image in "How We Work" (licensed stock, see howWeWork.image). Off until it's added. */
  showHowWeWorkImage: false,
  /** Hero background, one of `hero.images`. */
  heroImage: 'blueprint' as HeroImageKey,
  /**
   * true = keep search engines out: adds <meta name="robots" content="noindex"> and a
   * disallow-all robots.txt. false since the public launch on the real domain.
   */
  noindex: false,
};

/* ── Company & contact ────────────────────────────────────────────────────── */

export const company = {
  name: 'Turnkey Reno',
  legalName: 'Turnkey Reno LLC',
  slogan: 'You start, we finish.',
  /** Production URL, no trailing slash. Used for canonical, Open Graph, schema, robots.txt and the sitemap. */
  siteUrl: 'https://turnkeyrenollc.com',
  phoneDisplay: '(440) 337-5140',
  /** E.164 format, used for tel: links and schema. */
  phoneE164: '+14403375140',
  /** Shown in the estimate section and footer, and added to the schema. Leave empty to hide. */
  email: 'turnkeyrenousa@gmail.com',
  address: {
    street: '6545 Market Ave. North',
    suite: 'STE 100',
    city: 'Canton',
    region: 'OH',
    postalCode: '44721',
    country: 'US',
  },
  /** Shown as "Serving <serviceArea>" in the footer and estimate section. */
  serviceArea: 'Northeast Ohio',
  /** Regions listed as areaServed in the LocalBusiness schema. */
  areaServed: ['Northeast Ohio'],
};

/* ── Brand assets ─────────────────────────────────────────────────────────── */

/**
 * Logo files (paths relative to src/assets/). Generated as vectors by
 * scripts/build-logo.mjs from the client's originals in src/assets/brand/.
 *   dark  = for dark backgrounds (white text)
 *   light = for light backgrounds (dark text)
 */
export const brand = {
  logo: {
    alt: 'Turnkey Reno',
    /** Original layout with tagline: footer and large uses. */
    full: { dark: 'brand/logo-full-dark.svg', light: 'brand/logo-full-light.svg' },
    /** Original layout without tagline. */
    compact: { dark: 'brand/logo-compact-dark.svg', light: 'brand/logo-compact-light.svg' },
    /** One-line horizontal lockup: mark + "TURNKEY RENO". Most legible at header sizes. */
    lockup: { dark: 'brand/logo-lockup-dark.svg', light: 'brand/logo-lockup-light.svg' },
    /** Roof + window only: favicon-style icon. */
    icon: { dark: 'brand/logo-icon-dark.svg', light: 'brand/logo-icon-light.svg' },
  },
  /** Which logo the header uses. 'compact' is the original layout, but "RENO" gets small on phones. */
  headerLogo: 'lockup' as 'lockup' | 'compact',
  /** Raster logo in /public for search engines (schema.org). */
  schemaLogo: '/logo.png',
};

/* ── SEO ──────────────────────────────────────────────────────────────────── */

export const seo = {
  title: 'Turnkey Reno | Home Renovation & Remodeling in Northeast Ohio',
  description:
    'Northeast Ohio home renovation and remodeling for homeowners and real estate investors. Kitchens, bathrooms, basements, flooring and more. Call (440) 337-5140 for a free estimate.',
  /** Path inside /public. Built by scripts/build-logo.mjs (1200×630). */
  ogImage: '/og-image.png',
  ogImageAlt: 'Turnkey Reno: home renovation in Northeast Ohio',
  locale: 'en_US',
  themeColor: '#070e1a',
};

/* ── Navigation ───────────────────────────────────────────────────────────── */

// Header, mobile menu and footer quick links. "Projects" and "How We Work" share a slot:
// whichever section is on the page (settings.showProjects) is listed.
export const nav = [
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#about' },
  settings.showProjects ? { label: 'Projects', href: '#projects' } : { label: 'How We Work', href: '#how-we-work' },
  { label: 'Tips', href: '#tips' },
  { label: 'Contact', href: '#estimate' },
];

/* ── Hero ─────────────────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: 'Northeast Ohio Home Renovation',
  // The headline is company.slogan. Text after the comma is highlighted.
  subheading:
    "Full-service home renovation for homeowners and real estate investors across Ohio's suburbs. We plan your project around your budget, bring creative solutions to the table, and stay on the job until you're 100% satisfied.",
  primaryCta: 'Get a Free Estimate',
  secondaryCta: 'Call Now',
  highlights: ['Free, no-obligation estimates', 'Budget-based planning', 'Homeowners & investors'],
  /**
   * Background options; `settings.heroImage` picks one. `alt` stays empty (decorative background).
   * `position` is the CSS object-position (focal point) on phones and on desktop (≥ 1024px).
   * To add a photo option: only the company's own photo or licensed stock (credited in
   * src/assets/stock/CREDITS.md), ideally ≥ 2400px wide. Raster photos get a navy overlay that
   * keeps all hero text at WCAG AA; re-check contrast for a much brighter photo.
   */
  images: {
    // The blueprint illustration is the intended design for now (no placeholder badge).
    blueprint: {
      src: 'hero/hero.svg',
      alt: '',
      position: { mobile: '70% 50%', desktop: '70% 50%' },
      placeholder: false,
    },
  } satisfies Record<string, HeroImage>,
};

export interface HeroImage {
  src: string;
  alt: string;
  position: { mobile: string; desktop: string };
  /** Shows a "Placeholder" badge while settings.showPlaceholderBadges is true. */
  placeholder: boolean;
}
export type HeroImageKey = keyof typeof hero.images;

/* ── Trust strip ──────────────────────────────────────────────────────────── */

export type IconName =
  | 'clipboard' | 'tag' | 'award' | 'users' | 'paint' | 'kitchen' | 'bath'
  | 'stairs' | 'floor' | 'framing' | 'phone' | 'mail' | 'pin' | 'check'
  | 'arrow' | 'menu' | 'close' | 'chevronLeft' | 'chevronRight' | 'expand'
  | 'bulb' | 'message' | 'calendar';

export const trustPoints: { title: string; text: string; icon: IconName }[] = [
  { title: 'Free Estimates', text: 'No-cost, no-obligation quotes', icon: 'clipboard' },
  { title: 'Honest Pricing', text: 'Straightforward numbers you can plan around', icon: 'tag' },
  { title: 'Quality Materials', text: 'Products chosen to last', icon: 'award' },
  { title: 'Homeowners & Investors', text: 'Family homes, rentals and flips', icon: 'users' },
];

/* ── Services ─────────────────────────────────────────────────────────────── */

export const servicesIntro = {
  eyebrow: 'What we do',
  heading: 'Renovation services',
  text: 'From a single room to a full rehab, we plan every project around your goals and your budget, and handle the work that turns a house into the home, or the rental, you want.',
};

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  /** Optional photo at the top of the card (shown only when settings.showServiceImages is true). */
  image?: { src: string; alt: string };
  placeholder?: boolean;
}

export const services: Service[] = [
  {
    id: 'interior',
    title: 'Interior Remodeling',
    description: 'Full and partial interior updates (layouts, trim, finishes and paint) planned and managed from start to finish.',
    icon: 'paint',
  },
  {
    id: 'kitchen',
    title: 'Kitchen Remodeling',
    description: 'Cabinets, countertops, backsplash, lighting and layout changes for a kitchen that works the way you live.',
    icon: 'kitchen',
  },
  {
    id: 'bathroom',
    title: 'Bathroom Remodeling',
    description: 'Tile, vanities, fixtures and tub-to-shower conversions, from a quick refresh to a complete gut renovation.',
    icon: 'bath',
  },
  {
    id: 'basement',
    title: 'Basement Finishing',
    description: 'Turn an unused basement into a family room, home office, guest suite or extra rental space, finished right and built to stay dry.',
    icon: 'stairs',
  },
  {
    id: 'flooring',
    title: 'Flooring',
    description: 'Luxury vinyl plank, tile, laminate and hardwood, installed over a properly prepared, level subfloor.',
    icon: 'floor',
  },
  {
    id: 'drywall-framing',
    title: 'Drywall & Framing',
    description: 'New walls, repairs and finishing: framing, hanging, taping and texture done clean and straight.',
    icon: 'framing',
  },
];

/* ── About / Why choose us ────────────────────────────────────────────────── */

export const about = {
  eyebrow: 'Why choose us',
  heading: 'Done right, from start to finish.',
  paragraphs: [
    "We're a Northeast Ohio home renovation company serving homeowners and real estate investors across Ohio's suburbs. We specialize in residential renovation and remodeling, with a strong focus on quality workmanship, honest pricing and reliable service.",
    "Every project starts with listening. We sit down with you, plan the renovation around your goals and your budget, and bring creative solutions that get you more for your money. Then we stay on the job until it's done right and you're completely satisfied.",
  ],
  /**
   * Advantages grid: 2 columns × 4 rows on desktop, 1 column on mobile. Titles render uppercase.
   * Items with `enabled: false` are kept here but never rendered. Keep exactly 8 enabled items.
   */
  values: [
    { title: 'Creative, budget-based planning', text: 'We design the project with you, around the budget you set.' },
    { title: 'Transparent estimates', text: 'Detailed, honest pricing. No surprises halfway through.' },
    { title: 'One point of contact', text: 'One person who knows your project from first visit to final walkthrough.' },
    { title: 'Photo progress updates', text: 'Regular updates with photos, so you always know where things stand, even from out of state.' },
    { title: 'Investor-smart renovations', text: 'Upgrades chosen for return, whether you plan to rent or sell.' },
    { title: 'On schedule', text: 'Realistic timelines, and we stick to them.' },
    { title: 'Clean, respectful job sites', text: 'We treat your home like our own and clean up every day.' },
    { title: 'We stand behind our work', text: "We stay on the job until it's done right and you're satisfied." },
    // Re-enable only once the client has an actual contractor license and insurance.
    // To re-enable: set `enabled: true` here and disable "We stand behind our work" above (keeps 8 items).
    { title: 'Licensed, insured & guaranteed', text: "We stand behind our work until you're satisfied.", enabled: false },
  ] as { title: string; text: string; enabled?: boolean }[],
  ctaText: 'Talk to us about your project',
  /** Large faint outlined word behind the section (desktop only, decorative). Empty string hides it. */
  watermark: 'Built Right',
};

/* ── How we work (shown while the Projects gallery is off) ───────────────────── */

// PENDING CLIENT APPROVAL: How We Work copy (heading, intro and the four steps).
export const howWeWork = {
  eyebrow: 'How we work',
  heading: 'From first call to final walkthrough',
  text: 'A simple, transparent process, so you know what happens next at every stage of your renovation.',
  steps: [
    { title: 'Free Estimate', text: 'We visit, listen and give you a clear, detailed quote.', icon: 'clipboard' },
    { title: 'Budget-Based Plan', text: 'We plan the project around your goals and the budget you set.', icon: 'tag' },
    { title: 'Build with Updates', text: 'One point of contact and regular photo progress updates.', icon: 'message' },
    { title: 'Final Walkthrough', text: "We finish when it's done right and you're satisfied.", icon: 'award' },
  ] satisfies { title: string; text: string; icon: IconName }[],
  /**
   * Optional side image, shown only when settings.showHowWeWorkImage is true. Licensed stock or the
   * company's own photo only: put it in src/assets/stock/ and add its entry to CREDITS.md there.
   */
  image: { src: '', alt: '' },
};

/* ── Projects gallery (off: settings.showProjects) ───────────────────────────── */

export const projectsIntro = {
  eyebrow: 'Our work',
  heading: 'Projects',
  text: 'Before-and-after photos of our completed projects.',
};

export interface ProjectImage {
  /** Path relative to src/assets/ (jpg, png, webp, avif or svg). */
  src: string;
  /** Describes what the photo shows, for screen readers and search engines. */
  alt: string;
}

export interface Project {
  id: string;
  title: string;
  workType: string;
  /** City without the state, e.g. 'North Canton'. Caption: "Work type · City, OH"; empty = work type only. */
  city: string;
  before: ProjectImage[];
  after: ProjectImage[];
  /** true = before and after are taken from the same angle → interactive comparison slider. */
  matchedPair: boolean;
  /** The featured project gets the large card (first enabled featured project). */
  featured?: boolean;
  /** false = kept in data but never rendered. */
  enabled?: boolean;
}

/** Caption text: "Work type · City, OH", or just the work type until the city is known. */
export const projectCaption = (p: Project) => (p.city ? `${p.workType} · ${p.city}, OH` : p.workType);

/*
 * Re-enable only with photos of Turnkey Reno's own completed projects (legal: no photos of
 * other companies' work). Put the photos in src/assets/projects/<id>/, add entries like the
 * example below, then set settings.showProjects to true.
 *
 *   {
 *     id: 'kitchen-north-canton',
 *     title: 'Kitchen Remodel',
 *     workType: 'Kitchen Remodel',
 *     city: 'North Canton',
 *     matchedPair: true, // same angle before and after → comparison slider
 *     featured: true,
 *     before: [{ src: 'projects/kitchen-north-canton/before-1.jpg', alt: 'What the before photo shows' }],
 *     after: [{ src: 'projects/kitchen-north-canton/after-1.jpg', alt: 'What the after photo shows' }],
 *   },
 */
export const projects: Project[] = [];

/* ── Tips corner ──────────────────────────────────────────────────────────── */

export const tipsIntro = {
  eyebrow: 'Tips corner',
  heading: 'Before you renovate',
  text: 'Practical advice from the job site for homeowners and investors planning their next project.',
};

/** Tips grid: 3 columns × 2 rows on desktop, 1 column on mobile. `tag` is the small category label. */
export const tips: { tag: string; title: string; body: string; placeholder?: boolean }[] = [
  {
    tag: 'Budget',
    title: 'Build a cushion into your budget',
    body: 'Plan for 10–15% beyond your estimate. Older homes can hide surprises behind walls and under floors, and a cushion keeps the project moving.',
  },
  {
    tag: 'Planning',
    title: 'Pick finishes before work starts',
    body: 'Choosing tile, fixtures and flooring up front keeps the schedule on track and avoids costly mid-project changes.',
  },
  {
    tag: 'Investors',
    title: 'Investors: renovate for durability',
    body: 'Tough, easy-to-clean materials like luxury vinyl plank and quality paint reduce turnover costs between tenants.',
  },
  {
    tag: 'Ohio Homes',
    title: 'Fix water issues first',
    body: 'In Ohio, basement moisture is common. Before finishing a basement or replacing floors, make sure gutters, grading and drainage are handled, or the problem comes back.',
  },
  {
    tag: 'Seasonal',
    title: 'Plan around the seasons',
    body: 'Exterior work like roofing, siding and painting is best done spring through fall. Winter is a great time for kitchens, baths and basements.',
  },
  {
    tag: 'Value',
    title: 'Spend where it counts',
    body: 'Kitchens, bathrooms and fresh flooring usually return the most when you sell or rent. Start there before cosmetic extras.',
  },
];

/* ── Free estimate form ───────────────────────────────────────────────────── */

export const estimate = {
  eyebrow: 'Free estimate',
  heading: 'Tell us about your project',
  text: "Send us a few details and we'll get back to you to talk through your project and set up your free estimate.",
  steps: [
    { title: 'Send your request', text: 'Fill out the form or give us a call.' },
    { title: 'We reach out', text: 'We contact you to discuss the details.' },
    { title: 'Get your estimate', text: 'A clear, detailed quote built around your budget. Free, with no obligation.' },
  ],
  /** Optional form fields. Values are sent with the request exactly as written. */
  customerTypes: ['Homeowner', 'Real estate investor'],
  budgets: ['Under $10k', '$10k–$25k', '$25k–$50k', '$50k+', 'Not sure'],
  submitLabel: 'Request My Free Estimate',
  privacyNote: 'We only use your information to respond to your request.',
  sendingLabel: 'Sending...',
  successMessage: 'Thanks! We received your request and will contact you soon.',
  /** `{phone}` is replaced with a tap-to-call link to company.phoneDisplay. */
  errorMessage: "Sorry, your request didn't go through. Please try again, or call us at {phone}.",
  /**
   * Shown instead of sending while form.web3formsKey is empty. `{phone}` becomes a tap-to-call link,
   * `{email}` a mailto link pre-filled with what the visitor typed.
   */
  notConnectedMessage:
    "Online requests are almost ready. In the meantime, call us at {phone} or email {email} and we'll set up your free estimate.",
};

/**
 * Form backend: Web3Forms (web3forms.com). Submissions are emailed to the address
 * the access key was created with.
 * While the key is empty the form is not connected: a valid submit shows
 * `estimate.notConnectedMessage` and nothing is sent.
 * The access key is meant to be public (it ends up in the page HTML), so it lives here
 * rather than in an environment variable.
 */
export const form = {
  web3formsKey: 'e2dd65fa-aaa0-41e7-8b22-78ca594ec7dd',
};

/* ── Footer ───────────────────────────────────────────────────────────────── */

export const footer = {
  blurb: 'Residential renovation and remodeling for homeowners and real estate investors across Northeast Ohio.',
};
