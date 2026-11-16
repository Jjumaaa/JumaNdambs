import { useMemo, useRef, useState } from "react"
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, ChefHat, Download, Home, Loader2, MapPin, Printer, ShieldCheck, Tent, Users, Wand2,
} from "lucide-react"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { ADDONS, EVENT_TYPES, GROUNDS, TENTS, TIERS, fmt, toISO } from "@/data"
import { useStore } from "@/store"
import { OWN_VENUE, computeQuote, suggestTents, tentCapacity } from "@/lib/pricing"
import { Receipt, prettyDate, receiptHTML, venueName } from "@/components/Receipt"
import { Reveal, SectionHeading, Stepper } from "@/components/motion"
import { cn } from "@/lib/utils"

const STEPS = ["Event & date", "Grounds & guests", "Catering", "Tents & extras", "Review & book"]

const optionCls = (active: boolean, disabled?: boolean) => cn(
  "press relative flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
  active ? "border-forest-700 bg-forest-50 ring-1 ring-forest-700" : "border-border bg-white hover:border-gold-500",
  disabled && "pointer-events-none opacity-45",
)

function Radio({ on }: { on: boolean }) {
  return (
    <span aria-hidden className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2", on ? "border-forest-700 bg-forest-700" : "border-input")}>
      {on && <Check className="size-3 text-ivory" strokeWidth={3} />}
    </span>
  )
}

