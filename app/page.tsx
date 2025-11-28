export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-inter font-semibold mb-4">
        Techpadie
      </h1>

      <p className="text-lg font-lexend text-zinc-300 max-w-lg text-center">
        Learn blockchain. Take quizzes. Earn rewards.
      </p>

      <div className="flex gap-4 mt-8">
        <a
          href="/signup"
          className="px-6 py-3 rounded-lg bg-white text-black font-inter font-medium hover:bg-zinc-200 transition"
        >
          Get Started
        </a>

        <a
          href="/login"
          className="px-6 py-3 rounded-lg border border-zinc-500 font-inter hover:bg-zinc-900 transition"
        >
          Login
        </a>
      </div>
    </main>
  );
}
