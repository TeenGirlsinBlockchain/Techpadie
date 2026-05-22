"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/app/lib/api-client";

export default function SignUpPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await fetchApi("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          displayName,
          email,
          password,
        }),
      });

      setSuccess(true);
      // Wait 2 seconds, then redirect to login page
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-slate-100 transition duration-300 hover:shadow-xl">
        
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-slate-900 tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-sans">
            It's time to earn while you learn the Flare way.
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-sans flex items-start space-x-2 animate-fade-in">
            <span className="font-semibold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-5 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-sans flex items-start space-x-2 animate-fade-in">
            <span className="font-semibold">✅</span>
            <span>Account created successfully! Redirecting you to login...</span>
          </div>
        )}

        {/* Sign-Up Form */}
        <form className="space-y-4 font-sans" onSubmit={handleSubmit}>
          
          {/* Input Fields */}
          <div>
            <input
              type="text"
              placeholder="Full name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              disabled={isLoading || success}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition disabled:opacity-60"
              aria-label="Full name"
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || success}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition disabled:opacity-60"
              aria-label="Email address"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading || success}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition disabled:opacity-60"
              aria-label="Password"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading || success}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition disabled:opacity-60"
              aria-label="Confirm password"
            />
          </div>
          
          {/* Terms and Conditions Note */}
          <p className="text-xs text-slate-500 pt-2 font-display">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-brand-600 hover:text-brand-700 hover:underline transition font-semibold">
              Terms and Conditions
            </Link>
            .
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full mt-4 px-6 py-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-display font-medium shadow-md shadow-brand-100 hover:shadow-lg transition focus:outline-none focus:ring-4 focus:ring-brand-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? "Creating account..." : "Get started"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm font-display text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 hover:text-brand-700 hover:underline font-semibold transition">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}