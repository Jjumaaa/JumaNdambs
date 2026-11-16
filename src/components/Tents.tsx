import { CloudRain, ShieldCheck, Users } from "lucide-react"
import { ADDONS, TENTS, fmt, img } from "@/data"
import { useStore } from "@/store"
import { Reveal, SectionHeading, Stepper } from "@/components/motion"
import { cn } from "@/lib/utils"

export function Tents() {
  const { prices, quote, setQuote } = useStore()
  const premium = quote.tier === "premium"
  const setTent = (id: string, n: number) => setQuote((q) => ({ ...q, tents: { ...q.tents, [id]: n } }))
  const setAddon = (id: string, n: number) => setQuote((q) => ({ ...q, addons: { ...q.addons, [id]: n } }))

  return (
    <section id="tents" className="bg-ivory py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Tent & equipment hire" title="Shelter for 20 or 2,000"
          intro="Hire tents on their own for your home or venue, or alongside our grounds. Rates include delivery within 80 km, set-up, and a crew on standby during your event." />

        {premium && (
          <p className="mx-auto -mt-4 mb-8 flex max-w-xl items-center justify-center gap-2 rounded-full bg-forest-50 px-4 py-2 text-center text-sm text-forest-800">
            <ShieldCheck className="size-4 shrink-0" /> Your quote uses the Premium package, so tent shelter is already included.
          </p>
        )}

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TENTS.map((t, i) => {
            const qty = quote.tents[t.id] ?? 0
            return (
              <Reveal as="li" key={t.id} delay={(i % 3) * 80}>
                <article className={cn("lift group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1", qty ? "ring-gold-500" : "ring-border")}>
                  <div className="zoom-frame relative aspect-[16/10]">
                    <img src={img(t.photo, 800)} alt={t.name} loading="lazy" className="size-full object-cover" />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-ivory/90 px-2.5 py-1 text-xs font-semibold text-forest-900 backdrop-blur">
                      <Users className="size-3.5" /> Up to {t.capacity}{t.capacity >= 500 ? "+" : ""} guests
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-xl font-medium text-forest-900">{t.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{t.desc}</p>
                    <p className="mt-3 flex items-start gap-2 text-xs text-forest-700">
                      <CloudRain className="mt-0.5 size-3.5 shrink-0" /> {t.weather}
                    </p>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                      <p>
                        <span className="block text-xs text-charcoal-soft">per tent / event</span>
                        <span className="font-serif text-xl font-semibold tabular-nums text-forest-900">{fmt(prices.tents[t.id])}</span>
                      </p>
                      <Stepper size="sm" label={`${t.name} quantity`} value={qty} max={20} onChange={(n) => setTent(t.id, n)} />
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}

          <Reveal as="li" delay={160}>
            <div className="flex h-full flex-col rounded-2xl bg-forest-900 p-6 text-ivory">
              <h3 className="font-serif text-xl text-ivory">Optional add-ons</h3>
              <p className="mt-1 text-sm text-ivory/60">Available with any package or tent hire.</p>
              <ul className="mt-5 flex-1 divide-y divide-ivory/10">
                {ADDONS.map((a) => {
                  const qty = quote.addons[a.id] ?? 0
                  const perEvent = a.unit === "per event"
                  return (
                    <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{a.name}</p>
                        <p className="text-xs text-gold-200 tabular-nums">{fmt(prices.addons[a.id])} {a.unit}</p>
                      </div>
                      {perEvent ? (
                        <label className="relative inline-flex cursor-pointer items-center">
                          <span className="sr-only">Add {a.name}</span>
                          {/* Motion Prompt #059 Toggle */}
                          <input type="checkbox" className="peer sr-only" checked={qty > 0} onChange={(e) => setAddon(a.id, e.target.checked ? 1 : 0)} />
                          <span className="h-7 w-12 rounded-full bg-ivory/20 transition-colors peer-checked:bg-gold-500 peer-focus-visible:ring-2 peer-focus-visible:ring-gold-400" />
                          <span className="absolute left-1 size-5 rounded-full bg-white shadow transition-transform duration-200 ease-out peer-checked:translate-x-5" />
                        </label>
                      ) : (
                        <button type="button" onClick={() => setAddon(a.id, qty ? 0 : a.perGuest ? quote.guests : Math.ceil(quote.guests / 10))}
                          aria-pressed={qty > 0}
                          className={cn("press shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold tabular-nums transition-colors", qty ? "bg-gold-500 text-forest-950" : "bg-ivory/10 text-ivory hover:bg-ivory/20")}>
                          {qty ? `${qty} added` : "Add"}
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
              <a href="#quote" className="press mt-4 rounded-full bg-gold-500 px-5 py-3 text-center text-sm font-semibold text-forest-950 hover:bg-gold-400">
                Review in quote builder
              </a>
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  )
}
