"use client";

import {
  normalizeAboutVisibility,
  parseIntroSegments,
} from "@/lib/aboutContent";

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
    visibility: visibilityRaw,
  } = content;

  const visibility = normalizeAboutVisibility(visibilityRaw);
  const segments = parseIntroSegments(intro);
  const hasCv = Boolean(cvUrl?.trim());
  const showImage = visibility.image && Boolean(imageUrl?.trim());
  const showHeadline = visibility.headline;
  const showIntro = visibility.intro;
  const showPrimary = visibility.primaryCta;
  const showSecondary = visibility.secondaryCta;
  const showCtas = showPrimary || showSecondary;
  const showBottom = showIntro || showCtas;

  if (!showHeadline && !showImage && !showBottom) {
    return null;
  }

  return (
    <section className="text-left">
      <div
        className={
          showImage
            ? "grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-4 items-center min-[501px]:items-start"
            : "space-y-4"
        }
      >
        {showHeadline ? (
          <h1 className="min-w-0 text-2xl sm:text-3xl md:text-4xl text-on-surface tracking-tight leading-tight">
            {headlinePrefix}
            <span className="text-primary">{headlineHighlight}</span>
            {headlineSuffix}
          </h1>
        ) : showImage ? (
          <div className="min-w-0" aria-hidden />
        ) : null}

        {showImage ? (
          <div
            className={`shrink-0 self-center min-[501px]:self-start ${
              showHeadline || showBottom
                ? "row-start-1 col-start-2 min-[501px]:row-span-2"
                : "row-start-1 col-start-2"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="w-24 min-[501px]:w-40 md:w-44 aspect-[10/12] md:rounded-2xl rounded-md object-cover bg-surface-container-low border border-primary/10 shadow-[0_0_14px_rgb(173_198_255/0.22)]"
            />
          </div>
        ) : null}

        {showBottom ? (
          <div
            className={
              showImage
                ? "col-span-2 min-[501px]:col-span-1 space-y-4 min-w-0"
                : "space-y-4"
            }
          >
            {showIntro ? (
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
            ) : null}

            {showCtas ? (
              <div className="flex flex-wrap gap-3 pt-2 justify-start">
                {showPrimary ? (
                  <button
                    type="button"
                    onClick={() => onNavigateSection?.("#projects")}
                    className="px-6 py-2 bg-primary text-on-primary font-semibold rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/10 text-sm cursor-pointer"
                  >
                    {primaryCta}
                  </button>
                ) : null}
                {showSecondary ? (
                  hasCv ? (
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
                  )
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
