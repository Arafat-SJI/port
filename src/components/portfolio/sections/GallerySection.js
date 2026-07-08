import { GALLERY } from "@/data/portfolio";
import SectionHeader from "@/components/portfolio/SectionHeader";

export default function GallerySection() {
  return (
    <section className="space-y-5 scroll-mt-[15px]" id="gallery">
      <SectionHeader>Gallery</SectionHeader>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {GALLERY.map((item) => (
          <div
            key={item.caption}
            className={`relative overflow-hidden rounded-xl border border-border bg-surface-container-highest group hover:border-primary transition-colors ${
              item.wide ? "col-span-2 md:col-span-2" : ""
            }`}
          >
            <div className={`relative overflow-hidden ${item.wide ? "h-44" : "h-32 md:h-36"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest/90 via-transparent to-transparent" />
              <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-on-surface">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
