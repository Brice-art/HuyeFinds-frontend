interface PriceTagProps {
  min?: number;
  max?: number;
  label?: string; // for non-range prices, e.g. "50 RWF / page"
  size?: "sm" | "lg";
}

function formatRwf(n: number) {
  return `${n.toLocaleString("en-RW")} RWF`;
}

export function PriceTag({ min, max, label, size = "sm" }: PriceTagProps) {
  const text = label ?? (min !== undefined && max !== undefined && min !== max
    ? `${min.toLocaleString("en-RW")}–${max.toLocaleString("en-RW")} RWF`
    : min !== undefined
      ? formatRwf(min)
      : "");

  return (
    <span
      className={`price-tag inline-flex items-center gap-1.5 bg-accent text-primary-dark font-mono font-semibold pl-3 ${
        size === "lg" ? "text-[15px] py-2 pr-4" : "text-[12.5px] py-1 pr-2.5"
      }`}
    >
      {text}
    </span>
  );
}
