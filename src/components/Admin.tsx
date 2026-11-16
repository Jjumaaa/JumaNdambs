import { useState } from "react"
import { Check, Inbox, RotateCcw, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ADDONS, EVENT_TYPES, GROUNDS, TENTS, TIERS, fmt } from "@/data"
import { useStore, type BookingStatus } from "@/store"
import type { Prices } from "@/lib/pricing"
import { prettyDate, venueName } from "@/components/Receipt"
import { cn } from "@/lib/utils"

const badge: Record<BookingStatus, string> = {
  pending: "bg-gold-100 text-gold-600",
  approved: "bg-forest-50 text-forest-700",
  declined: "bg-charcoal/10 text-charcoal-soft",
}

export function Admin({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { bookings, setBookingStatus, removeBooking, prices, setPrice, resetPrices, takenOn } = useStore()
  const [filter, setFilter] = useState<"all" | BookingStatus>("all")
  const list = bookings.filter((b) => filter === "all" || b.status === filter)
  const revenue = bookings.filter((b) => b.status === "approved").reduce((s, b) => s + b.total, 0)

  const approve = (id: string) => {
    const b = bookings.find((x) => x.id === id)!
    if (b.quote.groundId && takenOn(b.quote.date).includes(b.quote.groundId)) {
      toast.error("Date conflict", { description: `${venueName(b.quote.groundId)} is already booked on ${prettyDate(b.quote.date)}.` })
      return
    }
    setBookingStatus(id, "approved")
    toast.success(`Approved ${id}`, { description: "The date is now blocked on the public calendar." })
  }

  const priceGroups: { key: keyof Prices; title: string; items: { id: string; name: string; unit: string }[] }[] = [
    { key: "tiers", title: "Catering (per plate)", items: TIERS.map((t) => ({ id: t.id, name: t.name, unit: "/ plate" })) },
    { key: "grounds", title: "Grounds hire", items: GROUNDS.map((g) => ({ id: g.id, name: g.name, unit: "/ day" })) },
    { key: "tents", title: "Tents", items: TENTS.map((t) => ({ id: t.id, name: t.name, unit: "/ tent" })) },
    { key: "addons", title: "Add-ons", items: ADDONS.map((a) => ({ id: a.id, name: a.name, unit: a.unit })) },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto bg-ivory p-0 data-[side=right]:sm:max-w-3xl">
        <div className="sticky top-0 z-10 border-b border-border bg-ivory/90 px-6 py-5 backdrop-blur">
          <SheetTitle className="font-serif text-2xl text-forest-900">Owner dashboard</SheetTitle>
          <SheetDescription>Demo mode: data lives in this browser only.</SheetDescription>
        </div>

        <div className="grid grid-cols-3 gap-3 px-6 pt-6">
          {[
            { l: "Pending", v: bookings.filter((b) => b.status === "pending").length },
            { l: "Approved", v: bookings.filter((b) => b.status === "approved").length },
            { l: "Approved value", v: fmt(revenue) },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-white p-4 ring-1 ring-border">
              <p className="text-xs text-charcoal-soft">{s.l}</p>
              <p className="mt-1 font-serif text-xl font-semibold tabular-nums text-forest-900 sm:text-2xl">{s.v}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="bookings" className="px-6 py-6">
          <TabsList className="h-10! bg-ivory-200">
            <TabsTrigger value="bookings" className="px-4">Bookings</TabsTrigger>
            <TabsTrigger value="prices" className="px-4">Prices</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-4">
            <div className="mb-4 flex flex-wrap gap-1">
              {(["all", "pending", "approved", "declined"] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f}
                  className={cn("press rounded-full px-3 py-1.5 text-xs font-semibold capitalize", filter === f ? "bg-forest-800 text-ivory" : "bg-white text-charcoal-soft ring-1 ring-border")}>
                  {f}
                </button>
              ))}
            </div>
            {list.length === 0 ? (
              /* Motion Prompt #072 Empty state */
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-input bg-white px-6 py-14 text-center">
                <Inbox className="size-10 text-gold-500" />
                <p className="mt-3 font-serif text-lg text-forest-900">No bookings yet</p>
                <p className="mt-1 max-w-xs text-sm text-charcoal-soft">Submit an inquiry through the quote builder and it will land here instantly.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {list.map((b) => (
                  <li key={b.id} className="rounded-2xl bg-white p-4 ring-1 ring-border">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-charcoal">{b.name}</span>
                          <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold capitalize", badge[b.status])}>{b.status}</span>
                          <span className="font-mono text-xs text-charcoal-soft">{b.id}</span>
                        </p>
                        <p className="mt-1 text-sm text-charcoal-soft">
                          {EVENT_TYPES.find((e) => e.id === b.quote.eventType)?.short ?? "Event"} · {prettyDate(b.quote.date)} · {venueName(b.quote.groundId)} · {b.quote.guests} guests
                        </p>
                        <p className="mt-1 text-xs text-charcoal-soft">{b.email} · {b.phone}</p>
                        {b.notes && <p className="mt-2 rounded-lg bg-ivory p-2 text-xs text-charcoal">“{b.notes}”</p>}
                      </div>
                      <p className="font-serif text-lg font-semibold tabular-nums text-forest-900">{fmt(b.total)}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {b.status !== "approved" && (
                        <button type="button" onClick={() => approve(b.id)} className="press inline-flex items-center gap-1 rounded-full bg-forest-800 px-3 py-1.5 text-xs font-semibold text-ivory">
                          <Check className="size-3.5" /> Approve date
                        </button>
                      )}
                      {b.status !== "declined" && (
                        <button type="button" onClick={() => setBookingStatus(b.id, "declined")} className="press inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-charcoal ring-1 ring-border">
                          <X className="size-3.5" /> Decline
                        </button>
                      )}
                      {b.status !== "pending" && (
                        <button type="button" onClick={() => setBookingStatus(b.id, "pending")} className="press inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-charcoal-soft hover:bg-ivory-200">
                          <RotateCcw className="size-3.5" /> Reset
                        </button>
                      )}
                      <button type="button" onClick={() => { removeBooking(b.id); toast("Booking deleted") }} aria-label={`Delete ${b.id}`}
                        className="press ml-auto grid size-8 place-items-center rounded-full text-charcoal-soft hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="prices" className="mt-4 space-y-6">
            <p className="text-sm text-charcoal-soft">Changes apply instantly across the site and the quote builder.</p>
            {priceGroups.map((g) => (
              <fieldset key={g.key} className="rounded-2xl bg-white p-4 ring-1 ring-border">
                <legend className="px-1 font-serif text-lg text-forest-900">{g.title}</legend>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {g.items.map((it) => (
                    <label key={it.id} className="block">
                      <span className="mb-1 block text-xs font-medium text-charcoal">{it.name} <span className="text-charcoal-soft">{it.unit}</span></span>
                      <span className="flex h-10 items-center rounded-xl border border-input bg-ivory px-3 focus-within:border-gold-500 focus-within:ring-3 focus-within:ring-gold-400/30">
                        <span className="mr-2 text-xs text-charcoal-soft">KSh</span>
                        <input type="number" min={0} step={50} value={prices[g.key][it.id]}
                          onChange={(e) => setPrice(g.key, it.id, Number(e.target.value))}
                          className="w-full bg-transparent text-sm font-semibold tabular-nums outline-none" />
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <button type="button" onClick={() => { resetPrices(); toast("Prices reset to defaults") }}
              className="press inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-charcoal ring-1 ring-border">
              <RotateCcw className="size-4" /> Reset to default prices
            </button>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
