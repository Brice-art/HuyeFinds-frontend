import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category, Paginated, PlaceDetail, PlaceSummary } from "@/types";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useApiGet<T>(
  path: string | null,
  deps: unknown[] = [],
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: !!path,
    error: null,
  });

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
        if (!cancelled)
          setState({
            data: null,
            loading: false,
            error: err.message ?? "Something went wrong",
          });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

// --- Categories: shared cache + in-flight dedup ---------------------
// Navbar, HomePage, and LandingPage each call useCategories() independently
// — this was firing 2-3 separate identical requests on a normal page load.
// Categories rarely change at runtime, so cache the result at module scope
// and share one in-flight request across every mount point instead. Resets
// naturally on a full page reload (JS module state, not persisted).
let categoriesCache: { items: Category[] } | null = null;
let categoriesInFlight: Promise<{ items: Category[] }> | null = null;

function fetchCategoriesShared(): Promise<{ items: Category[] }> {
  if (categoriesCache) return Promise.resolve(categoriesCache);
  if (!categoriesInFlight) {
    categoriesInFlight = api
      .get<{ items: Category[] }>("/categories")
      .then((data) => {
        categoriesCache = data;
        categoriesInFlight = null;
        return data;
      })
      .catch((err) => {
        categoriesInFlight = null;
        throw err;
      });
  }
  return categoriesInFlight;
}

export function useCategories(): FetchState<{ items: Category[] }> {
  const [state, setState] = useState<FetchState<{ items: Category[] }>>({
    data: categoriesCache,
    loading: !categoriesCache,
    error: null,
  });

  useEffect(() => {
    if (categoriesCache) return;
    let cancelled = false;

    fetchCategoriesShared()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({
            data: null,
            loading: false,
            error: err.message ?? "Something went wrong",
          });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export function usePlaces(query: string) {
  return useApiGet<Paginated<PlaceSummary>>(`/places${query}`, [query]);
}

export function usePlaceDetail(slug: string | undefined) {
  return useApiGet<PlaceDetail>(slug ? `/places/${slug}` : null, [slug]);
}

export function useSimilarPlaces(slug: string | undefined) {
  return useApiGet<{ items: PlaceSummary[] }>(
    slug ? `/places/${slug}/similar` : null,
    [slug],
  );
}
