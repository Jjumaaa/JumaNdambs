// Photos: Unsplash (free licence). Credits listed in README.
const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`
export const img = u

export const PHOTOS = {
  heroTable: "1782038523014-831222a83f32",
  lakeCeremony: "1758810411905-04fb6f9396e1",
  banquet: "1762216444265-a675abbb48dd",
  candleTable: "1524777313293-86d2ab467344",
  floralTables: "1758810744028-689670b0877c",
  lemonTable: "1758810742964-15b01b8a78bf",
  setTable: "1758810743028-6b8e150ec98f",
  blueNapkins: "1758810744307-8d85165074d1",
  tentPark: "1675376616537-c8aa9ddc9977",
  tentReception: "1775476793931-cb484f197760",
  canopyTent: "1519226612673-73c0234437ef",
  fieldTent: "1702522320629-020c8bc70a1b",
  whiteTentField: "1655893818457-2226f5123c33",
  nightLawn: "1622081627652-bc2fcb2e67df",
  candleDinner: "1562050344-f7ad946cee35",
  wineGlasses: "1484156818044-c040038b0719",
  plateSetting: "1522413452208-996ff3f3e740",
  toast: "1527529482837-4698179dc6ce",
  gradBalloons: "1758682016275-59c2dd2e0aee",
  gradConfetti: "1527269534026-c86f4009eace",
  buffet: "1555244162-803834f70033",
  foodVariety: "1576842546422-60562b9242ae",
  grazing: "1564638305579-5e395c9b62c7",
  buffetSpread: "1662982696492-057328dce48b",
  lake: "1668062841330-948ed522e477",
  lake2: "1668062841337-add374170a08",
} as const

export const CURRENCY = "KSh"
export const fmt = (n: number) => `${CURRENCY} ${Math.round(n).toLocaleString("en-KE")}`

export type EventTypeId =
  | "wedding" | "graduation" | "engagement" | "milestone" | "shower" | "corporate"

export const EVENT_TYPES: {
  id: EventTypeId; name: string; short: string; blurb: string; layouts: string[]; photo: string
}[] = [
  { id: "wedding", name: "Weddings & Receptions", short: "Wedding", photo: PHOTOS.lakeCeremony,
    blurb: "Aisle-to-dance-floor setups with a separate ceremony lawn and reception marquee, so guests move once and never wait.",
    layouts: ["Ceremony aisle + reception flip", "Long banquet or round tables", "Sweetheart table & dance floor"] },
  { id: "graduation", name: "Graduation Parties", short: "Graduation", photo: PHOTOS.gradConfetti,
    blurb: "From family lunches of 50 to whole-class celebrations of 600, with photo walls, speeches stage and buffet lines that keep moving.",
    layouts: ["Family garden lunch", "Large-scale marquee + stage", "Cap-toss photo zone"] },
  { id: "engagement", name: "Engagement & Traditional Ceremonies", short: "Engagement", photo: PHOTOS.floralTables,
    blurb: "Ruracio, ntheo, koito and proposal dinners: open seating for both families, a gifting area and room for the dance.",
    layouts: ["Two-family facing seating", "Gift & dowry procession lane", "Intimate proposal dinner"] },
  { id: "milestone", name: "Milestone Birthdays & Anniversaries", short: "Milestone", photo: PHOTOS.candleTable,
    blurb: "A 50th under string lights or a ruby anniversary dinner: one long candlelit table or a lounge-style garden party.",
    layouts: ["Candlelit long table", "Lounge & cocktail garden", "Surprise reveal entrance"] },
  { id: "shower", name: "Baby & Bridal Showers", short: "Shower", photo: PHOTOS.lemonTable,
    blurb: "Daytime garden parties with pastel décor, a dessert table, games area and a gazebo for the guest of honour.",
    layouts: ["Garden tea party", "Gazebo & gift corner", "Brunch grazing table"] },
  { id: "corporate", name: "Corporate Retreats & Gala Dinners", short: "Corporate", photo: PHOTOS.tentReception,
    blurb: "Breakout lawns by day, a black-tie gala by night. PA, projection, backup power and parking for coaches.",
    layouts: ["Team-building lawns", "Plenary marquee + AV", "Black-tie gala dinner"] },
]

export type Ground = {
  id: string; name: string; tagline: string; description: string; price: number
  capacity: number; sqft: number; parking: number; suites: string; photoZones: string
  power: string; washrooms: string; photos: string[]
}

export const GROUNDS: Ground[] = [
  { id: "garden", name: "The Grand Garden Lawn", tagline: "Our flagship lawn for big days", price: 250000,
    description: "Two acres of manicured kikuyu lawn framed by jacaranda and bougainvillea, with a flat terrace for a 500-guest marquee and a separate ceremony garden.",
    capacity: 800, sqft: 87000, parking: 220, suites: "Bridal suite + groom's lounge",
    photoZones: "Rose arch, fountain walk, jacaranda avenue", power: "150 kVA silent generator, auto-switchover",
    washrooms: "VIP block + 2 luxury trailers",
    photos: [PHOTOS.tentPark, PHOTOS.banquet, PHOTOS.floralTables, PHOTOS.setTable, PHOTOS.nightLawn] },
  { id: "courtyard", name: "The Courtyard Pavilion", tagline: "Covered, intimate, rain-proof", price: 120000,
    description: "A stone-paved courtyard under a permanent timber pavilion, with café lights, an olive tree centrepiece and a built-in bar. Perfect when the forecast is uncertain.",
    capacity: 180, sqft: 12500, parking: 60, suites: "Shared dressing suite",
    photoZones: "Olive tree, stone archway, lantern wall", power: "60 kVA generator + solar backup",
    washrooms: "Permanent block (6 stalls)",
    photos: [PHOTOS.candleTable, PHOTOS.candleDinner, PHOTOS.wineGlasses, PHOTOS.blueNapkins] },
  { id: "lakeside", name: "The Lakeside Meadow", tagline: "Water views & golden-hour light", price: 180000,
    description: "A wildflower meadow sloping to a quiet lake, with a timber jetty for vows and wide open space for stretch tents and lawn games.",
    capacity: 450, sqft: 54000, parking: 140, suites: "Lakeside bridal cottage",
    photoZones: "Jetty, willow bank, meadow path", power: "100 kVA generator, auto-switchover",
    washrooms: "2 luxury trailers + standard block",
    photos: [PHOTOS.lakeCeremony, PHOTOS.lake, PHOTOS.lake2, PHOTOS.whiteTentField, PHOTOS.lemonTable] },
]

export type TierId = "premium" | "regular" | "basic" | "none"
export type Tier = {
  id: Exclude<TierId, "none">; name: string; subtitle: string; perPlate: number
  idealFor: string; includes: string[]; excludes: string[]; note?: string; featured?: boolean
  includesTents: boolean; includesUtensils: boolean
}

export const TIERS: Tier[] = [
  { id: "premium", name: "Premium", subtitle: "All-inclusive luxury", perPlate: 3800, featured: true,
    idealFor: "Stress-free weddings and large formal events",
    includes: ["Professional chefs & uniformed serving staff", "High-end utensils, crockery & cutlery", "Crystal glassware & charger plates", "Full event tents / shelter for all guests"],
    excludes: [], includesTents: true, includesUtensils: true },
  { id: "regular", name: "Regular", subtitle: "Standard full-service", perPlate: 2400,
    idealFor: "Mid-sized graduations, parties & budget-conscious celebrations",
    includes: ["Professional chefs & serving staff", "Complete set of utensils", "Crockery & cutlery"],
    excludes: ["Tents (add separately)"], note: "Tents are not included, but you can add them in the next step.",
    includesTents: false, includesUtensils: true },
  { id: "basic", name: "Basic", subtitle: "Essential catering", perPlate: 1300,
    idealFor: "Intimate gatherings & hosts who own equipment",
    includes: ["Professional cooks / chefs", "Buffet preparation or drop-off option"],
    excludes: ["Utensils, crockery & cutlery", "Tents", "Serving staff"],
    note: "You provide utensils and tents, or choose food drop-off only.",
    includesTents: false, includesUtensils: false },
]

export const COMPARISON_ROWS: { label: string; premium: boolean | string; regular: boolean | string; basic: boolean | string }[] = [
  { label: "Professional chefs / cooks", premium: true, regular: true, basic: true },
  { label: "Serving staff", premium: "Uniformed, 1 per 15 guests", regular: "1 per 25 guests", basic: false },
  { label: "Utensils & chafing dishes", premium: true, regular: true, basic: false },
  { label: "Crockery & cutlery", premium: "Fine china", regular: "Standard", basic: false },
  { label: "Glassware", premium: "Crystal", regular: false, basic: false },
  { label: "Event tents / shelter", premium: true, regular: "Add-on", basic: "Add-on" },
  { label: "Drop-off option", premium: false, regular: false, basic: true },
]

export type Tent = {
  id: string; name: string; capacity: number; price: number; weather: string; desc: string; photo: string
}

export const TENTS: Tent[] = [
  { id: "stretch", name: "Stretch / Bedouin Tent", capacity: 100, price: 38000, photo: PHOTOS.whiteTentField,
    weather: "Waterproof PVC-coated fabric, 80 km/h wind rated", desc: "Free-flowing sculptural canopy that hugs the landscape. Open sides for garden parties." },
  { id: "highpeak", name: "High-Peak Marquee", capacity: 250, price: 85000, photo: PHOTOS.tentPark,
    weather: "Fully waterproof, guttered, sidewalls with windows", desc: "The classic wedding marquee: dramatic peaks, chandeliers optional, clear-span interior." },
  { id: "dome", name: "Dome Tent", capacity: 50, price: 22000, photo: PHOTOS.fieldTent,
    weather: "Waterproof, UV-blocking, zip-up doors", desc: "Geodesic dome for lounges, VIP bars or intimate dinners. Can be climate-controlled." },
  { id: "gazebo", name: "VIP Gazebo", capacity: 20, price: 9500, photo: PHOTOS.canopyTent,
    weather: "Waterproof roof, optional sidewalls", desc: "Shaded 5×5 m pavilion for the bridal party, gifts table or a family elders' corner." },
  { id: "pagoda", name: "Pagoda Tent", capacity: 500, price: 160000, photo: PHOTOS.tentReception,
    weather: "Modular aluminium frame, 100 km/h wind rated, fully sealed", desc: "Linkable pagoda modules for 500+ guests: graduations, galas and large receptions." },
]

export type Addon = { id: string; name: string; unit: string; price: number; perGuest?: boolean }

export const ADDONS: Addon[] = [
  { id: "chairs", name: "Chiavari banquet chairs", unit: "per chair", price: 250, perGuest: true },
  { id: "round", name: "Round tables (10 seats)", unit: "per table", price: 900 },
  { id: "rect", name: "Rectangular banquet tables", unit: "per table", price: 800 },
  { id: "linen", name: "Table linens & runners", unit: "per table", price: 650 },
  { id: "lighting", name: "Fairy-light & chandelier package", unit: "per event", price: 28000 },
  { id: "pa", name: "PA / sound system + MC mic", unit: "per event", price: 22000 },
]

export const GALLERY: { src: string; cat: "Weddings" | "Graduations" | "Tents & Decor" | "Catering"; alt: string; tall?: boolean }[] = [
  { src: PHOTOS.lakeCeremony, cat: "Weddings", alt: "Lakeside wedding ceremony with guests under parasols" },
  { src: PHOTOS.gradBalloons, cat: "Graduations", alt: "Graduation celebration with balloons and cake", tall: true },
  { src: PHOTOS.tentReception, cat: "Tents & Decor", alt: "Reception marquee with round tables and chairs" },
  { src: PHOTOS.buffet, cat: "Catering", alt: "Buffet line with silver chafing dishes" },
  { src: PHOTOS.heroTable, cat: "Weddings", alt: "Garden table with blush peonies" },
  { src: PHOTOS.grazing, cat: "Catering", alt: "Grazing table spread", tall: true },
  { src: PHOTOS.gradConfetti, cat: "Graduations", alt: "Graduates celebrating under confetti" },
  { src: PHOTOS.tentPark, cat: "Tents & Decor", alt: "White wedding marquee on a park lawn" },
  { src: PHOTOS.candleTable, cat: "Weddings", alt: "Main table with flowers and candle holders" },
  { src: PHOTOS.foodVariety, cat: "Catering", alt: "A variety of dishes on a table" },
  { src: PHOTOS.toast, cat: "Graduations", alt: "Guests raising glasses for a toast" },
  { src: PHOTOS.canopyTent, cat: "Tents & Decor", alt: "Canopy tent on a green field with guests" },
  { src: PHOTOS.setTable, cat: "Weddings", alt: "Beautifully set table with floral arrangements" },
  { src: PHOTOS.nightLawn, cat: "Tents & Decor", alt: "Lawn party at night under lights" },
  { src: PHOTOS.buffetSpread, cat: "Catering", alt: "Fresh breakfast buffet spread" },
]

export const TESTIMONIALS = [
  { name: "Wanjiru & Brian K.", event: "Wedding · Grand Garden Lawn · 420 guests", quote: "We booked the Premium package and genuinely did nothing on the day except get married. The marquee went up overnight, the food was hot for every one of our 420 guests, and the jacaranda photos are on our wall.", rating: 5 },
  { name: "Mrs. Achieng O.", event: "Graduation · Lakeside Meadow · 150 guests", quote: "Our daughter's graduation lunch was perfect. We took the Regular package plus one stretch tent, and the quote we got online was exactly what we paid. No surprises.", rating: 5 },
  { name: "David M.", event: "Groom · Courtyard Pavilion · 160 guests", quote: "It rained the whole afternoon and nobody noticed. The pavilion team moved the ceremony indoors in fifteen minutes and kept the bar open.", rating: 5 },
  { name: "Grace N.", event: "Ruracio · Grand Garden Lawn · 300 guests", quote: "Both families felt at home. They understood the procession, the seating and the timing of a traditional ceremony, and the nyama choma was the talk of the village.", rating: 5 },
  { name: "Kevin & Faith T.", event: "Joint graduation party · 600 guests", quote: "Two pagoda tents, a stage and a sound system for a whole-class party. The team handled the parking chaos like professionals.", rating: 4 },
]

export const FAQS = [
  { q: "How much is the deposit, and when is the balance due?", a: "A 30% deposit secures your date and grounds. The balance is due 14 days before the event. Deposits are refundable (less a 10% admin fee) if you cancel more than 90 days out; inside 90 days they can be moved to a new date within 12 months." },
  { q: "Can we bring outside vendors or our own caterer?", a: "Yes. You can bring your own photographer, décor and entertainment at no charge. Outside caterers are welcome on a grounds-only booking for a KSh 15,000 kitchen & cleaning fee. Our Basic package also lets you supply your own equipment." },
  { q: "What happens if it rains?", a: "Every outdoor booking comes with a rain plan. The Courtyard Pavilion is permanently covered, and for lawn events we hold a standby marquee and walkways. If you choose Premium, full tent shelter is already included." },
  { q: "Are there music and curfew hours?", a: "Amplified music runs until 11:00 PM, Sunday to Thursday, and until midnight on Fridays and Saturdays. Acoustic sets and quiet after-parties can continue in the pavilion until 1:00 AM." },
  { q: "Can menus and setups be customised?", a: "Completely. Every package includes a tasting for events over 100 guests, and we cater for vegetarian, vegan, halal and allergy-specific menus. Layouts, colour themes and tent configurations are planned with you in a site visit." },
  { q: "Can I hire tents without booking your grounds?", a: "Yes. Tents and equipment are available for delivery anywhere within 80 km of Nairobi. Choose 'My own venue' in the quote builder; transport and set-up are included in the rental rate." },
]

// Deterministic seed of already-taken dates (relative to today) so the date picker shows real blocking.
export function seedBookedSlots(): { date: string; groundId: string }[] {
  const out: { date: string; groundId: string }[] = []
  const base = new Date()
  base.setHours(12, 0, 0, 0)
  const add = (days: number, groundId: string) => {
    const d = new Date(base)
    d.setDate(d.getDate() + days)
    out.push({ date: toISO(d), groundId })
  }
  // Fully booked Saturdays (all three grounds) and a scattering of single bookings
  for (let i = 0; i < 120; i++) {
    const d = new Date(base)
    d.setDate(d.getDate() + i)
    if (d.getDay() === 6 && i % 3 === 0) GROUNDS.forEach((g) => add(i, g.id))
    else if (i % 7 === 2) add(i, "garden")
    else if (i % 11 === 4) add(i, "lakeside")
    else if (i % 9 === 5) add(i, "courtyard")
  }
  return out
}

export function toISO(d: Date) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}
