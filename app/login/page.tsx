"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/app/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetchApi<{
  data: {
    otpRequired: boolean;
    user?: { role: string };
  };
}>("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

const data = response.data;
if (!data.otpRequired && data.user) {
        // Admin: session created directly, redirect based on role
       if (data.user.role === "ADMIN") {
  window.location.href = "/admin";
} else if (data.user.role === "CREATOR") {
  window.location.href = "/creator";
} else {
  window.location.href = "/dashboard";
}
      } else {
        // Student/Creator: OTP required, redirect to verification page
        // Store email in sessionStorage so the verification page can use it
        sessionStorage.setItem("pendingLoginEmail", email);
        router.push("/email-verification");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-100">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-inter font-semibold text-gray-900">
            Welcome back
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Log in with your email and password to continue.
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Email address"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Password"
          />

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700 font-lexend"
              >
                Remember me
              </label>
            </div>

            <Link
              href="/forgot-password"
              className="text-sm text-teal-600 hover:text-teal-700 font-lexend"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 px-6 py-3 rounded-lg bg-teal-600 text-white font-inter font-medium hover:bg-teal-700 transition focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-lexend">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-teal-600 hover:text-teal-700 font-medium transition"
          >
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}