export function QuoteBuilder() {
  const { quote, setQuote, prices, takenOn, isFullyBooked, addBooking, resetQuote } = useStore()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const [contact, setContact] = useState({ name: "", email: "", phone: "", notes: "" })
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<null | { ref: string; quote: typeof quote; contact: typeof contact }>(null)
  const top = useRef<HTMLDivElement>(null)

  const r = useMemo(() => computeQuote(quote, prices), [quote, prices])
  const taken = quote.date ? takenOn(quote.date) : []
  const ground = GROUNDS.find((g) => g.id === quote.groundId)
  const tier = TIERS.find((t) => t.id === quote.tier)
  const today = new Date(); today.setHours(0, 0, 0, 0)

  const stepError = (i: number): string | null => {
    if (i === 0) {
      if (!quote.eventType) return "Choose an event type."
      if (!quote.date) return "Pick a date on the calendar."
    }
    if (i === 1) {
      if (!quote.groundId) return "Choose a ground or 'My own venue'."
      if (quote.guests < 10) return "Enter at least 10 guests."
      if (ground && quote.guests > ground.capacity) return `${ground.name} holds up to ${ground.capacity} guests.`
      if (ground && taken.includes(ground.id)) return `${ground.name} is already booked on that date.`
    }
    return null
  }

  const go = (to: number) => {
    if (to > step) {
      for (let i = step; i < to; i++) {
        const err = stepError(i)
        if (err) { setStep(i); toast.error(err); return }
      }
    }
    setDir(to > step ? 1 : -1)
    setStep(to)
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
  const phoneOk = contact.phone.replace(/\D/g, "").length >= 9
  const contactOk = contact.name.trim().length > 1 && emailOk && phoneOk

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    for (let i = 0; i < 2; i++) { const err = stepError(i); if (err) { go(i); toast.error(err); return } }
    if (!contactOk) return
    setSubmitting(true)
    await new Promise((res) => setTimeout(res, 700))
    const b = addBooking({ ...contact, quote, total: r.total })
    setSubmitting(false)
    setDone({ ref: b.id, quote, contact })
    toast.success("Booking inquiry sent", { description: `Reference ${b.id}. We'll confirm within 24 hours.` })
  }

  const download = () => {
    if (!done) return
    const html = receiptHTML(done.quote, prices, { ref: done.ref, ...done.contact })
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }))
    const a = Object.assign(document.createElement("a"), { href: url, download: `jumandambs-quote-${done.ref}.html` })
    a.click()
    URL.revokeObjectURL(url)
  }

  const closeDone = () => {
    setDone(null); resetQuote(); setContact({ name: "", email: "", phone: "", notes: "" }); setTouched(false); setStep(0)
  }

  const partial = (d: Date) => { const t = takenOn(toISO(d)).length; return t > 0 && t < GROUNDS.length }

  return (
    <section id="quote" className="bg-ivory-200 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Instant quote & booking" title="Price your event in two minutes"
          intro="Every choice updates the estimate live. Send it as a booking inquiry and we hold your date for 48 hours while we confirm." />

        <Reveal className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div ref={top} className="scroll-mt-24 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-border sm:p-8">
            {/* Motion Prompt #068 Step indicator */}
            <ol className="mb-8 flex items-center gap-1.5 sm:gap-2" aria-label="Quote steps">
              {STEPS.map((s, i) => (
                <li key={s} className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
                  <button type="button" onClick={() => go(i)} aria-current={i === step ? "step" : undefined}
                    aria-label={`Step ${i + 1}: ${s}`}
                    className={cn(
                      "press grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors",
                      i < step ? "bg-forest-700 text-ivory" : i === step ? "bg-gold-500 text-forest-950 ring-4 ring-gold-200" : "bg-ivory-200 text-charcoal-soft",
                    )}>
                    {i < step ? <Check className="size-4" /> : i + 1}
                  </button>
                  <span className={cn("hidden truncate text-xs font-medium xl:block", i === step ? "text-forest-900" : "text-charcoal-soft")}>{s}</span>
                  {i < STEPS.length - 1 && (
                    <span className="h-0.5 flex-1 overflow-hidden rounded bg-ivory-200">
                      <span className={cn("block h-full origin-left bg-forest-700 transition-transform duration-500 ease-out", i < step ? "scale-x-100" : "scale-x-0")} />
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <p className="eyebrow mb-1 text-gold-600">Step {step + 1} of {STEPS.length}</p>
            <h3 className="mb-6 font-serif text-2xl font-medium text-forest-900 sm:text-3xl">{STEPS[step]}</h3>

            <div key={step} className={cn("animate-in fade-in-0 duration-300 motion-reduce:animate-none", dir === 1 ? "slide-in-from-right-6" : "slide-in-from-left-6")}>
              {step === 0 && (
                <div className="grid gap-8 xl:grid-cols-[1fr_auto]">
                  <fieldset>
                    <legend className="mb-3 text-sm font-semibold text-charcoal">What are you celebrating?</legend>
                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                      {EVENT_TYPES.map((e) => (
                        <button key={e.id} type="button" role="radio" aria-checked={quote.eventType === e.id}
                          onClick={() => setQuote({ eventType: e.id })} className={optionCls(quote.eventType === e.id)}>
                          <Radio on={quote.eventType === e.id} />
                          <span className="text-sm font-medium text-charcoal">{e.name}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div>
                    <p className="mb-3 text-sm font-semibold text-charcoal">Event date</p>
                    <div className="inline-block rounded-2xl border border-border p-2">
                      <Calendar
                        mode="single"
                        selected={quote.date ? new Date(quote.date + "T12:00") : undefined}
                        onSelect={(d) => d && setQuote({ date: toISO(d) })}
                        defaultMonth={quote.date ? new Date(quote.date + "T12:00") : today}
                        startMonth={today}
                        disabled={[{ before: today }, (d: Date) => isFullyBooked(toISO(d))]}
                        modifiers={{ partial, booked: (d: Date) => d >= today && isFullyBooked(toISO(d)) }}
                        modifiersClassNames={{
                          partial: "[&>button]:after:absolute [&>button]:after:bottom-1 [&>button]:after:size-1 [&>button]:after:rounded-full [&>button]:after:bg-gold-500",
                          booked: "[&>button]:line-through [&>button]:decoration-charcoal/40",
                        }}
                        className="[--cell-size:--spacing(10)] bg-transparent"
                      />
                    </div>
                    <ul className="mt-3 space-y-1 text-xs text-charcoal-soft">
                      <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-gold-500" /> Some grounds already booked</li>
                      <li className="flex items-center gap-2"><span className="line-through">14</span> Fully booked</li>
                    </ul>
                    {quote.date && <p className="mt-3 text-sm font-medium text-forest-800">Selected: {prettyDate(quote.date)}</p>}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ivory p-4">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-charcoal"><Users className="size-4 text-forest-700" /> Estimated guests</p>
                      <p className="text-xs text-charcoal-soft">Steps of 10. You can type an exact number.</p>
                    </div>
                    <Stepper label="Guest count" value={quote.guests} min={10} max={2000} step={10} onChange={(n) => setQuote({ guests: n })} />
                  </div>
                  <fieldset className="grid gap-3">
                    <legend className="mb-3 text-sm font-semibold text-charcoal">Choose your grounds{quote.date && <> for {prettyDate(quote.date)}</>}</legend>
                    {GROUNDS.map((g) => {
                      const booked = taken.includes(g.id)
                      const tooSmall = quote.guests > g.capacity
                      return (
                        <button key={g.id} type="button" role="radio" aria-checked={quote.groundId === g.id} aria-disabled={booked}
                          onClick={() => !booked && setQuote({ groundId: g.id })} className={optionCls(quote.groundId === g.id, booked)}>
                          <Radio on={quote.groundId === g.id} />
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-serif text-lg text-forest-900">{g.name}</span>
                              <span className="text-sm font-semibold tabular-nums text-forest-800">{fmt(prices.grounds[g.id])}</span>
                            </span>
                            <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal-soft">
                              <span>Up to {g.capacity} guests</span><span>{g.parking} parking</span><span>{g.suites}</span>
                            </span>
                            {booked && <span className="mt-2 inline-block rounded-full bg-charcoal/10 px-2 py-0.5 text-xs font-semibold">Booked on this date</span>}
                            {!booked && tooSmall && <span className="mt-2 inline-block rounded-full bg-gold-100 px-2 py-0.5 text-xs font-semibold text-gold-600">Too small for {quote.guests} guests</span>}
                          </span>
                        </button>
                      )
                    })}
                    <button type="button" role="radio" aria-checked={quote.groundId === OWN_VENUE}
                      onClick={() => setQuote({ groundId: OWN_VENUE })} className={optionCls(quote.groundId === OWN_VENUE)}>
                      <Radio on={quote.groundId === OWN_VENUE} />
                      <span>
                        <span className="flex items-center gap-2 font-serif text-lg text-forest-900"><Home className="size-4" /> My own venue</span>
                        <span className="mt-1 block text-xs text-charcoal-soft">Tents and catering delivered to your home or venue within 80 km of Nairobi.</span>
                      </span>
                    </button>
                  </fieldset>
                </div>
              )}

              {step === 2 && (
                <fieldset className="grid gap-3">
                  <legend className="mb-3 text-sm font-semibold text-charcoal">Catering for {quote.guests.toLocaleString()} guests</legend>
                  {TIERS.map((t) => (
                    <button key={t.id} type="button" role="radio" aria-checked={quote.tier === t.id}
                      onClick={() => setQuote({ tier: t.id })} className={optionCls(quote.tier === t.id)}>
                      <Radio on={quote.tier === t.id} />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-serif text-lg text-forest-900">{t.name} <span className="font-sans text-xs font-medium text-charcoal-soft">· {t.subtitle}</span></span>
                          <span className="text-sm tabular-nums text-charcoal-soft">{fmt(prices.tiers[t.id])} × {quote.guests} = <strong className="text-forest-800">{fmt(prices.tiers[t.id] * quote.guests)}</strong></span>
                        </span>
                        <span className="mt-1 block text-xs text-charcoal-soft">{t.includes.join(" · ")}</span>
                        {t.note && <span className="mt-1 block text-xs font-medium text-gold-600">{t.note}</span>}
                      </span>
                    </button>
                  ))}
                  <button type="button" role="radio" aria-checked={quote.tier === "none"}
                    onClick={() => setQuote({ tier: "none" })} className={optionCls(quote.tier === "none")}>
                    <Radio on={quote.tier === "none"} />
                    <span>
                      <span className="font-serif text-lg text-forest-900">No catering</span>
                      <span className="mt-1 block text-xs text-charcoal-soft">Grounds and/or tents only. Outside caterers welcome (kitchen fee applies).</span>
                    </span>
                  </button>
                </fieldset>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  {r.tentsCovered ? (
                    <p className="flex items-start gap-3 rounded-2xl bg-forest-50 p-4 text-sm text-forest-900">
                      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-forest-700" />
                      <span><strong>Tents are covered.</strong> Premium includes full shelter for all {quote.guests} guests; we'll pick the right tent configuration with you on the site visit.</span>
                    </p>
                  ) : (
                    <div>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <p className="flex items-center gap-2 text-sm font-semibold text-charcoal"><Tent className="size-4 text-forest-700" /> Tents</p>
                        <button type="button" onClick={() => setQuote({ tents: suggestTents(quote.guests) })}
                          className="press inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1.5 text-xs font-semibold text-forest-900 hover:bg-gold-200">
                          <Wand2 className="size-3.5" /> Auto-fit for {quote.guests} guests
                        </button>
                      </div>
                      {quote.groundId === "courtyard" && (
                        <p className="mb-3 rounded-xl bg-ivory p-3 text-xs text-charcoal-soft">The Courtyard Pavilion is permanently covered, so tents are optional.</p>
                      )}
                      <ul className="divide-y divide-border rounded-2xl border border-border">
                        {TENTS.map((t) => (
                          <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-charcoal">{t.name}</p>
                              <p className="text-xs text-charcoal-soft tabular-nums">Up to {t.capacity} guests · {fmt(prices.tents[t.id])}</p>
                            </div>
                            <Stepper size="sm" label={`${t.name} quantity`} value={quote.tents[t.id] ?? 0} max={20}
                              onChange={(n) => setQuote((q) => ({ ...q, tents: { ...q.tents, [t.id]: n } }))} />
                          </li>
                        ))}
                      </ul>
                      {(() => {
                        const cap = tentCapacity(quote.tents)
                        const pct = Math.min(100, (cap / Math.max(1, quote.guests)) * 100)
                        return (
                          <div className="mt-3">
                            <div className="h-2 overflow-hidden rounded-full bg-ivory-200">
                              <div className="h-full origin-left rounded-full bg-forest-600 transition-transform duration-300 ease-out" style={{ transform: `scaleX(${pct / 100})` }} />
                            </div>
                            <p className="mt-1.5 text-xs text-charcoal-soft tabular-nums">
                              Shelter for {cap.toLocaleString()} of {quote.guests.toLocaleString()} guests
                              {cap > 0 && cap < quote.guests && quote.groundId !== "courtyard" && <span className="text-gold-600"> · consider adding more cover in case of rain</span>}
                            </p>
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  <div>
                    <p className="mb-3 text-sm font-semibold text-charcoal">Extra equipment</p>
                    <ul className="divide-y divide-border rounded-2xl border border-border">
                      {ADDONS.map((a) => (
                        <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-charcoal">{a.name}</p>
                            <p className="text-xs text-charcoal-soft tabular-nums">{fmt(prices.addons[a.id])} {a.unit}</p>
                          </div>
                          {a.unit === "per event" ? (
                            <Stepper size="sm" label={`${a.name}`} value={quote.addons[a.id] ?? 0} max={1}
                              onChange={(n) => setQuote((q) => ({ ...q, addons: { ...q.addons, [a.id]: n } }))} />
                          ) : (
                            <div className="flex items-center gap-2">
                              <button type="button" className="press text-xs font-semibold text-forest-700 underline-offset-2 hover:underline"
                                onClick={() => setQuote((q) => ({ ...q, addons: { ...q.addons, [a.id]: a.perGuest ? q.guests : Math.ceil(q.guests / 10) } }))}>
                                Match guests
                              </button>
                              <Stepper size="sm" label={`${a.name} quantity`} value={quote.addons[a.id] ?? 0} max={2000} step={a.perGuest ? 10 : 1}
                                onChange={(n) => setQuote((q) => ({ ...q, addons: { ...q.addons, [a.id]: n } }))} />
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {step === 4 && (
                <form id="booking-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" error={touched && contact.name.trim().length < 2 ? "Please enter your name." : ""}>
                    <input autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Phone / WhatsApp" error={touched && !phoneOk ? "Enter a valid phone number." : ""}>
                    <input type="tel" autoComplete="tel" placeholder="+254 7xx xxx xxx" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Email" className="sm:col-span-2" error={touched && !emailOk ? "Enter a valid email address." : ""}>
                    <input type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Anything we should know? (optional)" className="sm:col-span-2">
                    <textarea rows={4} value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                      placeholder="Colour theme, dietary needs, ceremony timings…" className={cn(inputCls, "h-auto py-3")} />
                  </Field>
                  <div className="rounded-2xl bg-ivory p-4 text-xs leading-relaxed text-charcoal-soft sm:col-span-2">
                    <p className="flex items-center gap-2 font-semibold text-charcoal"><MapPin className="size-3.5" /> {quote.eventType ? EVENT_TYPES.find((e) => e.id === quote.eventType)?.name : "Event"} · {venueName(quote.groundId)}</p>
                    <p className="mt-1">{prettyDate(quote.date)} · {quote.guests} guests · <ChefHat className="inline size-3.5" /> {tier ? `${tier.name} catering` : "No catering"}</p>
                    <p className="mt-2">Sending this does not charge you. We hold the date for 48 hours and confirm the final price within 24 hours.</p>
                  </div>
                </form>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
              <button type="button" onClick={() => go(step - 1)} disabled={step === 0}
                className="press inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-forest-800 hover:bg-forest-50 disabled:invisible">
                <ArrowLeft className="size-4" /> Back
              </button>
              {step < STEPS.length - 1 ? (
                <button type="button" onClick={() => go(step + 1)}
                  className="press inline-flex items-center gap-2 rounded-full bg-forest-800 px-6 py-3 text-sm font-semibold text-ivory hover:bg-forest-700">
                  Continue <ArrowRight className="size-4" />
                </button>
              ) : (
                /* Motion Prompt #160 Loading button */
                <button type="submit" form="booking-form" disabled={submitting} aria-busy={submitting}
                  className="press inline-flex min-w-48 items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-forest-950 hover:bg-gold-400 disabled:opacity-80">
                  {submitting ? <><Loader2 className="size-4 animate-spin" /> Sending…</> : <>Send booking inquiry <ArrowRight className="size-4" /></>}
                </button>
              )}
            </div>
          </div>

          {/* Live itemised breakdown */}
          <aside id="quote-breakdown" aria-label="Live cost breakdown" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl bg-forest-900 p-6 text-ivory shadow-xl">
              <p className="eyebrow text-gold-400">Live estimate</p>
              <p className="mt-2 font-serif text-4xl font-semibold tabular-nums" aria-live="polite">{fmt(r.total)}</p>
              <p className="text-xs text-ivory/60">incl. 16% VAT · deposit {fmt(r.deposit)}</p>
              <ul className="mt-6 space-y-3 border-t border-ivory/10 pt-4 text-sm">
                {r.lines.length === 0 && <li className="text-ivory/60">Your selections will appear here.</li>}
                {r.lines.map((l) => (
                  <li key={l.label} className="flex justify-between gap-3">
                    <span className="min-w-0"><span className="block truncate">{l.label}</span><span className="block text-xs text-ivory/55">{l.detail}</span></span>
                    <span className={cn("shrink-0 tabular-nums", l.included && "text-gold-400")}>{l.included ? "Included" : fmt(l.amount)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-1 border-t border-ivory/10 pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-ivory/60">Subtotal</dt><dd className="tabular-nums">{fmt(r.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-ivory/60">VAT 16%</dt><dd className="tabular-nums">{fmt(r.vat)}</dd></div>
              </dl>
              <p className="mt-4 rounded-xl bg-forest-800 px-3 py-2 text-xs text-ivory/70">
                {quote.guests > 0 && r.total > 0 && <>≈ {fmt(r.total / quote.guests)} per guest all-in. </>}
                Prices are estimates; we confirm within 24 h.
              </p>
            </div>
          </aside>
        </Reveal>

        <a href="#quote-breakdown" className="sticky bottom-4 z-20 mt-4 mr-20 flex items-center justify-between gap-3 rounded-full bg-forest-900/95 px-5 py-3 text-ivory shadow-xl backdrop-blur lg:hidden">
          <span className="text-xs text-ivory/70">Live estimate</span>
          <span className="font-serif text-lg font-semibold tabular-nums">{fmt(r.total)}</span>
        </a>
      </div>

      <Dialog open={!!done} onOpenChange={(o) => !o && closeDone()}>
        <DialogContent className="max-h-[90svh] overflow-y-auto bg-white p-6 sm:max-w-lg">
          <div className="no-print flex flex-col items-center text-center">
            <span className="grid size-14 place-items-center rounded-full bg-forest-50 text-forest-700"><CheckCircle2 className="size-8" /></span>
            <DialogTitle className="mt-3 font-serif text-2xl text-forest-900">Inquiry received, thank you!</DialogTitle>
            <DialogDescription className="mt-1">
              We're holding {prettyDate(done?.quote.date ?? "")} for 48 hours. A coordinator will call {done?.contact.phone} within 24 hours to confirm.
            </DialogDescription>
          </div>
          {done && (
            <div id="print-receipt" className="rounded-2xl border border-border p-4">
              <Receipt quote={done.quote} prices={prices} ref_={done.ref} name={done.contact.name} email={done.contact.email} phone={done.contact.phone} />
            </div>
          )}
          <div className="no-print flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => window.print()} className="press inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-forest-800/20 px-4 py-2.5 text-sm font-semibold text-forest-800 hover:bg-forest-50">
              <Printer className="size-4" /> Print
            </button>
            <button type="button" onClick={download} className="press inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-forest-800/20 px-4 py-2.5 text-sm font-semibold text-forest-800 hover:bg-forest-50">
              <Download className="size-4" /> Download
            </button>
            <button type="button" onClick={closeDone} className="press flex-1 rounded-full bg-forest-800 px-4 py-2.5 text-sm font-semibold text-ivory hover:bg-forest-700">
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

const inputCls = "h-11 w-full rounded-xl border border-input bg-white px-3 text-sm text-charcoal outline-none transition-colors focus:border-gold-500 focus:ring-3 focus:ring-gold-400/30 aria-invalid:border-destructive"

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactElement }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-charcoal">{label}</span>
      {children}
      {error && <span role="alert" className="mt-1 block text-xs font-medium text-destructive">{error}</span>}
    </label>
  )
}
