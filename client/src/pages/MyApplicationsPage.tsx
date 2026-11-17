import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { Application } from "../types";

const statusColors: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  REVIEWED: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyApps() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get<{ data: Application[] }>("/applications/me");
        setApplications(res.data.data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load applications";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchMyApps();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Job Applications</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track the status of roles you have applied for on DevHire.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : applications.length === 0 ? (
        <div className="card py-12 text-center">
          <h3 className="text-base font-semibold text-gray-900">No applications submitted yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Browse our open listings and apply for positions matching your profile.
          </p>
          <Link to="/jobs" className="btn-primary mt-4">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <Link to={`/jobs/${app.job.id}`} className="text-lg font-semibold text-primary-600 hover:underline">
                    {app.job.title}
                  </Link>
                  <p className="mt-1 text-sm text-gray-600">{app.job.company}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[app.status] || "bg-gray-100 text-gray-700"}`}>
                  {app.status}
                </span>
              </div>

              <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                <span className="font-semibold text-gray-700">Cover Letter Submitted:</span>
                <p className="mt-1 line-clamp-3 whitespace-pre-line">{app.coverLetter}</p>
              </div>

              <div className="mt-3 text-right text-xs text-gray-400">
                Applied on {new Date(app.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
