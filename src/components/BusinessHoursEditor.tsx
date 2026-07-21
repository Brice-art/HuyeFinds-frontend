export interface DraftHour {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

const DAYS: { key: string; label: string }[] = [
  { key: "MONDAY", label: "Mon" },
  { key: "TUESDAY", label: "Tue" },
  { key: "WEDNESDAY", label: "Wed" },
  { key: "THURSDAY", label: "Thu" },
  { key: "FRIDAY", label: "Fri" },
  { key: "SATURDAY", label: "Sat" },
  { key: "SUNDAY", label: "Sun" },
];

export function createDefaultHours(): DraftHour[] {
  return DAYS.map((d) => ({ dayOfWeek: d.key, openTime: "08:00", closeTime: "18:00", isClosed: false }));
}

interface BusinessHoursEditorProps {
  hours: DraftHour[];
  onChange: (hours: DraftHour[]) => void;
}

export function BusinessHoursEditor({ hours, onChange }: BusinessHoursEditorProps) {
  function updateDay(index: number, patch: Partial<DraftHour>) {
    onChange(hours.map((h, i) => (i === index ? { ...h, ...patch } : h)));
  }

  return (
    <div className="flex flex-col gap-2">
      {hours.map((h, i) => {
        const label = DAYS.find((d) => d.key === h.dayOfWeek)?.label ?? h.dayOfWeek;
        return (
          <div key={h.dayOfWeek} className="flex items-center gap-3">
            <span className="w-9 text-[12.5px] font-semibold text-ink flex-none">{label}</span>

            {h.isClosed ? (
              <span className="flex-1 text-[12.5px] text-ink-faint">Closed</span>
            ) : (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="time"
                  value={h.openTime}
                  onChange={(e) => updateDay(i, { openTime: e.target.value })}
                  className="border border-border rounded-md px-2.5 py-1.5 text-[12.5px] font-mono outline-none focus:border-primary bg-surface"
                />
                <span className="text-ink-faint text-[12px]">–</span>
                <input
                  type="time"
                  value={h.closeTime}
                  onChange={(e) => updateDay(i, { closeTime: e.target.value })}
                  className="border border-border rounded-md px-2.5 py-1.5 text-[12.5px] font-mono outline-none focus:border-primary bg-surface"
                />
              </div>
            )}

            <label className="flex items-center gap-1.5 text-[11.5px] text-ink-soft flex-none">
              <input
                type="checkbox"
                checked={h.isClosed}
                onChange={(e) => updateDay(i, { isClosed: e.target.checked })}
                className="accent-primary"
              />
              Closed
            </label>
          </div>
        );
      })}
    </div>
  );
}