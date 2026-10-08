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
  email: '', // e.g. 'info@turnkeyreno.com'. Leave empty to hide.
  address: {
    street: '6545 Market Ave. North',
    suite: 'STE 100',
    city: 'Canton',
    region: 'OH',
    postalCode: '44721',
    country: 'US',
  },
  serviceArea: 'Cleveland, OH and surrounding suburbs',
  /** Cities listed as areaServed in the LocalBusiness schema. */
  areaServed: ['Cleveland, OH'],
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
  title: 'Turnkey Reno | Home Renovation & Remodeling in Cleveland, OH',
  description:
    'Cleveland home renovation and remodeling for homeowners and real estate investors. Kitchens, bathrooms, basements, flooring and more. Call (440) 337-5140 for a free estimate.',
  /** Path inside /public. Replace with a real 1200×630 PNG or JPG before launch. */
  ogImage: '/og-image.png',
  ogImageAlt: 'Turnkey Reno: home renovation in Cleveland, Ohio',
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
  eyebrow: 'Cleveland Home Renovation',
  // The headline is company.slogan. Text after the comma is highlighted.
  subheading:
    'Renovation and remodeling for homeowners and real estate investors across Cleveland and the surrounding suburbs, done right from start to finish.',
  primaryCta: 'Get a Free Estimate',
  secondaryCta: 'Call Now',
  highlights: ['Free, no-obligation estimates', 'Homeowners & investors'],
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
  text: 'From a single room to a full rehab, we handle the work that turns a house into the home, or the rental, you want.',
};

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  placeholder?: boolean;
}

export const services: Service[] = [
  {
    id: 'interior',
    title: 'Interior Remodeling',
    description: 'Full and partial interior updates (layouts, trim, finishes and paint) planned and managed from start to finish.',
    icon: 'paint',
    placeholder: true,
  },
  {
    id: 'kitchen',
    title: 'Kitchen Remodeling',
    description: 'Cabinets, countertops, backsplash, lighting and layout changes for a kitchen that works the way you live.',
    icon: 'kitchen',
    placeholder: true,
  },
  {
    id: 'bathroom',
    title: 'Bathroom Remodeling',
    description: 'Tile, vanities, fixtures and tub-to-shower conversions, from a quick refresh to a complete gut renovation.',
    icon: 'bath',
    placeholder: true,
  },
  {
    id: 'basement',
    title: 'Basement Finishing',
    description: 'Turn unused basement space into a family room, home office, guest suite or extra rental living area.',
    icon: 'stairs',
    placeholder: true,
  },
  {
    id: 'flooring',
    title: 'Flooring',
    description: 'Luxury vinyl plank, tile, laminate and hardwood, installed over a properly prepared, level subfloor.',
    icon: 'floor',
    placeholder: true,
  },
  {
    id: 'drywall-framing',
    title: 'Drywall & Framing',
    description: 'New walls, repairs and finishing: framing, hanging, taping and texture done clean and straight.',
    icon: 'framing',
    placeholder: true,
  },
];

/* ── About / Why choose us ────────────────────────────────────────────────── */

export const about = {
  eyebrow: 'Why choose us',
  heading: 'Done right, from start to finish.',
  paragraphs: [
    'We are a Cleveland-based home renovation company serving homeowners and investors throughout Cleveland and the surrounding suburbs. We specialize in residential renovations and remodeling, with a strong focus on quality workmanship, honest pricing, and reliable service.',
    'We believe every project should be done right from start to finish. We pay attention to the details, use quality materials, and stand behind our work. Our goal is to provide a smooth, professional experience and results our customers can be proud of.',
  ],
  values: [
    { title: 'Quality workmanship', text: 'Attention to the details that make a renovation last.' },
    { title: 'Honest pricing', text: 'Clear estimates and straightforward communication.' },
    { title: 'Reliable service', text: 'We keep you informed and see the job through.' },
    { title: 'We stand behind our work', text: 'Results you can be proud of, built with quality materials.' },
  ],
  ctaText: 'Talk to us about your project',
  /** Large faint outlined word behind the section (desktop only, decorative). Empty string hides it. */
  watermark: 'Built Right',
};

