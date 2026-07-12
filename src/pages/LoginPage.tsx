import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { ApiError } from "@/lib/api";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-14">
      <h1 className="font-display text-2xl font-semibold mb-1">Welcome back</h1>
      <p className="text-sm text-ink-soft mb-6">Sign in to save favorites and leave reviews.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-border rounded-md px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-border rounded-md px-4 py-3 text-sm outline-none focus:border-primary"
        />
        {error && <p className="text-sm text-heart">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-primary text-white font-semibold text-sm py-3 rounded-full disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-5">
        No account? <Link to="/register" className="text-primary font-semibold">Create one</Link>
      </p>
    </div>
  );
}
