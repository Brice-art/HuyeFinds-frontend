import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api, ApiError } from "@/lib/api";

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="max-w-sm mx-auto px-5 py-14 text-center">
        <h1 className="font-display text-xl font-semibold mb-2">
          Invalid reset link
        </h1>
        <p className="text-sm text-ink-soft mb-5">
          This link is missing its reset token. Request a new one.
        </p>
        <Link
          to="/forgot-password"
          className="text-primary font-semibold text-sm"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      navigate("/login");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-14">
      <h1 className="font-display text-2xl font-semibold mb-1">
        Choose a new password
      </h1>
      <p className="text-sm text-ink-soft mb-6">
        At least 8 characters, with one uppercase letter and one number.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <input
          type="password"
          required
          minLength={8}
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border border-border rounded-md px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border border-border rounded-md px-4 py-3 text-sm outline-none focus:border-primary"
        />
        {error && <p className="text-sm text-heart">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-primary text-white font-semibold text-sm py-3 rounded-full disabled:opacity-60"
        >
          {submitting ? "Resetting…" : "Reset password"}
        </button>
      </form>
    </div>
  );
}
