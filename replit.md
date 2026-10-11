# BlackSync.ai - AI Outbound Sales Colleague

## Overview
Landing page for BlackSync.ai — an AI voice agent platform that makes outbound calls, qualifies leads, and books appointments automatically. Serves real estate agents, mortgage brokers, insurance agents, home services companies, and more.

Two conversion paths:
- **Self-serve**: Sign up, pay $98 or $296/mo, use the platform
- **Enterprise**: Fill out form, get custom plan

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Express.js with in-memory storage
- **Routing**: wouter (frontend), Express (backend API)
- **Payments**: Stripe (checkout sessions for Solo $98/mo and Team $296/mo)

## Pages
- `/` - Main landing page (Hero → TrustStrip → Products → AIModels → HowItWorks → Why → Testimonials → Pricing → Enterprise → FinalCTA → Footer)
- `/pricing` - Standalone pricing page
- `/signup` - Placeholder signup page
- `/login` - Placeholder login page
- `/dashboard` - Placeholder dashboard page
- `404` - Not found page

## Key Components
- `components/navbar.tsx` - Fixed nav with mega-menu. Product (4 cols: Capture Leads, Qualify & Call, Book & Close, Scale). Industries (sidebar-style with right panel changing on hover). Resources (Blog, Docs, Changelog, Case Studies, Help Center). Always-visible dual CTAs.
- `components/hero-section.tsx` - Mailsuite-style email input CTA, eyebrow badge with AI model names, stats (10K+ calls, 847 appts, 11s response, 4.9★)
- `components/trust-strip.tsx` - Integration logos (FUB, Sierra, kvCORE, Calendly, Zapier, etc.) + trust badges (SOC 2, HIPAA, GDPR, 40+ Languages)
- `components/products-section.tsx` - Industry cards (Real Estate, Insurance, Mortgage)
- `components/ai-models-section.tsx` - 15 AI model cards with Speed/Accuracy/Efficiency bars, Premium badges, no prices
- `components/how-it-works-section.tsx` - 4 steps: Connect Leads, AI Builds Agent, Calls & Qualifies, Calendar Booking
- `components/why-section.tsx` - AI vs Human ISA comparison (9 rows) + 6 advantage cards
- `components/testimonials-section.tsx` - 3 testimonials (James R., Sarah T., Marcus K.)
- `components/pricing-section.tsx` - 3 plans (Solo $98, Team $296, Enterprise custom) + Credits (500/$139, 1000/$260, 2500/$599) + Add-ons (Expert Dev Build, Workflow Automation, CRM Sync + Agentic AI)
- `components/enterprise-section.tsx` - Two-column: copy + lead capture form with dropdowns (industry, team size, monthly leads, referral source)
- `components/final-cta-section.tsx` - Bottom CTA with email input
- `components/footer.tsx` - 4 columns (BlackSync, Product, Company, Legal) + trust badges bottom bar
- `components/theme-provider.tsx` - Light mode default, dark mode toggle

## API Endpoints
- `POST /api/leads` - Submit hero/CTA qualifying lead (name, email, + optional phone, company, industry, teamSize, useCase). Syncs to Twenty CRM.
- `POST /api/enterprise-leads` - Submit enterprise form lead (firstName, lastName, email, company, industry, teamSize, monthlyLeads, referralSource, + optional phone, useCase). Syncs to Twenty CRM.
- `POST /api/checkout` - Create Stripe checkout session (requires STRIPE_SECRET_KEY)

## Twenty CRM Sync (server/routes.ts → syncLeadToTwenty)
- Base URL: `https://blacksync.twenty.com/rest` (Bearer TWENTY_API_KEY). Fire-and-forget on both lead endpoints.
- Creates a Person: `{name:{firstName,lastName}, emails:{primaryEmail}, phones:{primaryPhoneNumber}}` (phone only when provided).
- Creates an Opportunity: name = "[Industry] - [Company or Email]", `stage:"NEW"`.
- When teamSize or useCase present, creates a Note (`title`, `bodyV2.markdown` with name/email/phone/company/industry/team size/use case) and links it to the opportunity via `POST /rest/noteTargets {noteId, targetOpportunityId}`.
- `industryLabel()` maps known industry slugs (e.g. "real-estate", "mortgage") to display labels; unknown values pass through unchanged.

## Theme — Design System v2 ("Light + Bold Contrast")
- Direction: warm-white canvas, near-black bold display headlines, generous whitespace,
  crisp 1px borders, ONE bold terracotta accent used sparingly, real layered shadows.
  Vercel/Linear marketing energy. Full spec in `DESIGN.md`.
- Light mode: Background warm white `hsl(40 33% 99%)`, Foreground warm near-black
  `hsl(22 16% 11%)`, Primary bold terracotta `hsl(14 76% 49%)`, Accent soft peach.
- Dark mode: warm near-black surfaces with brighter terracotta accent (toggle supported).
- Typography: `font-display` Space Grotesk (headings), `font-sans` Geist (body),
  `font-mono` Geist Mono (uppercase eyebrows), `font-serif` Playfair (rare italic).
- Shared section primitives in `client/src/components/ui/section.tsx`:
  `Eyebrow`, `Reveal` (scroll fade-up), `SectionHeading`.
- Key utilities (index.css): `.text-accent-grad`, `.eyebrow`, `.hero-gradient`,
  `.grid-bg`, `.dot-bg`, `.card-glow`, `.animate-marquee`, `.text-balance`.

## Stripe Integration
- Not yet connected. Set STRIPE_SECRET_KEY environment variable when ready.
- Solo plan: $98/mo (price ID: "solo"), Team plan: $296/mo (price ID: "team")
- Both include 7-day free trial

## Key Numbers
- Trial: 7 days
- Solo: $98/mo, Team: $296/mo, Enterprise: Custom
- Credits: $139 / $260 / $599
- Phone number: from $3.50/mo
- Response time: 11 seconds
- Calls: 10K+, Appointments: 847, Rating: 4.9★
- Languages: 40+, AI Models: 15

## Data Model
- `leads`: id, name, email, company, message, phone, industry, teamSize, useCase, createdAt (phone/industry/teamSize/useCase optional)
- `enterprise_leads`: id, createdAt, firstName, lastName, email, company, industry, teamSize, monthlyLeads, referralSource, phone, useCase (phone/useCase optional)

## Domains
- blacksync.ai
- blacksync.network
- whispers.one
