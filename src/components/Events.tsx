import { ArrowUpRight, Check } from "lucide-react"
import { EVENT_TYPES, img } from "@/data"
import { useStore } from "@/store"
import { Reveal, SectionHeading } from "@/components/motion"

export function Events() {
  const { setQuote } = useStore()
  return (
    <section id="events" className="bg-forest-900 py-24 text-ivory">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading light eyebrow="Events we host" title="Tailored setups for every celebration"
          intro="Each event type has its own floor plans, timings and checklists, refined over a decade of Saturdays." />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EVENT_TYPES.map((e, i) => (
            <Reveal as="li" key={e.id} delay={(i % 3) * 80}>
              <article className="lift group flex h-full flex-col overflow-hidden rounded-2xl bg-forest-800 ring-1 ring-gold-400/15">
                <div className="zoom-frame aspect-[16/10]">
                  <img src={img(e.photo, 800)} alt={e.name} loading="lazy" className="size-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-2xl font-medium tracking-tight text-ivory">{e.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/70">{e.blurb}</p>
                  <ul className="mt-4 space-y-1.5">
                    {e.layouts.map((l) => (
                      <li key={l} className="flex items-center gap-2 text-sm text-gold-200">
                        <Check className="size-3.5 shrink-0 text-gold-400" aria-hidden /> {l}
                      </li>
                    ))}
                  </ul>
                  <a href="#quote" onClick={() => setQuote({ eventType: e.id })}
                    className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-gold-400 underline-offset-4 hover:underline">
                    Plan a {e.short.toLowerCase()} <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
