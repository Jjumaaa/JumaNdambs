import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Motion Prompt #074 Fade-in on scroll · MIT License (c) 2026 Shohei Ohtaki · https://showheyohtaki.github.io/motion-prompt/#074
 * Fires when the element's top passes 85% of the viewport; resets when it leaves past the bottom so it plays again.
 */
export function Reveal({
  children, className, delay = 0, as: Tag = "div", ...rest
}: { children: ReactNode; className?: string; delay?: number; as?: ElementType } & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced() || !("IntersectionObserver" in window)) { el.classList.add("is-in"); return }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.classList.add("is-in")
        else if (e.boundingClientRect.top > window.innerHeight) el.classList.remove("is-in")
      },
      { rootMargin: "0px 0px -15% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={cn("reveal", className)} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties} {...rest}>
      {children}
    </Tag>
  )
}

/**
 * Motion Prompt #007 Count-up · MIT License (c) 2026 Shohei Ohtaki · https://showheyohtaki.github.io/motion-prompt/#007
 * value = round(target × (1 − (1 − p)^4)) over 2.45 s, then a small landing bounce 1 + 0.07·e^(−7t)·cos(15t).
 * Written straight to the DOM node (no React state per frame).
 */
export function CountUp({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const final = `${to.toLocaleString("en-US")}${suffix}`
    if (reduced()) { el.textContent = final; return }
    let raf = 0
    const run = () => {
      const start = performance.now()
      const DUR = 2450
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / DUR)
        el.textContent = `${Math.round(to * (1 - Math.pow(1 - p, 4))).toLocaleString("en-US")}${suffix}`
        if (p < 1) raf = requestAnimationFrame(tick)
        else {
          const frames = Array.from({ length: 13 }, (_, i) => {
            const t = (i / 12) * 0.6
            return { transform: `scale(${1 + 0.07 * Math.exp(-7 * t) * Math.cos(15 * t)})` }
          })
          frames[frames.length - 1] = { transform: "scale(1)" }
          el.animate(frames, { duration: 600, easing: "linear" })
        }
      }
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect() } }, { threshold: 0.6 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to, suffix])
  return <span ref={ref} className={cn("inline-block tabular-nums", className)}>0{suffix}</span>
}

/**
 * Motion Prompt #063 Stepper (+/−) · MIT License (c) 2026 Shohei Ohtaki · https://showheyohtaki.github.io/motion-prompt/#063
 * The number pops 1.18 → 1 linearly over 0.25 s, accent-coloured meanwhile, on each press.
 */
export function Stepper({
  value, onChange, min = 0, max = 9999, step = 1, label, size = "md",
}: { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; label: string; size?: "sm" | "md" }) {
  const num = useRef<HTMLInputElement>(null)
  const bump = (next: number) => {
    const v = Math.min(max, Math.max(min, next))
    if (v === value) return
    onChange(v)
    if (!reduced()) {
      num.current?.animate(
        [{ transform: "scale(1.18)", color: "var(--color-gold-600)" }, { transform: "scale(1)" }],
        { duration: 250, easing: "linear" },
      )
    }
  }
  const h = size === "sm" ? "h-9" : "h-11"
  return (
    <div className={cn("inline-flex items-stretch rounded-xl border border-input bg-white", h)} role="group" aria-label={label}>
      <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min}
        onClick={() => bump(value - step)}
        className="press grid w-10 place-items-center rounded-l-xl text-charcoal-soft hover:bg-gold-100 active:bg-gold-100 disabled:opacity-40">
        <Minus className="size-4" />
      </button>
      <input
        ref={num} inputMode="numeric" aria-label={label} value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/\D/g, "") || "0", 10)
          onChange(Math.min(max, n))
        }}
        onBlur={() => value < min && onChange(min)}
        className={cn("w-16 border-x border-input bg-transparent text-center font-semibold tabular-nums text-charcoal outline-none focus-visible:bg-gold-100/50", size === "sm" && "w-12 text-sm")}
      />
      <button type="button" aria-label={`Increase ${label}`} disabled={value >= max}
        onClick={() => bump(value + step)}
        className="press grid w-10 place-items-center rounded-r-xl text-forest-700 hover:bg-gold-100 active:bg-gold-100 disabled:opacity-40">
        <Plus className="size-4" />
      </button>
    </div>
  )
}

export function SectionHeading({ eyebrow, title, intro, light, center = true }: {
  eyebrow: string; title: ReactNode; intro?: ReactNode; light?: boolean; center?: boolean
}) {
  return (
    <Reveal className={cn("mx-auto mb-12 max-w-2xl", center && "text-center")}>
      <p className={cn("eyebrow mb-3", light ? "text-gold-400" : "text-gold-600")}>{eyebrow}</p>
      <h2 className={cn("display-lg font-medium", light ? "text-ivory" : "text-forest-900")}>{title}</h2>
      {intro && <p className={cn("mt-4 text-base leading-relaxed", light ? "text-ivory/75" : "text-charcoal-soft")}>{intro}</p>}
    </Reveal>
  )
}
