import { ACTIVITY_ITEMS } from "@/data/portfolio";

export default function ActivityBar({ activeActivity, onActivityChange }) {
  return (
    <aside className="flex flex-col w-12 bg-surface-container-lowest border-r border-border z-40 shrink-0">
      <div className="flex flex-col items-center pt-2 gap-1">
        {ACTIVITY_ITEMS.map((item) => {
          const isActive = activeActivity === item.id;
          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              onClick={() => onActivityChange(item.id)}
              className={`flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
                isActive
                  ? "bg-surface-container-high text-on-surface"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
