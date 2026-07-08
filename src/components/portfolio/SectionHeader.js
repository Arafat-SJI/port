export default function SectionHeader({ children, titleClassName = "text-2xl" }) {
  return (
    <h2
      className={`inline-flex items-baseline gap-1 leading-none ${titleClassName} text-on-surface font-semibold`}
    >
      {children}
      <span className="h-px w-[95px] shrink-0 bg-on-surface" aria-hidden />
    </h2>
  );
}
