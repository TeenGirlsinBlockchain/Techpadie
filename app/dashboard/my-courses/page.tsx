// app/dashboard/my-courses/page.tsx
import MascotBanner from '../components/MascotBanner';
import EnrolledCourseCard from '../components/EnrolledCourseCard';
// You should import your data types here
// import { CourseData } from '@/types/dashboard'; 

// Mock data (This is where you would fetch data from your backend)
const userStreakData = {
    currentStreak: 10,
    dailyGoalMet: true,
};

const enrolledCoursesData = [
    {
        courseId: 101,
        title: 'Blockchain Fundamentals: Concepts & Theory',
        progressPercentage: 85,
        lessonsCompleted: 8,
        totalLessons: 10,
        isCompleted: false,
    },
    {
        courseId: 205,
        title: 'Solana Ecosystem Development',
        progressPercentage: 100,
        lessonsCompleted: 15,
        totalLessons: 15,
        isCompleted: true,
    },
    {
        courseId: 302,
        title: 'Web3 Content Writing',
        progressPercentage: 42,
        lessonsCompleted: 4,
        totalLessons: 9,
        isCompleted: false,
    },
];

export default function MyCoursesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-inter font-bold text-white">My Courses</h1>

      {/* 1. Dynamic Mascot Banner */}
      <MascotBanner 
        currentStreak={userStreakData.currentStreak}
        dailyGoalMet={userStreakData.dailyGoalMet}
      />

      {/* 2. Enrolled Courses List */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-zinc-300">Currently Enrolled ({enrolledCoursesData.length})</h2>
        <div className="space-y-4">
          {enrolledCoursesData.map((course) => (
            <EnrolledCourseCard key={course.courseId} {...course} />
          ))}
        </div>
      </section>

      {/* 3. Completed Courses (Optional section based on design) */}
       <section className="space-y-4 pt-4 border-t border-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-300">Completed Courses</h2>
        <div className="text-zinc-500">
            {enrolledCoursesData.filter(c => c.isCompleted).length === 0 ? (
                <p>No courses completed yet. Keep learning!</p>
            ) : (
                 enrolledCoursesData.filter(c => c.isCompleted).map((course) => (
                    <EnrolledCourseCard key={course.courseId} {...course} />
                ))
            )}
        </div>
      </section>
    </div>
  );
}