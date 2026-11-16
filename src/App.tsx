import { useState } from "react"
import { Toaster } from "@/components/ui/sonner"
import { StoreProvider } from "@/store"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Grounds } from "@/components/Grounds"
import { Events } from "@/components/Events"
import { Catering } from "@/components/Catering"
import { Tents } from "@/components/Tents"
import { QuoteBuilder } from "@/components/QuoteBuilder"
import { FAQ, Gallery, Testimonials } from "@/components/Social"
import { Footer } from "@/components/Footer"
import { Admin } from "@/components/Admin"

export default function App() {
  const [admin, setAdmin] = useState(false)
  return (
    <StoreProvider>
      <a href="#main" className="sr-only z-50 rounded-lg bg-forest-800 px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Grounds />
        <Events />
        <Catering />
        <Tents />
        <QuoteBuilder />
        <Gallery />
        <Testimonials />
        <FAQ />
      </main>
      <Footer onAdmin={() => setAdmin(true)} />
      <Admin open={admin} onOpenChange={setAdmin} />
      <Toaster theme="light" position="top-right" richColors closeButton />
    </StoreProvider>
  )
}
