import { useState } from "react"
import { Bath, Camera, Car, Expand, Images, Plug, Ruler, Sparkles, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GROUNDS, fmt, img } from "@/data"
import { useStore } from "@/store"
import { Reveal, SectionHeading } from "@/components/motion"
import { Lightbox } from "@/components/Lightbox"

export function Grounds() {
  const { prices, setQuote } = useStore()
  const [gallery, setGallery] = useState<{ ground: string; index: number | null }>({ ground: GROUNDS[0].id, index: null })
  const active = GROUNDS.find((g) => g.id === gallery.ground)

  return (
    <section id="grounds" className="bg-ivory py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Event grounds & venues" title={<>Three grounds, <em className="italic text-gold-600">one</em> team</>}
          intro="Every ground comes with a dedicated coordinator, backup power, guest washrooms and secure parking. Pick the setting; we'll handle the rest." />

        <Reveal>
          <Tabs defaultValue={GROUNDS[0].id} className="gap-8">
            <TabsList className="mx-auto h-auto! w-full max-w-2xl flex-col gap-1 rounded-2xl bg-ivory-200 p-1.5 sm:flex-row">
              {GROUNDS.map((g) => (
                <TabsTrigger key={g.id} value={g.id}
                  className="h-auto w-full rounded-xl px-4 py-3 font-serif text-base text-forest-900/70 data-active:bg-white data-active:text-forest-900 data-active:shadow-sm">
                  {g.name.replace("The ", "")}
                </TabsTrigger>
              ))}
            </TabsList>

            {GROUNDS.map((g) => (
              <TabsContent key={g.id} value={g.id} className="data-[hidden]:hidden">
                <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
                  <div className="grid grid-cols-3 grid-rows-[1fr_auto] gap-3">
                    <button type="button" onClick={() => setGallery({ ground: g.id, index: 0 })}
                      aria-label={`Open ${g.name} photo gallery`}
                      className="zoom-frame group relative col-span-3 aspect-[16/10] rounded-2xl">
                      <img src={img(g.photos[0], 1400)} alt={`${g.name} set up for an event`} className="size-full object-cover" />
                      <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-forest-950/70 px-3 py-1.5 text-xs font-medium text-ivory backdrop-blur">
                        <Images className="size-3.5" /> {g.photos.length} photos
                      </span>
                    </button>
                    {g.photos.slice(1, 4).map((p, i) => (
                      <button key={p} type="button" onClick={() => setGallery({ ground: g.id, index: i + 1 })}
                        aria-label={`Open photo ${i + 2} of ${g.name}`} className="zoom-frame aspect-[4/3] rounded-xl">
                        <img src={img(p, 500)} alt="" loading="lazy" className="size-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col">
                    <p className="eyebrow text-gold-600">{g.tagline}</p>
                    <h3 className="mt-2 font-serif text-3xl font-medium tracking-tight text-forest-900 sm:text-4xl">{g.name}</h3>
                    <p className="mt-4 leading-relaxed text-charcoal-soft">{g.description}</p>

                    <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                      {[
                        { i: Users, k: "Max capacity", v: `${g.capacity.toLocaleString()} guests` },
                        { i: Ruler, k: "Area", v: `${g.sqft.toLocaleString()} sq ft` },
                        { i: Car, k: "Parking", v: `${g.parking} vehicles` },
                        { i: Sparkles, k: "Changing suites", v: g.suites },
                        { i: Camera, k: "Photo zones", v: g.photoZones },
                        { i: Plug, k: "Backup power", v: g.power },
                        { i: Bath, k: "Washrooms", v: g.washrooms },
                        { i: Expand, k: "Hire from", v: fmt(prices.grounds[g.id]) },
                      ].map(({ i: Icon, k, v }) => (
                        <div key={k} className="bg-white p-4">
                          <dt className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gold-600 uppercase">
                            <Icon className="size-3.5" aria-hidden /> {k}
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-charcoal">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a href="#quote" onClick={() => setQuote({ groundId: g.id })}
                        className="press rounded-full bg-forest-800 px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-forest-700">
                        Quote for this ground
                      </a>
                      <button type="button" onClick={() => setGallery({ ground: g.id, index: 0 })}
                        className="press inline-flex items-center gap-2 rounded-full border border-forest-800/20 px-6 py-3 text-sm font-semibold text-forest-800 transition-colors hover:bg-forest-50">
                        <Images className="size-4" /> View gallery
                      </button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </div>

      <Lightbox
        title={active?.name ?? ""}
        images={(active?.photos ?? []).map((p, i) => ({ src: p, alt: `${active?.name} photo ${i + 1}` }))}
        index={gallery.index}
        onClose={() => setGallery((g) => ({ ...g, index: null }))}
      />
    </section>
  )
}
