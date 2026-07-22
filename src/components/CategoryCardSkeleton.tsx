import { Skeleton } from "./Skeleton";

export function CategoryCardSkeleton() {
  return (
    <div className="flex-none w-[104px] md:w-auto bg-surface rounded-md p-4 md:p-5 text-center shadow-soft border border-border">
      <Skeleton className="w-11 h-11 rounded-xl mx-auto mb-2.5" />
      <Skeleton className="h-3.5 w-14 mx-auto mb-1.5" />
      <Skeleton className="h-2.5 w-10 mx-auto" />
    </div>
  );
}
