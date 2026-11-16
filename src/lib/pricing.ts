import { ADDONS, GROUNDS, TENTS, TIERS, type EventTypeId, type TierId } from "@/data"

export type Prices = {
  tiers: Record<string, number>
  grounds: Record<string, number>
  tents: Record<string, number>
  addons: Record<string, number>
}

export const DEFAULT_PRICES: Prices = {
  tiers: Object.fromEntries(TIERS.map((t) => [t.id, t.perPlate])),
  grounds: Object.fromEntries(GROUNDS.map((g) => [g.id, g.price])),
  tents: Object.fromEntries(TENTS.map((t) => [t.id, t.price])),
  addons: Object.fromEntries(ADDONS.map((a) => [a.id, a.price])),
}

export const OWN_VENUE = "own"

export type QuoteInput = {
  eventType: EventTypeId | ""
  date: string // yyyy-mm-dd
  groundId: string // ground id or OWN_VENUE
  guests: number
  tier: TierId
  tents: Record<string, number>
  addons: Record<string, number>
}

export const EMPTY_QUOTE: QuoteInput = {
  eventType: "", date: "", groundId: "", guests: 120, tier: "regular", tents: {}, addons: {},
}

export type Line = { label: string; detail: string; amount: number; included?: boolean }

export const VAT = 0.16
export const DEPOSIT = 0.3

export function computeQuote(q: QuoteInput, p: Prices) {
  const lines: Line[] = []
  const guests = Math.max(0, q.guests || 0)

  if (q.groundId && q.groundId !== OWN_VENUE) {
    const g = GROUNDS.find((x) => x.id === q.groundId)
    if (g) lines.push({ label: g.name, detail: "Grounds hire · full day", amount: p.grounds[g.id] ?? g.price })
  } else if (q.groundId === OWN_VENUE) {
    lines.push({ label: "Your own venue", detail: "Delivery & set-up within 80 km", amount: 0, included: true })
  }

  const tier = TIERS.find((t) => t.id === q.tier)
  if (tier) {
    const rate = p.tiers[tier.id] ?? tier.perPlate
    lines.push({ label: `${tier.name} catering`, detail: `${guests.toLocaleString()} guests × KSh ${rate.toLocaleString()}`, amount: rate * guests })
  }

  const tentsCovered = tier?.includesTents ?? false
  for (const t of TENTS) {
    const qty = q.tents[t.id] ?? 0
    if (!qty) continue
    lines.push(tentsCovered
      ? { label: `${t.name} × ${qty}`, detail: "Included in Premium", amount: 0, included: true }
      : { label: `${t.name} × ${qty}`, detail: `${qty} × KSh ${(p.tents[t.id] ?? t.price).toLocaleString()}`, amount: qty * (p.tents[t.id] ?? t.price) })
  }
  if (tentsCovered && !TENTS.some((t) => q.tents[t.id])) {
    lines.push({ label: "Tent shelter for all guests", detail: "Included in Premium", amount: 0, included: true })
  }

  for (const a of ADDONS) {
    const qty = q.addons[a.id] ?? 0
    if (!qty) continue
    const rate = p.addons[a.id] ?? a.price
    lines.push({ label: a.name, detail: a.unit === "per event" ? "Per event" : `${qty.toLocaleString()} × KSh ${rate.toLocaleString()}`, amount: qty * rate })
  }

  const subtotal = lines.reduce((s, l) => s + l.amount, 0)
  const vat = subtotal * VAT
  const total = subtotal + vat
  return { lines, subtotal, vat, total, deposit: total * DEPOSIT, tentsCovered }
}

/** Greedy fit of tents to shelter a guest count (largest first, then top up with smaller ones). */
export function suggestTents(guests: number): Record<string, number> {
  const sizes = [...TENTS].sort((a, b) => b.capacity - a.capacity)
  const out: Record<string, number> = {}
  let left = guests
  for (const t of sizes) {
    if (t.capacity < 50) continue
    const n = Math.floor(left / t.capacity)
    if (n > 0) { out[t.id] = n; left -= n * t.capacity }
  }
  if (left > 0) {
    const fit = [...sizes].reverse().find((t) => t.capacity >= left && t.capacity >= 50) ?? sizes[0]
    out[fit.id] = (out[fit.id] ?? 0) + 1
  }
  return out
}

export function tentCapacity(tents: Record<string, number>) {
  return TENTS.reduce((s, t) => s + (tents[t.id] ?? 0) * t.capacity, 0)
}
