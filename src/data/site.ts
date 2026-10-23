/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT: the single source of truth for all business content.
 *
 *  Edit text, contact details, services, projects and tips here.
 *  Components read from this file; you shouldn't need to touch them.
 *
 *  Images are referenced by path RELATIVE TO src/assets/
 *  (e.g. "projects/kitchen.jpg"). JPG, PNG, WebP, AVIF and SVG all work;
 *  raster photos are resized and converted to WebP at build time.
 *
 *  Items with `placeholder: true` show a small "Placeholder" badge on the page
 *  while `settings.showPlaceholderBadges` is true. Replace the content, then
 *  remove the flag (or turn the badges off globally).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ── Global switches ──────────────────────────────────────────────────────── */

export const settings = {
  /** Show "Placeholder" badges on unfinished content (useful on preview deploys). */
  showPlaceholderBadges: true,
  /** Enable once every service card has a photo, so the grid stays consistent. */
  showServiceImages: false,
  /**
   * Keep search engines out until launch: adds <meta name="robots" content="noindex">
   * and a disallow-all robots.txt. Set to false at launch (together with siteUrl).
   */
  noindex: true,
};

/* ── Company & contact ────────────────────────────────────────────────────── */

export const company = {
  name: 'Turnkey Reno',
  legalName: 'Turnkey Reno',
  slogan: 'You start, we finish.',
  /** Production URL, no trailing slash. Used for canonical, Open Graph and schema. */
  siteUrl: 'https://example.com',
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

export const nav = [
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#about' },
  { label: 'Projects', href: '#projects' },
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
  image: {
    src: 'hero/hero.svg', // placeholder: replace with a wide project photo (≥ 2400px)
    alt: '',              // decorative background; leave empty unless it conveys information
    placeholder: true,
  },
};

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
    // File is in src/assets/_disabled/ (not shipped); move it out before enabling service images.
    image: { src: '_disabled/projects/basement-foundation/after-1.jpg', alt: 'Clean, painted basement block wall with a gray floor' },
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

/* ── Projects gallery ─────────────────────────────────────────────────────── */

export const projectsIntro = {
  eyebrow: 'Our work',
  heading: 'Projects',
  text: 'Real projects, real results. Click or tap any photo to see the full transformation.',
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
 * Photos are cropped from the client's composites and the roof reel by
 * scripts/extract-project-photos.mjs (sources in src/assets/projects/source/, never shipped).
 */
export const projects: Project[] = [
  {
    id: 'attic-bedroom',
    title: 'Attic Bedroom Makeover',
    workType: 'Bedroom Remodel',
    city: '', // client to confirm city
    matchedPair: true,
    featured: true,
    before: [
      {
        src: 'projects/attic-bedroom/before-1.jpg',
        alt: 'Attic bedroom before the remodel: textured sloped ceiling, dated wood paneling, worn wood floor and old furniture',
      },
    ],
    after: [
      {
        src: 'projects/attic-bedroom/after-1.jpg',
        alt: 'Attic bedroom after the remodel: smooth white sloped ceiling, gray painted paneling, new plank flooring and a window at the far end',
      },
    ],
  },
  {
    id: 'roof-replacement',
    title: 'Roof Replacement',
    workType: 'Roofing',
    city: '', // client to confirm city
    matchedPair: false,
    before: [
      { src: 'projects/roof-replacement/before-1.jpg', alt: 'Old roof before replacement: worn gray shingles and a weathered ridge cap with moss along its edge' },
      { src: 'projects/roof-replacement/before-2.jpg', alt: 'Old roof before replacement: deteriorated shingles along the edge next to the gutter' },
      { src: 'projects/roof-replacement/before-3.jpg', alt: 'Old roof before replacement: a broken, crumbling shingle with a gap, a hand pointing to the damage' },
    ],
    after: [
      { src: 'projects/roof-replacement/after-1.jpg', alt: 'New roof after replacement: rows of new architectural shingles under a blue sky' },
      { src: 'projects/roof-replacement/after-2.jpg', alt: 'New roof after replacement: new shingles with neighboring houses in the background' },
    ],
  },
  {
    // Images look computer-generated; re-enable only if the client confirms these are photos of his own job.
    // Its files live in src/assets/_disabled/ (excluded from the build): move them to src/assets/projects/ when enabling.
    id: 'basement-foundation',
    title: 'Basement Foundation Repair',
    workType: 'Basement',
    city: '', // client to confirm city
    matchedPair: false,
    enabled: false,
    before: [{ src: '_disabled/projects/basement-foundation/before-1.jpg', alt: 'Basement block wall with peeling paint and water stains' }],
    after: [{ src: '_disabled/projects/basement-foundation/after-1.jpg', alt: 'Clean, painted basement block wall with a gray floor' }],
  },
  {
    id: 'concrete-walkway',
    title: 'Concrete Walkway',
    workType: 'Concrete',
    city: '', // client to confirm city
    matchedPair: false,
    before: [
      { src: 'projects/concrete-walkway/before-1.jpg', alt: 'Side of the house before the walkway: grass, gravel and a downspout along the brick foundation' },
    ],
    after: [
      { src: 'projects/concrete-walkway/after-1.jpg', alt: 'Side of the house after the work: a freshly poured concrete walkway along the foundation, still in its wooden forms' },
    ],
  },
];

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
  notConnectedMessage:
    'Preview mode: the form is not connected yet, so nothing was sent. Please call us to request your estimate.',
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
  web3formsKey: '',
};

/* ── Footer ───────────────────────────────────────────────────────────────── */

export const footer = {
  blurb: 'Residential renovation and remodeling for homeowners and real estate investors across Northeast Ohio.',
};
