import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { api, ApiError } from "@/lib/api";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="max-w-sm mx-auto px-5 py-14 text-center">
        <div className="text-4xl mb-4">📧</div>
        <h1 className="font-display text-xl font-semibold mb-2">
          Check your email
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed">
          If an account exists for <strong>{email}</strong>, we've sent a link
          to reset your password. It expires in 30 minutes.
        </p>
        <Link
          to="/login"
          className="text-primary font-semibold text-sm mt-5 inline-block"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-14">
      <h1 className="font-display text-2xl font-semibold mb-1">
        Reset your password
      </h1>
      <p className="text-sm text-ink-soft mb-6">
        Enter your email and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-border rounded-md px-4 py-3 text-sm outline-none focus:border-primary"
        />
        {error && <p className="text-sm text-heart">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-primary text-white font-semibold text-sm py-3 rounded-full disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-5">
        <Link to="/login" className="text-primary font-semibold">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
