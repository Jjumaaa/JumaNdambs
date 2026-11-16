import { useEffect, useState } from "react"
import { BadgeCheck, Quote, Star } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { FAQS, GALLERY, TESTIMONIALS, img } from "@/data"
import { Reveal, SectionHeading } from "@/components/motion"
import { Lightbox } from "@/components/Lightbox"
import { cn } from "@/lib/utils"

const FILTERS = ["All", "Weddings", "Graduations", "Tents & Decor", "Catering"] as const

export function Gallery() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All")
  const [open, setOpen] = useState<number | null>(null)
  const items = GALLERY.filter((g) => filter === "All" || g.cat === filter)

  return (
    <section id="gallery" className="bg-ivory py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Gallery" title="Moments from our grounds" />
        {/* Motion Prompt #060 Segmented control */}
        <div role="tablist" aria-label="Filter gallery" className="mx-auto mb-10 flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full bg-ivory-200 p-1">
          {FILTERS.map((f) => (
            <button key={f} type="button" role="tab" aria-selected={filter === f} onClick={() => setFilter(f)}
              className={cn("press rounded-full px-4 py-2 text-sm font-medium transition-colors", filter === f ? "bg-forest-800 text-ivory shadow" : "text-charcoal-soft hover:text-forest-900")}>
              {f}
            </button>
          ))}
        </div>
        <div className="masonry columns-1 sm:columns-2 lg:columns-3" aria-live="polite">
          {items.map((g, i) => (
            <button key={g.src} type="button" onClick={() => setOpen(i)} aria-label={`Open photo: ${g.alt}`}
              className="zoom-frame group relative block w-full rounded-2xl animate-in fade-in-0 duration-500 motion-reduce:animate-none">
              <img src={img(g.src, 800)} alt={g.alt} loading="lazy" className={cn("w-full object-cover", g.tall ? "aspect-[3/4]" : "aspect-[4/3]")} />
              <span className="absolute bottom-3 left-3 rounded-full bg-forest-950/70 px-3 py-1 text-xs font-medium text-ivory backdrop-blur">{g.cat}</span>
            </button>
          ))}
        </div>
      </div>
      <Lightbox title={`Gallery · ${filter}`} images={items.map((g) => ({ src: g.src, alt: g.alt }))} index={open} onClose={() => setOpen(null)} />
    </section>
  )
}

export function Testimonials() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return
    const on = () => { setCurrent(api.selectedScrollSnap()); setCount(api.scrollSnapList().length) }
    on()
    api.on("select", on).on("reInit", on)
    return () => { api.off("select", on).off("reInit", on) }
  }, [api])

  return (
    <section className="bg-forest-950 py-24 text-ivory" aria-labelledby="reviews-h">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading light eyebrow="Verified reviews" title={<span id="reviews-h">Hosts who've celebrated with us</span>} />
        <Reveal>
          {/* Motion Prompt #058 Carousel */}
          <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="mx-auto max-w-6xl">
            <CarouselContent>
              {TESTIMONIALS.map((t) => (
                <CarouselItem key={t.name} className="md:basis-1/2 lg:basis-1/3">
                  <figure className="flex h-full flex-col rounded-3xl bg-forest-900 p-7 ring-1 ring-gold-400/15">
                    <Quote className="size-7 text-gold-500" aria-hidden />
                    <div className="mt-3 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, i) => <Star key={i} className={cn("size-4", i < t.rating ? "fill-gold-400 text-gold-400" : "text-ivory/20")} />)}
                    </div>
                    <blockquote className="mt-4 flex-1 font-serif text-lg leading-relaxed text-ivory/90">“{t.quote}”</blockquote>
                    <figcaption className="mt-6 border-t border-ivory/10 pt-4">
                      <p className="flex items-center gap-1.5 font-semibold">{t.name} <BadgeCheck className="size-4 text-gold-400" aria-label="Verified client" /></p>
                      <p className="text-xs text-ivory/60">{t.event}</p>
                    </figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex items-center justify-center gap-4">
              <CarouselPrevious className="static translate-y-0 border-ivory/20 bg-transparent text-ivory hover:bg-ivory/10" />
              <div className="flex gap-1.5">
                {Array.from({ length: count }, (_, i) => (
                  <button key={i} type="button" onClick={() => api?.scrollTo(i)} aria-label={`Go to review ${i + 1}`} aria-current={i === current}
                    className="grid size-6 place-items-center">
                    <span className={cn("block h-1.5 w-6 rounded-full transition-[transform,background-color] duration-300 ease-out", i === current ? "bg-gold-400" : "scale-x-25 bg-ivory/30")} />
                  </button>
                ))}
              </div>
              <CarouselNext className="static translate-y-0 border-ivory/20 bg-transparent text-ivory hover:bg-ivory/10" />
            </div>
          </Carousel>
        </Reveal>
      </div>
    </section>
  )
}

export function FAQ() {
  return (
    <section id="faq" className="bg-ivory-200 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr]">
        <SectionHeading center={false} eyebrow="FAQ" title="Good to know before you book"
          intro={<>Can't find your answer? <a href="#contact" className="font-semibold text-forest-800 underline underline-offset-4">Talk to a coordinator</a>.</>} />
        <Reveal>
          {/* Motion Prompt #052 Accordion */}
          <Accordion className="rounded-3xl bg-white p-2 ring-1 ring-border sm:p-4">
            {FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-border px-3">
                <AccordionTrigger className="py-5 font-serif text-lg text-forest-900 hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="pb-5 text-[0.95rem] leading-relaxed text-charcoal-soft">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
