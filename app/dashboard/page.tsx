import WelcomeSection from './components/sections/WelcomeSection';
import GamifiedStatsStrip from './components/sections/GamifiedStatsStrip';
import RecentActivity from './components/sections/RecentActivity';
import ContinueLearning from './components/sections/ContinueLearning';
import CoursesForSale from './components/sections/CoursesForSale';

export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8 pb-8">
      {/* 1. Welcome — greeting, daily tip, streak */}
      <WelcomeSection />

      {/* 2. Gamified Stats Strip — XP, streak, level, etc */}
      <GamifiedStatsStrip />

      {/* 3. Main content grid — courses left, activity right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left 2/3 — Learning sections */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <ContinueLearning />
          <CoursesForSale />
        </div>

        {/* Right 1/3 — Activity feed */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}