import SectionHeader from "@/components/portfolio/SectionHeader";
import {
  getVisibleGalleryItems,
  normalizeGalleryContent,
} from "@/lib/galleryContent";

export default function GallerySection({ content }) {
  const { title } = normalizeGalleryContent(content);
  const items = getVisibleGalleryItems(content);

  if (!items.length) return null;

  return (
    <section className="space-y-5 scroll-mt-[30px]" id="gallery">
      <SectionHeader>{title}</SectionHeader>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`relative overflow-hidden rounded-xl border border-border bg-surface-container-highest group hover:border-primary transition-colors ${
              item.wide ? "col-span-2 md:col-span-2" : ""
            }`}
          >
            <div className={`relative overflow-hidden ${item.wide ? "h-44" : "h-32 md:h-36"}`}>
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.imageAlt || item.caption}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
              ) : null}
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
