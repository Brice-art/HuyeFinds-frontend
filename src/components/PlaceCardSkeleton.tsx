import { Skeleton } from "./Skeleton";

interface PlaceCardSkeletonProps {
  variant?: "grid" | "rail";
}

export function PlaceCardSkeleton({
  variant = "grid",
}: PlaceCardSkeletonProps) {
  const isRail = variant === "rail";

  return (
    <div
      className={
        isRail
          ? "flex-none w-[240px] md:w-[266px] bg-surface rounded-lg overflow-hidden shadow-soft border border-border flex flex-col"
          : "w-full bg-surface rounded-lg overflow-hidden shadow-soft border border-border flex flex-row sm:flex-col"
      }
    >
      <Skeleton
        className={
          isRail
            ? "aspect-[4/3] rounded-none"
            : "w-28 flex-none rounded-none sm:w-full sm:aspect-[4/3] sm:flex-auto"
        }
      />
      <div className="p-3 sm:p-3.5 flex flex-col gap-2 flex-1 min-w-0 justify-center sm:justify-start">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between mt-1.5 gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
