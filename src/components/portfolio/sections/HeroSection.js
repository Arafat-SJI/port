export default function HeroSection() {
  return (
    <section className="text-center md:text-left">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl text-on-surface tracking-tight leading-tight">
            Crafting digital <span className="text-primary">intelligence</span> &amp; architecture.
          </h1>
          <p className="text-base text-on-surface-variant max-w-xl leading-relaxed">
            I&apos;m <span className="text-on-surface font-semibold">Arafat</span>, a Software
            Engineer focused on building high-performance AI-driven experiences and scalable
            backend architectures.
          </p>
          <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
            <button className="px-6 py-2 bg-primary text-on-primary font-semibold rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/10 text-sm">
              View Projects
            </button>
            <button className="px-6 py-2 bg-surface-container-low border border-border text-on-surface font-semibold rounded-lg hover:bg-surface-container-highest transition-all text-sm">
              Download CV
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
