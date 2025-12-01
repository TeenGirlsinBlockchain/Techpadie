
export default function DashboardHome() {
  return (
    <div className="space-y-8">
      
      {/* 1. Top Banner / Welcome Section */}
      <section className="bg-[#1F2937] p-6 rounded-xl shadow-xl border border-[#2D3748]">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Welcome Back, Titi 👋
            </h1>
            <p className="text-zinc-400 mt-1">
              Ready to continue your learning journey? You are doing amazing!
            </p>
            <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition">
              Continue Learning
            </button>
          </div>
          {/* Placeholder for the abstract illustration shown in the design */}
          <div className="w-24 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg opacity-70"></div>
        </div>
      </section>

      {/* 2. Key Statistics/Metrics Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder for Stat Cards (we'll build these next) */}
        <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] h-24">Courses Enrolled</div>
        <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] h-24">Hours Learned</div>
        <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] h-24">Learning Streak</div>
        <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] h-24">Quizzes Completed</div>
      </section>

      {/* 3. Main Content Grid (Learning Cards and Right Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Course Cards (Takes 2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Continue Learning</h2>
          {/* Placeholder for Course Cards (we'll build these next) */}
          <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] h-32">Course Card 1</div>
          <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] h-32">Course Card 2</div>
        </div>

        {/* Right Column: Timer, Motivation (Takes 1/3 width on large screens) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] h-32">Today&apos;s Learning Timer</div>
          <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] h-32">Daily Motivation</div>
        </div>
      </div>
    </div>
  );
}