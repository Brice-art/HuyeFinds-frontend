import { Skeleton } from "./Skeleton";

export function PlaceDetailSkeleton() {
  return (
    <div className="lg:grid lg:grid-cols-[1.05fr_1fr] lg:gap-11 lg:px-10 lg:pt-6 lg:items-start">
      <div className="lg:sticky lg:top-6">
        <Skeleton className="w-full aspect-[5/4] lg:aspect-[4/3.3] rounded-none lg:rounded-3xl" />
        <div className="flex gap-2 px-5 lg:px-0 py-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-[74px] h-[74px] rounded-xl flex-none"
            />
          ))}
        </div>
      </div>

      <div className="lg:min-w-0">
        <div className="px-5 lg:px-0 pt-2 pb-1">
          <Skeleton className="h-3 w-40 mb-3" />
          <Skeleton className="h-7 w-2/3 mb-3" />
          <div className="flex gap-2 mb-3.5">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
          <Skeleton className="h-3 w-32" />
        </div>

        <Skeleton className="mx-5 lg:mx-0 my-4 h-16 rounded-md" />

        <div className="px-5 lg:px-0 flex flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}
