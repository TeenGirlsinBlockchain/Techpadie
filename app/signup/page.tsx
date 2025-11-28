import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-100">
        
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl font-inter font-semibold text-gray-900">
            Create account
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Its time to earn while you learn the fall way.
          </p>
        </header>

        {/* Sign-Up Form */}
        <form className="space-y-4">
          
          {/* Input Fields */}
          <input
            type="text"
            placeholder="Full name"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Full name"
          />

          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Email address"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Password"
          />

          <input
            type="password"
            placeholder="Confirm password"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Confirm password"
          />
          
          {/* Terms and Conditions Note */}
          <p className="text-xs text-gray-500 pt-2 font-lexend">
            Note: By signing up, as a user on our platform, 
            <Link href="/terms" className="text-sky-700 hover:text-sky-600 transition underline">
              {" "}you agree to our Terms and conditions
            </Link>
            .
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 px-6 py-3 rounded-lg bg-[#227FA1] cursor-pointer text-white font-inter font-medium hover-[#227FA0] transition focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
          >
            Get started
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm font-lexend text-black">
          Already have an account?{" "}
          <Link href="/login" className="text-teal-600 hover:text-teal-700 font-medium transition">
            log in here
          </Link>
        </div>
      </div>
    </div>
  );
}