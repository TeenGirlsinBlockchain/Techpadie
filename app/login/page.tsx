import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-100">
        
        {/* Header Section */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-inter font-semibold text-gray-900">
            Welcome back
          </h1>
          {/* Adjusted instruction text for standard login */}
          <p className="text-sm text-gray-600 mt-1">
            Log in with your email and password to continue.
          </p>
        </header>

        {/* Login Form */}
        <form className="space-y-4">
          
          {/* Email Input Field */}
          <input
            type="email"
            placeholder="Enter email address"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Email address"
          />

          {/* Password Input Field (Added) */}
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Password"
          />

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-lexend">
                Remember me
              </label>
            </div>

           <Link href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 font-lexend">
              Forgot password?
            </Link> 
           
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 px-6 py-3 rounded-lg bg-teal-600 text-white font-inter font-medium hover:bg-teal-700 transition focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
          >
            Log In
          </button>
        </form>

        {/* Sign-Up Link */}
        <div className="mt-6 text-center text-sm font-lexend">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-teal-600 hover:text-teal-700 font-medium transition">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}