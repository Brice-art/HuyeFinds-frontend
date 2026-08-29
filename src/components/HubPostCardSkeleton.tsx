import { Skeleton } from "./Skeleton";

export function HubPostCardSkeleton() {
  return (
    <div className="bg-[#F7F4EE] rounded-[28px] overflow-hidden shadow-[0_10px_28px_rgba(18,26,22,0.08)] ring-1 ring-black/5 transition-all">
      <div className="relative aspect-[16/10] rounded-t-[28px] overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
        <span className="absolute top-2.5 right-2.5">
          <Skeleton className="h-[22px] w-[52px] rounded-full" />
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>

        <Skeleton className="h-5 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-11/12" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
