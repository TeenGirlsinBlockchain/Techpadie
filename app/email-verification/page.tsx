"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/app/lib/api-client";

export default function EmailVerificationPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(60);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const timerFinished = seconds === 0;

  // Get email from sessionStorage (set by login page)
  useEffect(() => {
    const pendingEmail = sessionStorage.getItem("pendingLoginEmail");
    if (!pendingEmail) {
      // No pending login — redirect back to login
      router.push("/login");
      return;
    }
    setEmail(pendingEmail);
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (seconds === 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const formatTime = (time: number) => {
    return `${time} sec${time !== 1 ? "s" : ""}`;
  };

  // Handle individual digit input
  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste (paste full code at once)
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 0) return;

    const newCode = [...code];
    for (let i = 0; i < pasted.length && i < 6; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);

    // Focus last filled input or the next empty one
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // Submit OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetchApi<{
  data: { user: { role: string } };
}>("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });

      // Clear stored email
      sessionStorage.removeItem("pendingLoginEmail");

      // Redirect based on role
      if (response.data.user.role === "CREATOR") {
        router.push("/creator");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again.";
      setError(message);
      // Clear code on error
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP (re-trigger login step 1)
  const handleResend = useCallback(async () => {
    if (!email) return;
    setError("");

    try {
      // We don't have the password stored, so we just inform the user
      // In a real app, you'd either store a temp token or have a dedicated resend endpoint
      // For now, redirect back to login
      setError("Please log in again to receive a new code.");
      setTimeout(() => {
        sessionStorage.removeItem("pendingLoginEmail");
        router.push("/login");
      }, 2000);
    } catch {
      setError("Failed to resend code. Please try logging in again.");
    }

    setSeconds(60);
  }, [email, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-100 text-center">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-inter font-semibold text-gray-900">
            Email Verification
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-gray-800">
              {email || "your email"}
            </span>
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Verification Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Code Input Fields — 6 digits */}
          <div className="flex justify-center items-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                placeholder="•"
                className="w-11 h-14 text-center text-xl font-inter font-bold rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label={`Digit ${index + 1}`}
              />
            ))}

            {/* Timer */}
            <div className="text-sm w-16 text-left font-lexend text-gray-600 ml-2">
              {timerFinished ? (
                <>Didn&apos;t get it?</>
              ) : (
                <span className="font-medium text-gray-800">
                  {formatTime(seconds)}
                </span>
              )}
            </div>
          </div>

          {/* Button */}
          {timerFinished ? (
            <button
              type="button"
              onClick={handleResend}
              className="w-full mt-4 px-6 py-3 rounded-lg bg-teal-600 text-white font-inter font-medium hover:bg-teal-700 transition focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
            >
              Resend code
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || code.join("").length !== 6}
              className="w-full mt-4 px-6 py-3 rounded-lg bg-teal-600 text-white font-inter font-medium hover:bg-teal-700 transition focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Continue"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}