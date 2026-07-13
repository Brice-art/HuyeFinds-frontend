import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

// Extracted so a single place's favorite state can be driven by more than
// one control on the same page (e.g. the cover-image heart AND the
// sticky "Save to Favorites" button on the details page) without them
// drifting out of sync — lift the state up, don't duplicate it.
export function useFavoriteToggle(placeId: string, initialFavorited = false) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setFavorited(initialFavorited);
  }, [placeId, initialFavorited]);

  async function toggle() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (pending) return;

    setFavorited((f) => !f); // optimistic
    setPending(true);
    try {
      await api.post<{ favorited: boolean }>("/favorites/toggle", { placeId });
    } catch (err) {
      setFavorited((f) => !f); // rollback
      if (!(err instanceof ApiError)) console.error(err);
    } finally {
      setPending(false);
    }
  }

  return { favorited, pending, toggle };
}
