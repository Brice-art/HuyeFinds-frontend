import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { PlaceCard } from "@/components/PlaceCard";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import type { PlaceSummary } from "@/types";
import { PlaceCardSkeleton } from "@/components/PlaceCardSkeleton";

export function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [places, setPlaces] = useState<PlaceSummary[] | null>(null);

  useEffect(() => {
    if (!user) return;
    api
      .get<{ items: PlaceSummary[] }>("/favorites")
      .then((res) => setPlaces(res.items));
  }, [user]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="px-5 md:px-10 py-6">
      <h1 className="font-display text-2xl font-semibold mb-4">
        Your favorites
      </h1>

      {places !== null && places.length === 0 && (
        <p className="text-sm text-ink-faint">
          Nothing saved yet — tap the heart icon on any place to add it here.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 lg:gap-5">
        {places === null
          ? Array.from({ length: 4 }).map((_, i) => (
              <PlaceCardSkeleton key={i} />
            ))
          : places.map((p) => <PlaceCard key={p.id} place={p} />)}
      </div>
    </div>
  );
}
