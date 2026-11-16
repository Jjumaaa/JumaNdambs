import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { img } from "@/data"
import { cn } from "@/lib/utils"

export type LightboxImage = { src: string; alt: string }

/** Photo gallery modal (Motion Prompt picks #049 Modal + #058 Carousel, via shadcn Dialog / Embla). */
export function Lightbox({ title, images, index, onClose }: {
  title: string; images: LightboxImage[]; index: number | null; onClose: () => void
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(index ?? 0)

  useEffect(() => {
    if (!api) return
    const on = () => setCurrent(api.selectedScrollSnap())
    api.on("select", on)
    return () => { api.off("select", on) }
  }, [api])

  return (
    <Dialog open={index !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] gap-3 bg-forest-950 p-3 text-ivory ring-gold-400/20 sm:max-w-4xl sm:p-5">
        <div className="pr-10">
          <DialogTitle className="font-serif text-xl text-ivory">{title}</DialogTitle>
          <DialogDescription className="text-ivory/60">
            Photo {current + 1} of {images.length} · swipe or use the arrow keys
          </DialogDescription>
        </div>
        {index !== null && (
          <Carousel setApi={setApi} opts={{ startIndex: index, loop: true }} className="w-full">
            <CarouselContent>
              {images.map((im) => (
                <CarouselItem key={im.src}>
                  <img src={img(im.src, 1600)} alt={im.alt} className="aspect-[3/2] w-full rounded-lg object-cover" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-3 border-0 bg-ivory/85 text-forest-900 hover:bg-ivory" />
            <CarouselNext className="right-3 border-0 bg-ivory/85 text-forest-900 hover:bg-ivory" />
          </Carousel>
        )}
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Thumbnails">
          {images.map((im, i) => (
            <button key={im.src} type="button" role="tab" aria-selected={i === current} aria-label={`Show photo ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={cn("press h-14 w-20 shrink-0 overflow-hidden rounded-md ring-2 transition-opacity", i === current ? "ring-gold-400" : "opacity-60 ring-transparent hover:opacity-100")}>
              <img src={img(im.src, 200)} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
