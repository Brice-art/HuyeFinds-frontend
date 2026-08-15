import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

export function useHubPostToggle(
  hubPostId: string,
  action: "like" | "save",
  initialActive: boolean,
) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState(initialActive);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (pending || !hubPostId) return;

    setActive((a) => !a);
    setPending(true);
    try {
      await api.post(`/hub-posts/${hubPostId}/${action}`);
    } catch {
      setActive((a) => !a);
    } finally {
      setPending(false);
    }
  }

  return { active, pending, toggle };
}
