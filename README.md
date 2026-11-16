# Jumandambs: Event Grounds, Tent Hire & Catering

A single-page React app for an outdoor event grounds, tent hire and catering company. All state lives in the browser, with no backend.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

**Stack:** Vite 8, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Base UI: Dialog, Sheet, Tabs, Accordion, Calendar, Carousel, Sonner), lucide-react.

## What's in it
- **Hero:** quick availability check (event type, date, guests) that tests real per-ground bookings and pre-fills the quote builder.
- **Grounds:** tabs for 3 grounds, a spec grid, and a photo-gallery modal with carousel and thumbnails.
- **Events:** six event types, each with its own layouts and a "Plan a …" button that pre-fills the quote.
- **Catering:** three tier cards with a guest-count slider and a comparison table.
- **Tent hire:** five tents with quantity steppers, plus add-ons. Everything feeds the same quote.
- **Quote builder** (`src/components/QuoteBuilder.tsx`), in 5 steps:
  - date picker that blocks fully booked days and marks partly booked ones
  - grounds disabled when already booked or too small
  - catering cost = rate × guests
  - tents marked "included" with Premium, plus an auto-fit button
  - live itemised sidebar with 16% VAT and a 30% deposit
  - validated contact form, then a confirmation modal with a printable and downloadable receipt
- **Gallery** (filterable masonry with lightbox), **testimonial carousel**, **FAQ accordion**, **footer** (map, hours, WhatsApp, socials).
- **Admin demo** (footer link):
  - view bookings, then approve, decline or delete them; approving blocks the date and checks for conflicts
  - edit every price live
  - data is stored in `localStorage` (`jd.bookings.v1`, `jd.prices.v1`)

## Edit content
- All copy, prices, tents, FAQs and photos: `src/data.ts`.
- Pricing rules: `src/lib/pricing.ts`.
- **Placeholders to replace before launch:**
  - phone/WhatsApp `+254 700 000 000`, email, address (`src/components/Footer.tsx`)
  - social links (currently `#`)
  - testimonials (sample copy)

## Credits
- Photos: [Unsplash](https://unsplash.com) contributors, including Pedro Pulido, Malia Moore, Brunxs, Bruno Ngarukiye, Volodymyr Lymariev, Steven Van Elk, Jacques Dillies, Photos by Lanty, Gez Xavier Mansfield, Robin De Kesel, Shannon Elizabeth, Nadia Valko, Nils Stahl, Jordan Arnold, Al Elmes, Camera Crew, Keith Luke, Saile Ilyas, Yukiko Kanada, Tim Cooper, engin akyurt and Halima Bouchouicha.
- Motion specs: Motion Prompt #007, #063, #074, #075, #081, #082 · MIT License (c) 2026 Shohei Ohtaki · https://showheyohtaki.github.io/motion-prompt/
