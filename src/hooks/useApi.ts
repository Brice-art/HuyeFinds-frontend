import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category, Paginated, PlaceDetail, PlaceSummary } from "@/types";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useApiGet<T>(path: string | null, deps: unknown[] = []): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: !!path, error: null });

  useEffect(() => {
    if (!path) return;
    let cancelled = false;

    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .get<T>(path)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, loading: false, error: err.message ?? "Something went wrong" });
      });

    // Guards against setting state after unmount/re-fetch — a real bug
    // class in React, not paranoia: without this, a slow first request
    // resolving after a second faster one has already landed can stomp
    // the newer data with stale results.
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

export function useCategories() {
  return useApiGet<{ items: Category[] }>("/categories");
}

export function usePlaces(query: string) {
  return useApiGet<Paginated<PlaceSummary>>(`/places${query}`, [query]);
}

export function usePlaceDetail(slug: string | undefined) {
  return useApiGet<PlaceDetail>(slug ? `/places/${slug}` : null, [slug]);
}

export function useSimilarPlaces(slug: string | undefined) {
  return useApiGet<{ items: PlaceSummary[] }>(slug ? `/places/${slug}/similar` : null, [slug]);
}
