import { Clock, Mail, MapPin, MessageCircle, Phone, Settings2 } from "lucide-react"
import { Logo, NAV } from "@/components/Navbar"

// Placeholder contact details: replace with the real business info before launch.
const PHONE = "+254 700 000 000"
const WHATSAPP = "254700000000"
const EMAIL = "events@jumandambs.co.ke"

const Social = ({ label, d }: { label: string; d: string }) => (
  <a href="#" aria-label={label} className="press grid size-10 place-items-center rounded-full bg-ivory/10 text-ivory transition-colors hover:bg-gold-500 hover:text-forest-950">
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden><path d={d} /></svg>
  </a>
)

export function Footer({ onAdmin }: { onAdmin: () => void }) {
  return (
    <footer id="contact" className="bg-forest-950 text-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr_1.3fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/65">
            Outdoor event grounds, tent hire and full-service catering for weddings, graduations and every milestone worth celebrating.
          </p>
          <div className="mt-6 flex gap-2">
            <Social label="Instagram" d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 4.9a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8zm0 8.1a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.1-9.4a1.2 1.2 0 1 0 0 2.3 1.2 1.2 0 0 0 0-2.3z" />
            <Social label="Facebook" d="M14 8.5V6.6c0-.9.6-1.1 1-1.1h2.6V1.6L14 1.5c-4 0-4.9 3-4.9 4.9v2.1H6.8v4h2.3V22.5H14V12.5h3.3l.4-4H14z" />
            <Social label="TikTok" d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.2v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.6a5.8 5.8 0 1 0 5 5.8V9.1a7.4 7.4 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-3.2-1.5z" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <p className="eyebrow mb-4 text-gold-400">Explore</p>
            <ul className="space-y-2.5">
              {NAV.map((n) => <li key={n.href}><a href={n.href} className="text-ivory/70 hover:text-ivory">{n.label}</a></li>)}
              <li><a href="#faq" className="text-ivory/70 hover:text-ivory">FAQ</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-gold-400">Visit & call</p>
            <ul className="space-y-3 text-ivory/70">
              <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" />Karen, off Langata Road, Nairobi</li>
              <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0 text-gold-400" /><a href={`tel:${PHONE.replace(/\s/g, "")}`} className="hover:text-ivory">{PHONE}</a></li>
              <li className="flex gap-2"><Mail className="mt-0.5 size-4 shrink-0 text-gold-400" /><a href={`mailto:${EMAIL}`} className="break-all hover:text-ivory">{EMAIL}</a></li>
              <li className="flex gap-2"><Clock className="mt-0.5 size-4 shrink-0 text-gold-400" /><span>Viewings Mon–Sat 8 AM–6 PM<br />Sun 10 AM–4 PM</span></li>
            </ul>
          </div>
        </div>

        <div>
          <div className="overflow-hidden rounded-2xl ring-1 ring-ivory/10">
            <iframe title="Map to Jumandambs grounds" src="https://www.google.com/maps?q=Karen,+Nairobi&z=13&output=embed"
              className="h-56 w-full grayscale-[30%]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Jumandambs, I'd like to ask about an event.")}`} target="_blank" rel="noreferrer"
            className="press mt-4 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#073b1f] hover:brightness-105">
            <MessageCircle className="size-4" /> Chat with us on WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-ivory/50 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Jumandambs Events. Photos via Unsplash.</p>
          <button type="button" onClick={onAdmin} className="press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-ivory/50 transition-colors hover:bg-ivory/10 hover:text-ivory">
            <Settings2 className="size-3.5" /> Admin demo
          </button>
        </div>
      </div>
      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
        className="press fixed right-4 bottom-4 z-30 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl ring-4 ring-white/60 sm:right-6 sm:bottom-6">
        <MessageCircle className="size-6" />
      </a>
    </footer>
  )
}
