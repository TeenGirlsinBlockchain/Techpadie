"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/app/lib/api-client";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";

interface PendingCreator {
  id: string;
  bio: string | null;
  expertise: string[];
  user: {
    id: string;
    email: string;
    displayName: string;
  };
  createdAt: string;
}

export default function AdminCreatorsPage() {
  const [creators, setCreators] = useState<PendingCreator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<{ data: PendingCreator[] }>("/api/admin/creators/pending?skip=0&take=50")
      .then((res) => setCreators(res.data || []))
      .catch((err) => alert(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleModerate = async (profileId: string, action: "approve" | "reject") => {
    try {
      const reason = action === "reject" ? window.prompt("Rejection reason:") : undefined;
      if (action === "reject" && !reason) return; // Cancelled

      await fetchApi(`/api/admin/creators/${profileId}/${action}`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
      
      setCreators((prev) => prev.filter((c) => c.id !== profileId));
    } catch (err: any) {
      alert(err.message || `Failed to ${action} creator`);
    }
  };

  if (isLoading) return <div className="animate-pulse h-64 bg-white rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Creator Approvals</h2>
        <p className="text-gray-500">Review applications to teach on Techpadie.</p>
      </div>

      {creators.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <CheckCircleIcon className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">Inbox Zero!</h3>
          <p className="text-gray-500">No pending creator applications.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-500 uppercase">
                <th className="p-4">Applicant</th>
                <th className="p-4">Expertise</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {creators.map((creator) => (
                <tr key={creator.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{creator.user.displayName}</p>
                    <p className="text-sm text-gray-500">{creator.user.email}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {creator.expertise.map((exp, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-[#227FA1] text-xs font-bold rounded-md">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleModerate(creator.id, "approve")} className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 font-bold rounded-lg hover:bg-emerald-100 mr-2">
                      Approve
                    </button>
                    <button onClick={() => handleModerate(creator.id, "reject")} className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100">
                      Reject
                    </button>
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