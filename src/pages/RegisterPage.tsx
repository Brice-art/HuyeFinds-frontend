import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { ApiError } from "@/lib/api";

const inputClass =
  "border border-border rounded-md px-4 py-3 text-sm outline-none focus:border-primary";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(name, email, phone, password);
      navigate("/home");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-14">
      <h1 className="font-display text-2xl font-semibold mb-1">
        Create your account
      </h1>
      <p className="text-sm text-ink-soft mb-6">
        Save favorites and leave reviews for other students.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <input
          type="text"
          required
          minLength={2}
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <div>
          <input
            type="tel"
            required
            minLength={7}
            maxLength={20}
            placeholder="Phone number (e.g. +250 7xx xxx xxx)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`${inputClass} w-full`}
          />
          <p className="text-[11px] text-ink-faint mt-1">
            Used for account recovery — never shown publicly.
          </p>
        </div>
        <div>
          <input
            type="password"
            required
            minLength={8}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} w-full`}
          />
          <p className="text-[11px] text-ink-faint mt-1">
            At least 8 characters, with one uppercase letter and one number.
          </p>
        </div>
        {error && <p className="text-sm text-heart">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-primary text-white font-semibold text-sm py-3 rounded-full disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-5">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
