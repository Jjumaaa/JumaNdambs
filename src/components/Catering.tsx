import { Check, Minus, Star, X } from "lucide-react"
import { COMPARISON_ROWS, PHOTOS, TIERS, fmt, img } from "@/data"
import { useStore } from "@/store"
import { Reveal, SectionHeading } from "@/components/motion"
import { cn } from "@/lib/utils"

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <Check className="mx-auto size-5 text-forest-600" aria-label="Included" />
  if (v === false) return <Minus className="mx-auto size-5 text-charcoal/25" aria-label="Not included" />
  return <span className="text-sm text-charcoal">{v}</span>
}

export function Catering() {
  const { prices, quote, setQuote } = useStore()
  const guests = quote.guests || 120

  return (
    <section id="catering" className="relative overflow-hidden bg-ivory-200 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Catering packages" title="Built for every budget"
          intro="Choose how much we bring. Every tier is cooked fresh on site by our own chefs, and every rate is per plate so the maths stays simple." />

        {/* Motion Prompt #062 Range slider: estimate for N guests */}
        <Reveal className="mx-auto mb-10 flex max-w-xl flex-col items-center gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border">
          <label htmlFor="cat-guests" className="text-sm font-medium text-charcoal-soft">
            Estimate for <span className="font-semibold text-forest-800 tabular-nums">{guests.toLocaleString()}</span> guests
          </label>
          <input id="cat-guests" type="range" min={20} max={1000} step={10} value={guests}
            onChange={(e) => setQuote({ guests: Number(e.target.value) })}
            className="w-full accent-forest-700" />
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {TIERS.map((t, i) => {
            const rate = prices.tiers[t.id]
            const selected = quote.tier === t.id
            return (
              <Reveal key={t.id} delay={i * 80}>
                <article className={cn(
                  "lift relative flex h-full flex-col rounded-3xl p-7",
                  t.featured ? "bg-forest-900 text-ivory ring-2 ring-gold-400" : "bg-white text-charcoal ring-1 ring-border",
                )}>
                  {t.featured && (
                    <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-forest-950">
                      <Star className="size-3 fill-current" /> Most booked for weddings
                    </span>
                  )}
                  <p className={cn("eyebrow", t.featured ? "text-gold-400" : "text-gold-600")}>{t.subtitle}</p>
                  <h3 className={cn("mt-2 font-serif text-3xl font-medium", t.featured ? "text-ivory" : "text-forest-900")}>{t.name}</h3>
                  <p className="mt-5 flex items-baseline gap-1">
                    <span className="font-serif text-4xl font-semibold tabular-nums">{fmt(rate)}</span>
                    <span className={cn("text-sm", t.featured ? "text-ivory/60" : "text-charcoal-soft")}>/ plate</span>
                  </p>
                  <p className={cn("mt-1 text-sm tabular-nums", t.featured ? "text-gold-200" : "text-forest-700")}>
                    ≈ {fmt(rate * guests)} for {guests.toLocaleString()} guests
                  </p>
                  <p className={cn("mt-4 text-sm", t.featured ? "text-ivory/70" : "text-charcoal-soft")}>
                    <strong className={t.featured ? "text-ivory" : "text-charcoal"}>Ideal for:</strong> {t.idealFor}
                  </p>
                  <ul className={cn("mt-6 space-y-2.5 text-sm", !t.note && "mb-8")}>
                    {t.includes.map((x) => (
                      <li key={x} className="flex gap-2.5"><Check className={cn("mt-0.5 size-4 shrink-0", t.featured ? "text-gold-400" : "text-forest-600")} />{x}</li>
                    ))}
                    {t.excludes.map((x) => (
                      <li key={x} className={cn("flex gap-2.5", t.featured ? "text-ivory/50" : "text-charcoal/50")}><X className="mt-0.5 size-4 shrink-0" />{x}</li>
                    ))}
                  </ul>
                  {t.note && <p className={cn("mt-4 mb-8 rounded-xl px-3 py-2 text-xs", t.featured ? "bg-forest-800" : "bg-gold-100 text-charcoal")}>{t.note}</p>}
                  <a href="#quote" onClick={() => setQuote({ tier: t.id })} aria-pressed={selected}
                    className={cn(
                      "press mt-auto block rounded-full px-5 py-3 text-center text-sm font-semibold transition-colors",
                      t.featured ? "bg-gold-500 text-forest-950 hover:bg-gold-400" : "bg-forest-800 text-ivory hover:bg-forest-700",
                    )}>
                    {selected ? "Selected · continue to quote" : `Choose ${t.name}`}
                  </a>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-16 overflow-hidden rounded-3xl bg-white ring-1 ring-border">
          <div className="grid lg:grid-cols-[1fr_2.2fr]">
            <img src={img(PHOTOS.buffet, 900)} alt="Buffet line with silver chafing dishes" loading="lazy" className="hidden h-full w-full object-cover lg:block" />
            <div className="overflow-x-auto p-2 sm:p-6">
              <table className="w-full min-w-[520px] text-left">
                <caption className="px-3 pt-2 pb-4 text-left font-serif text-2xl text-forest-900">Side-by-side comparison</caption>
                <thead>
                  <tr className="border-b border-border text-xs tracking-wide text-charcoal-soft uppercase">
                    <th scope="col" className="px-3 py-3 font-semibold">What's included</th>
                    {TIERS.map((t) => (
                      <th key={t.id} scope="col" className={cn("px-3 py-3 text-center font-semibold", t.featured && "text-forest-800")}>{t.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((r) => (
                    <tr key={r.label} className="border-b border-border/70 last:border-0">
                      <th scope="row" className="px-3 py-3 text-sm font-medium text-charcoal">{r.label}</th>
                      <td className="bg-forest-50/60 px-3 py-3 text-center"><Cell v={r.premium} /></td>
                      <td className="px-3 py-3 text-center"><Cell v={r.regular} /></td>
                      <td className="px-3 py-3 text-center"><Cell v={r.basic} /></td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className="px-3 py-4 text-sm font-semibold text-charcoal">Per plate</th>
                    {TIERS.map((t) => (
                      <td key={t.id} className={cn("px-3 py-4 text-center font-serif text-lg font-semibold tabular-nums text-forest-900", t.featured && "bg-forest-50/60")}>{fmt(prices.tiers[t.id])}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
