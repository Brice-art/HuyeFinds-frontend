import { useState } from "react";

export interface DraftMenuItem {
  name: string;
  price: string;
  note: string;
}

interface MenuItemsEditorProps {
  items: DraftMenuItem[];
  onChange: (items: DraftMenuItem[]) => void;
}

const rowInputClass =
  "border border-border rounded-md px-3 py-2 text-[13px] outline-none focus:border-primary bg-surface";

export function MenuItemsEditor({ items, onChange }: MenuItemsEditorProps) {
  const [draft, setDraft] = useState<DraftMenuItem>({ name: "", price: "", note: "" });

  function addRow() {
    if (!draft.name.trim() || !draft.price.trim()) return;
    onChange([...items, draft]);
    setDraft({ name: "", price: "", note: "" });
  }

  function removeRow(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between bg-surface border border-border rounded-md px-3.5 py-2.5">
              <div className="min-w-0">
                <div className="text-[13px] font-semibold truncate">{item.name}</div>
                {item.note && <div className="text-[11px] text-ink-soft truncate">{item.note}</div>}
              </div>
              <div className="flex items-center gap-3 flex-none">
                <span className="text-[12px] font-mono text-ink-soft">{item.price} RWF</span>
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  aria-label={`Remove ${item.name}`}
                  className="text-heart text-[12px] font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-[1fr_90px_1fr_auto] gap-2 items-start">
        <input
          type="text"
          placeholder="Item name"
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          className={rowInputClass}
        />
        <input
          type="number"
          min="0"
          step="1"
          placeholder="Price"
          value={draft.price}
          onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
          className={`${rowInputClass} font-mono`}
        />
        <input
          type="text"
          placeholder="Note (optional)"
          value={draft.note}
          onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
          className={rowInputClass}
        />
        <button
          type="button"
          onClick={addRow}
          className="px-3.5 py-2 rounded-md bg-primary-tint text-primary text-[12.5px] font-semibold"
        >
          Add
        </button>
      </div>
    </div>
  );
}