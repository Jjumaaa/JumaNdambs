import { useState } from "react"
import { ArrowRight, CalendarCheck, CalendarDays, CircleAlert, PartyPopper, Users } from "lucide-react"
import { EVENT_TYPES, GROUNDS, PHOTOS, img, toISO, type EventTypeId } from "@/data"
import { useStore } from "@/store"
import { CountUp } from "@/components/motion"

const fieldCls =
  "h-12 w-full rounded-xl border border-forest-900/10 bg-white px-3 text-sm text-charcoal outline-none transition-colors focus:border-gold-500 focus:ring-3 focus:ring-gold-400/30"

export function Hero() {
  const { takenOn, setQuote } = useStore()
  const [eventType, setEventType] = useState<EventTypeId | "">("")
  const [date, setDate] = useState("")
  const [guests, setGuests] = useState(150)
  const [result, setResult] = useState<null | { free: string[] }>(null)

  const check = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) return
    const taken = takenOn(date)
    setResult({ free: GROUNDS.filter((g) => !taken.includes(g.id) && g.capacity >= guests).map((g) => g.name) })
  }

  const continueToQuote = () => {
    setQuote({ eventType, date, guests })
    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="home" className="relative isolate flex min-h-[calc(100svh-6.25rem)] items-center overflow-hidden">
      <img
        src={img(PHOTOS.heroTable, 2000)} alt="" aria-hidden fetchPriority="high"
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(6_35_26/0.92)_0%,rgb(6_35_26/0.72)_45%,rgb(6_35_26/0.25)_100%)]" />

      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-forest-950/40 px-3 py-1.5 text-gold-200">
            <PartyPopper className="size-3.5" aria-hidden /> Grounds · Tents · Catering, one booking
          </p>
          <h1 className="display-xl font-medium text-ivory">
            Celebrate outdoors, <em className="font-normal text-gold-400 italic">beautifully</em> hosted.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/80">
            Manicured garden grounds, weatherproof marquees and chefs who feed 500 as gracefully as 50.
            Weddings, graduations and every milestone in between, planned and served by one team.
          </p>
        </div>

        <form onSubmit={check} aria-label="Quick availability check"
          className="glass mt-10 grid max-w-4xl gap-3 rounded-2xl border border-white/30 bg-ivory/85 p-3 shadow-2xl backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.8fr_auto]">
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 px-1 text-xs font-semibold text-forest-800"><PartyPopper className="size-3.5" aria-hidden />Event type</span>
            <select value={eventType} onChange={(e) => setEventType(e.target.value as EventTypeId)} className={fieldCls}>
              <option value="">Choose an event…</option>
              {EVENT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 px-1 text-xs font-semibold text-forest-800"><CalendarDays className="size-3.5" aria-hidden />Date</span>
            <input type="date" required min={toISO(new Date())} value={date}
              onChange={(e) => { setDate(e.target.value); setResult(null) }} className={fieldCls} />
          </label>
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 px-1 text-xs font-semibold text-forest-800"><Users className="size-3.5" aria-hidden />Guests</span>
            <input type="number" min={10} max={2000} step={10} value={guests}
              onChange={(e) => { setGuests(Number(e.target.value)); setResult(null) }} className={fieldCls} />
          </label>
          <button type="submit" className="press flex h-12 items-center justify-center gap-2 self-end rounded-xl bg-forest-800 px-6 text-sm font-semibold text-ivory transition-colors hover:bg-forest-700">
            <CalendarCheck className="size-4" aria-hidden /> Check availability
          </button>

          <div aria-live="polite" className="sm:col-span-2 lg:col-span-4">
            {result && (
              <div className={`flex flex-col gap-3 rounded-xl px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between ${result.free.length ? "bg-forest-50 text-forest-900" : "bg-gold-100 text-charcoal"}`}>
                <p className="flex items-start gap-2">
                  {result.free.length ? <CalendarCheck className="mt-0.5 size-4 shrink-0 text-forest-600" /> : <CircleAlert className="mt-0.5 size-4 shrink-0 text-gold-600" />}
                  <span>
                    {result.free.length
                      ? <>Good news: <strong>{result.free.join(", ")}</strong> {result.free.length > 1 ? "are" : "is"} free for {guests} guests on {new Date(date + "T12:00").toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" })}.</>
                      : <>Our grounds are taken (or too small) for that date. Tents & catering at your own venue are still available.</>}
                  </span>
                </p>
                <button type="button" onClick={continueToQuote} className="press inline-flex shrink-0 items-center gap-1.5 font-semibold text-forest-800 underline-offset-4 hover:underline">
                  Build my quote <ArrowRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        </form>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#quote" className="press inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-forest-950 shadow-lg transition-colors hover:bg-gold-400">
            Get an instant quote <ArrowRight className="size-4" />
          </a>
          <a href="#grounds" className="press inline-flex items-center gap-2 rounded-full border border-ivory/40 px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-ivory/10">
            Tour the grounds
          </a>
        </div>

        <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-ivory/20 pt-6 text-ivory">
          {[
            { n: 1240, s: "+", l: "Events hosted" },
            { n: 800, s: "", l: "Guests on one lawn" },
            { n: 14, s: " yrs", l: "Feeding Nairobi" },
          ].map((x) => (
            <div key={x.l}>
              <dt className="sr-only">{x.l}</dt>
              <dd className="font-serif text-3xl text-gold-400 sm:text-4xl"><CountUp to={x.n} suffix={x.s} /></dd>
              <dd className="mt-1 text-xs text-ivory/70 sm:text-sm">{x.l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
