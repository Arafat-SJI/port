"use client";

import { parseIntroSegments } from "@/lib/aboutContent";

export default function HeroSection({ content, onNavigateSection }) {
  const {
    headlinePrefix,
    headlineHighlight,
    headlineSuffix,
    intro,
    primaryCta,
    secondaryCta,
    cvUrl,
    imageUrl,
  } = content;

  const segments = parseIntroSegments(intro);
  const hasCv = Boolean(cvUrl?.trim());
  const hasImage = Boolean(imageUrl?.trim());

  return (
    <section className="text-center md:text-left">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4 min-w-0">
          <h1 className="text-4xl text-on-surface tracking-tight leading-tight">
            {headlinePrefix}
            <span className="text-primary">{headlineHighlight}</span>
            {headlineSuffix}
          </h1>
          <p className="text-base text-on-surface-variant max-w-xl leading-relaxed">
            {segments.map((seg, i) =>
              seg.type === "bold" ? (
                <span key={i} className="text-on-surface font-semibold">
                  {seg.value}
                </span>
              ) : (
                <span key={i}>{seg.value}</span>
              )
            )}
          </p>
          <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
            <button
              type="button"
              onClick={() => onNavigateSection?.("#projects")}
              className="px-6 py-2 bg-primary text-on-primary font-semibold rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/10 text-sm cursor-pointer"
            >
              {primaryCta}
            </button>
            {hasCv ? (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-surface-container-low border border-border text-on-surface font-semibold rounded-lg hover:bg-surface-container-highest transition-all text-sm inline-flex items-center cursor-pointer"
              >
                {secondaryCta}
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="CV not uploaded yet"
                className="px-6 py-2 bg-surface-container-low border border-border text-on-surface/40 font-semibold rounded-lg text-sm cursor-not-allowed"
              >
                {secondaryCta}
              </button>
            )}
          </div>
        </div>

        {hasImage ? (
          <div className="shrink-0 order-first md:order-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="w-36 sm:w-44 aspect-[6/10] rounded-2xl object-cover bg-surface-container-low border border-primary/30 shadow-[0_0_14px_rgb(173_198_255/0.22)]"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
