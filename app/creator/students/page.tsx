"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/app/lib/api-client";
import { UsersIcon, AwardIcon } from "lucide-react";

interface StudentEnrollment {
  id: string;
  createdAt: string; 
  user: {
    displayName: string;
    email: string;
  };
  course: {
    title: string;
  };
  completedAt: string | null;
}

export default function CreatorStudentsPage() {
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<{ data: StudentEnrollment[] }>("/api/creator/students?skip=0&take=50")
      .then((res) => setEnrollments(res.data || []))
      .catch((err) => console.error("Failed to load students", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="animate-pulse h-64 bg-white rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">My Students</h2>
        <p className="text-gray-500">Track enrollments and progress across all your courses.</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-[#227FA1] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No students yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Once your courses are published and users start learning, their enrollment data will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Student</th>
                <th className="p-4">Enrolled Course</th>
                <th className="p-4">Enrollment Date</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900 text-sm">{enr.user.displayName}</p>
                    <p className="text-xs text-gray-500">{enr.user.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-gray-700">{enr.course.title}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(enr.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    {enr.completedAt ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md">
                        <AwardIcon className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md">
                        In Progress
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}