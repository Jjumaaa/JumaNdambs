import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { GROUNDS, seedBookedSlots } from "@/data"
import { DEFAULT_PRICES, EMPTY_QUOTE, type Prices, type QuoteInput } from "@/lib/pricing"

export type BookingStatus = "pending" | "approved" | "declined"
export type Booking = {
  id: string
  createdAt: string
  status: BookingStatus
  name: string
  email: string
  phone: string
  notes: string
  quote: QuoteInput
  total: number
}
type Slot = { date: string; groundId: string }

type Store = {
  prices: Prices
  setPrice: (group: keyof Prices, id: string, value: number) => void
  resetPrices: () => void
  bookings: Booking[]
  addBooking: (b: Omit<Booking, "id" | "createdAt" | "status">) => Booking
  setBookingStatus: (id: string, s: BookingStatus) => void
  removeBooking: (id: string) => void
  /** Ground ids already taken on a date (seed + approved bookings). */
  takenOn: (date: string) => string[]
  isFullyBooked: (date: string) => boolean
  quote: QuoteInput
  setQuote: (patch: Partial<QuoteInput> | ((q: QuoteInput) => QuoteInput)) => void
  resetQuote: () => void
}

const Ctx = createContext<Store | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
}

const SEED = seedBookedSlots()

export function StoreProvider({ children }: { children: ReactNode }) {
  const [prices, setPrices] = useState<Prices>(() => {
    const saved = load<Prices | null>("jd.prices.v1", null)
    return saved ? { ...DEFAULT_PRICES, ...saved } : DEFAULT_PRICES
  })
  const [bookings, setBookings] = useState<Booking[]>(() => load("jd.bookings.v1", []))
  const [quote, setQuoteState] = useState<QuoteInput>(EMPTY_QUOTE)

  useEffect(() => save("jd.prices.v1", prices), [prices])
  useEffect(() => save("jd.bookings.v1", bookings), [bookings])

  const setPrice = useCallback((group: keyof Prices, id: string, value: number) => {
    setPrices((p) => ({ ...p, [group]: { ...p[group], [id]: Math.max(0, value) } }))
  }, [])

  const addBooking: Store["addBooking"] = useCallback((b) => {
    const booking: Booking = {
      ...b,
      id: `JD-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: "pending",
    }
    setBookings((all) => [booking, ...all])
    return booking
  }, [])

  const slots = useMemo<Slot[]>(() => [
    ...SEED,
    ...bookings.filter((b) => b.status === "approved" && b.quote.date && b.quote.groundId)
      .map((b) => ({ date: b.quote.date, groundId: b.quote.groundId })),
  ], [bookings])

  const takenOn = useCallback((date: string) => slots.filter((s) => s.date === date).map((s) => s.groundId), [slots])
  const isFullyBooked = useCallback(
    (date: string) => GROUNDS.every((g) => slots.some((s) => s.date === date && s.groundId === g.id)),
    [slots],
  )

  const setQuote: Store["setQuote"] = useCallback((patch) => {
    setQuoteState((q) => (typeof patch === "function" ? patch(q) : { ...q, ...patch }))
  }, [])

  const value: Store = {
    prices, setPrice, resetPrices: () => setPrices(DEFAULT_PRICES),
    bookings, addBooking,
    setBookingStatus: (id, s) => setBookings((all) => all.map((b) => (b.id === id ? { ...b, status: s } : b))),
    removeBooking: (id) => setBookings((all) => all.filter((b) => b.id !== id)),
    takenOn, isFullyBooked,
    quote, setQuote, resetQuote: () => setQuoteState(EMPTY_QUOTE),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error("useStore outside StoreProvider")
  return s
}
