export default function MacTrafficLights() {
  return (
    <div
      className="flex items-center gap-[6px] px-2 shrink-0 h-full"
      aria-hidden
    >
      <span className="mac-traffic-light mac-traffic-close" />
      <span className="mac-traffic-light mac-traffic-minimize" />
      <span className="mac-traffic-light mac-traffic-maximize" />
    </div>
  );
}
