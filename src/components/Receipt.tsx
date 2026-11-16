import { EVENT_TYPES, GROUNDS, fmt } from "@/data"
import { OWN_VENUE, computeQuote, type Prices, type QuoteInput } from "@/lib/pricing"

export function prettyDate(iso: string) {
  if (!iso) return "No date yet"
  return new Date(iso + "T12:00").toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "long", year: "numeric" })
}

export function venueName(id: string) {
  if (id === OWN_VENUE) return "Your own venue"
  return GROUNDS.find((g) => g.id === id)?.name ?? "No venue yet"
}

export function Receipt({ quote, prices, ref_, name, email, phone }: {
  quote: QuoteInput; prices: Prices; ref_?: string; name?: string; email?: string; phone?: string
}) {
  const r = computeQuote(quote, prices)
  const ev = EVENT_TYPES.find((e) => e.id === quote.eventType)
  return (
    <div className="text-sm text-charcoal">
      <div className="flex items-start justify-between gap-4 border-b border-border pb-3">
        <div>
          <p className="font-serif text-xl text-forest-900">Jumandambs</p>
          <p className="text-xs text-charcoal-soft">Grounds · Tents · Catering</p>
        </div>
        {ref_ && <p className="text-right text-xs text-charcoal-soft">Ref<br /><span className="font-mono text-sm font-semibold text-charcoal">{ref_}</span></p>}
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 py-3 text-xs">
        <dt className="text-charcoal-soft">Event</dt><dd className="text-right font-medium">{ev?.name ?? "—"}</dd>
        <dt className="text-charcoal-soft">Date</dt><dd className="text-right font-medium">{prettyDate(quote.date)}</dd>
        <dt className="text-charcoal-soft">Venue</dt><dd className="text-right font-medium">{venueName(quote.groundId)}</dd>
        <dt className="text-charcoal-soft">Guests</dt><dd className="text-right font-medium tabular-nums">{quote.guests.toLocaleString()}</dd>
        {name && <><dt className="text-charcoal-soft">Client</dt><dd className="text-right font-medium">{name}</dd></>}
        {email && <><dt className="text-charcoal-soft">Email</dt><dd className="truncate text-right font-medium">{email}</dd></>}
        {phone && <><dt className="text-charcoal-soft">Phone</dt><dd className="text-right font-medium">{phone}</dd></>}
      </dl>
      <table className="w-full border-t border-border">
        <tbody>
          {r.lines.map((l) => (
            <tr key={l.label} className="border-b border-border/60 align-top">
              <td className="py-2 pr-2"><p className="font-medium">{l.label}</p><p className="text-xs text-charcoal-soft">{l.detail}</p></td>
              <td className="py-2 text-right whitespace-nowrap tabular-nums">{l.included ? "Included" : fmt(l.amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="text-sm">
          <tr><td className="pt-3 text-charcoal-soft">Subtotal</td><td className="pt-3 text-right tabular-nums">{fmt(r.subtotal)}</td></tr>
          <tr><td className="text-charcoal-soft">VAT (16%)</td><td className="text-right tabular-nums">{fmt(r.vat)}</td></tr>
          <tr><td className="pt-2 font-serif text-lg text-forest-900">Estimated total</td><td className="pt-2 text-right font-serif text-lg font-semibold tabular-nums text-forest-900">{fmt(r.total)}</td></tr>
          <tr><td className="text-xs text-charcoal-soft">30% deposit to secure date</td><td className="text-right text-xs tabular-nums text-charcoal-soft">{fmt(r.deposit)}</td></tr>
        </tfoot>
      </table>
    </div>
  )
}

export function receiptHTML(quote: QuoteInput, prices: Prices, meta: { ref: string; name: string; email: string; phone: string }) {
  const r = computeQuote(quote, prices)
  const ev = EVENT_TYPES.find((e) => e.id === quote.eventType)?.name ?? "—"
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!)
  const rows = r.lines.map((l) => `<tr><td>${esc(l.label)}<br><small>${esc(l.detail)}</small></td><td class="r">${l.included ? "Included" : fmt(l.amount)}</td></tr>`).join("")
  return `<!doctype html><html><head><meta charset="utf-8"><title>Jumandambs quote ${meta.ref}</title>
<style>body{font:14px/1.5 system-ui,sans-serif;color:#24262a;max-width:640px;margin:40px auto;padding:0 16px}h1{font-family:Georgia,serif;color:#10422f;margin:0}
table{width:100%;border-collapse:collapse;margin-top:16px}td{border-bottom:1px solid #e6dfcf;padding:8px 0;vertical-align:top}.r{text-align:right;white-space:nowrap}small{color:#5d6166}
.t td{border:0;font-weight:600;font-size:16px;color:#10422f}</style></head><body>
<h1>Jumandambs</h1><p>Booking inquiry <b>${meta.ref}</b> · ${new Date().toLocaleString("en-KE")}</p>
<p>${esc(meta.name)} · ${esc(meta.email)} · ${esc(meta.phone)}<br>${esc(ev)} · ${prettyDate(quote.date)} · ${esc(venueName(quote.groundId))} · ${quote.guests} guests</p>
<table>${rows}<tr><td>Subtotal</td><td class="r">${fmt(r.subtotal)}</td></tr><tr><td>VAT (16%)</td><td class="r">${fmt(r.vat)}</td></tr>
<tr class="t"><td>Estimated total</td><td class="r">${fmt(r.total)}</td></tr><tr><td>30% deposit</td><td class="r">${fmt(r.deposit)}</td></tr></table>
<p><small>This is an estimate. Final pricing is confirmed by our events team within 24 hours.</small></p></body></html>`
}
