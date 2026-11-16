import { useEffect, useRef, useState } from "react"
import { Menu, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"

export const NAV = [
  { href: "#home", label: "Home" },
  { href: "#grounds", label: "Grounds" },
  { href: "#events", label: "Events" },
  { href: "#catering", label: "Catering Packages" },
  { href: "#tents", label: "Tent Hire" },
  { href: "#gallery", label: "Gallery" },
]

export function Logo({ light }: { light?: boolean }) {
  return (
    <a href="#home" className="flex items-center gap-2.5" aria-label="Jumandambs home">
      <span className="grid size-9 place-items-center rounded-full bg-forest-800 text-gold-400 ring-1 ring-gold-400/50">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M3 19 12 5l9 14M7.5 19 12 12l4.5 7M2 19h20" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={`font-serif text-xl font-semibold tracking-tight ${light ? "text-ivory" : "text-forest-900"}`}>
        Jumandambs
      </span>
    </a>
  )
}

/**
 * Motion Prompt #075 Sticky header · MIT License (c) 2026 Shohei Ohtaki · https://showheyohtaki.github.io/motion-prompt/#075
 * Announcement strip scrolls away; the header sticks at top: 0 and its shadow fades 0→0.16 over the next 24 px.
 */
export function Navbar() {
  const [open, setOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const STRIP = 36

  useEffect(() => {
    const el = header.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const sh = Math.min(1, Math.max(0, (window.scrollY - STRIP) / 24))
        el.style.setProperty("--sh", String(sh))
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div className="flex h-9 items-center justify-center gap-2 bg-forest-950 px-4 text-center text-xs text-gold-200">
        <Sparkles className="size-3.5 shrink-0 text-gold-400" aria-hidden />
        <span className="truncate">Now booking the 2027 wedding & graduation season · 10% off weekday events</span>
      </div>
      <header ref={header} className="glass sticky top-0 z-40 border-b border-white/40 bg-ivory/75 backdrop-blur-xl backdrop-saturate-150">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Main">
          <Logo />
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="rounded-full px-3 py-2 text-sm font-medium text-charcoal/80 transition-colors hover:bg-forest-50 hover:text-forest-800">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a href="#quote" className="press hidden rounded-full bg-forest-800 px-5 py-2.5 text-sm font-semibold text-ivory shadow-sm ring-1 ring-gold-400/40 transition-colors hover:bg-forest-700 sm:inline-flex">
              Book / Get a Quote
            </a>
            <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}
              className="press grid size-10 place-items-center rounded-full text-forest-900 hover:bg-forest-50 lg:hidden">
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
        <div className="header-shadow" aria-hidden />
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="bg-ivory p-6">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Logo />
          <ul className="mt-6 flex flex-col gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 font-serif text-lg text-forest-900 hover:bg-forest-50">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#quote" onClick={() => setOpen(false)} className="press mt-4 rounded-full bg-forest-800 px-5 py-3 text-center font-semibold text-ivory">
            Book / Get a Quote
          </a>
        </SheetContent>
      </Sheet>
    </>
  )
}
