import { CONTACT } from "@/data/portfolio";
import SectionHeader from "@/components/portfolio/SectionHeader";

export default function ContactSection() {
  return (
    <section className="space-y-5 pb-16 scroll-mt-[15px]" id="contact">
      <SectionHeader>Let&apos;s Connect</SectionHeader>
      <div className="bg-surface-container-lowest border border-border rounded-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 p-5 bg-surface-container-low border-b md:border-b-0 md:border-r border-border space-y-4">
          <p className="text-sm text-on-surface-variant leading-relaxed">{CONTACT.intro}</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
              <span className="material-symbols-outlined">alternate_email</span>
              <span>{CONTACT.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
              <span className="material-symbols-outlined">share</span>
              <span>{CONTACT.social}</span>
            </div>
          </div>
        </div>
        <div className="flex-1 p-5 bg-surface-container-lowest">
          <form className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-0 transition-colors"
                placeholder="Name"
                type="text"
              />
              <input
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-0 transition-colors"
                placeholder="Email"
                type="email"
              />
            </div>
            <textarea
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-0 transition-colors"
              placeholder="How can I help?"
              rows={3}
            />
            <button className="w-full py-2 bg-on-background text-background font-bold rounded-lg hover:bg-on-surface transition-colors text-sm">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