/* ── Projects gallery ─────────────────────────────────────────────────────── */

export const projectsIntro = {
  eyebrow: 'Our work',
  heading: 'Projects',
  text: 'A look at the kind of renovations we take on. Tap any photo to view it larger.',
};

export interface Project {
  /** Path relative to src/assets/ (jpg, png, webp, avif or svg). */
  image: string;
  alt: string;
  caption: string;
  placeholder?: boolean;
}

export const projects: Project[] = [
  { image: 'projects/project-1.svg', alt: 'Placeholder for a kitchen remodel photo', caption: 'Kitchen Remodel', placeholder: true },
  { image: 'projects/project-2.svg', alt: 'Placeholder for a bathroom renovation photo', caption: 'Bathroom Renovation', placeholder: true },
  { image: 'projects/project-3.svg', alt: 'Placeholder for a finished basement photo', caption: 'Basement Finishing', placeholder: true },
  { image: 'projects/project-4.svg', alt: 'Placeholder for a flooring installation photo', caption: 'Flooring Installation', placeholder: true },
  { image: 'projects/project-5.svg', alt: 'Placeholder for an interior remodel photo', caption: 'Interior Remodel', placeholder: true },
  { image: 'projects/project-6.svg', alt: 'Placeholder for an open living space photo', caption: 'Open Living Space', placeholder: true },
  { image: 'projects/project-7.svg', alt: 'Placeholder for a tiled shower photo', caption: 'Walk-in Shower', placeholder: true },
  { image: 'projects/project-8.svg', alt: 'Placeholder for a drywall and framing photo', caption: 'Drywall & Framing', placeholder: true },
];

/* ── Tips corner ──────────────────────────────────────────────────────────── */

export const tipsIntro = {
  eyebrow: 'Tips corner',
  heading: 'Before you renovate',
  text: 'Practical advice for homeowners and investors planning their next project.',
};

export const tips: { title: string; body: string; placeholder?: boolean }[] = [
  {
    title: 'Build a cushion into your budget',
    body: 'Plan for 10–15% beyond your estimate. Older homes can hide surprises behind walls and under floors, and a cushion keeps the project moving.',
    placeholder: true,
  },
  {
    title: 'Pick finishes before work starts',
    body: 'Choosing tile, fixtures and flooring up front keeps the schedule on track and avoids costly mid-project changes.',
    placeholder: true,
  },
  {
    title: 'Investors: renovate for durability',
    body: 'Tough, easy-to-clean materials like luxury vinyl plank and quality paint reduce turnover costs between tenants.',
    placeholder: true,
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
    { title: 'Get your estimate', text: 'A clear, honest quote. Free, with no obligation.' },
  ],
  submitLabel: 'Request My Free Estimate',
  privacyNote: 'We only use your information to respond to your request.',
  successMessage: "Thanks! Your request was sent. We'll be in touch soon.",
  errorMessage: 'Something went wrong sending your request. Please call us instead.',
  notConnectedMessage:
    'Preview mode: the form is not connected yet, so nothing was sent. Please call us to request your estimate.',
};

/**
 * Form backend. Leave `action` empty until the form service is set up.
 *  - Web3Forms: action 'https://api.web3forms.com/submit', accessKey from web3forms.com,
 *               honeypotName 'botcheck'
 *  - Formspree: action 'https://formspree.io/f/<your-id>', accessKey '', honeypotName '_gotcha'
 */
export const formConfig = {
  action: '',
  accessKey: '',
  honeypotName: 'botcheck',
  /** Subject line for the notification email (Web3Forms reads the `subject` field). */
  subject: 'New free estimate request: Turnkey Reno website',
};

/* ── Footer ───────────────────────────────────────────────────────────────── */

export const footer = {
  blurb: 'Residential renovation and remodeling for homeowners and investors in Cleveland and the surrounding suburbs.',
};
