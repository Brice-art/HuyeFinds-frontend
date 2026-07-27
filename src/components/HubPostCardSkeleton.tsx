import { Skeleton } from "./Skeleton";

export function HubPostCardSkeleton() {
  return (
    <div className="w-[100%] h-[100px] md:h-[200px] md:w-[100%] bg-surface border border-border rounded-lg p-4 flex flex-col gap-2 justify-between">
      <div className="flex items-center justify-between">
        <Skeleton className="h-[20px] w-[60px] font-semibold px-2.5 py-1 rounded-md" />

        <Skeleton className="text-[11px] text-ink-faint" />
      </div>

      <div className="flex items-center justify-between mt-1 pt-2 border-t border-border">
        <Skeleton className="text-[11.5px] text-ink-faint" />

        <Skeleton className="text-[11.5px] font-semibold text-heart" />
      </div>
    </div>
  );
}
