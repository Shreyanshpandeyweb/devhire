import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { Job, Application } from "../types";
import { useAuth } from "../hooks/useAuth";
import ApplicationForm from "../components/ApplicationForm";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);

  const fetchJobDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<{ data: Job }>(`/jobs/${id}`);
      setJob(res.data.data);

      if (user && user.role === "EMPLOYER" && user.id === res.data.data.employerId) {
        const appRes = await api.get<{ data: Application[] }>(`/jobs/${id}/applications`);
        setApplications(appRes.data.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load job details";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const handleStatusChange = async (appId: string, status: string) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      fetchJobDetails();
    } catch {
      alert("Failed to update application status");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-gray-900">Job Not Found</h2>
        <p className="mt-2 text-sm text-gray-600">{error || "This job listing is unavailable."}</p>
        <Link to="/jobs" className="btn-primary mt-4">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const isOwner = user?.role === "EMPLOYER" && user.id === job.employerId;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
        &larr; Back to all jobs
      </Link>

      <div className="card mt-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="mt-1 text-base text-gray-600">{job.company} &bull; {job.location}</p>
          </div>
          <span className="self-start rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
            {job.type}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 border-y border-gray-100 py-4 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-900">Salary Range:</span> ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
          </div>
          <div>
            <span className="font-medium text-gray-900">Posted by:</span> {job.employer.name}
          </div>
          <div>
            <span className="font-medium text-gray-900">Applications:</span> {job._count.applications}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900">Job Description</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">{job.description}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-700">
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Action Button for Candidate */}
        {!isOwner && user?.role === "CANDIDATE" && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            {applied ? (
              <div className="rounded-lg bg-green-50 p-4 text-sm font-medium text-green-700">
                &check; You have successfully applied to this position!
              </div>
            ) : !showApplyModal ? (
              <button onClick={() => setShowApplyModal(true)} className="btn-primary">
                Apply for this Position
              </button>
            ) : null}
          </div>
        )}

        {!user && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              Please{" "}
              <Link to="/signin" className="font-semibold text-primary-600 hover:underline">
                sign in as a candidate
              </Link>{" "}
              to apply for this position.
            </p>
          </div>
        )}

        {showApplyModal && (
          <ApplicationForm
            jobId={job.id}
            onSuccess={() => {
              setApplied(true);
              setShowApplyModal(false);
            }}
            onCancel={() => setShowApplyModal(false)}
          />
        )}
      </div>

      {/* Owner View: List of Applicants */}
      {isOwner && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">Applicant Submissions ({applications.length})</h2>
          {applications.length === 0 ? (
            <div className="card mt-4 py-8 text-center text-sm text-gray-500">
              No candidates have applied to this job yet.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.candidate.name}</h3>
                      <p className="text-xs text-gray-500">{app.candidate.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="REVIEWED">REVIEWED</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
                    <p className="font-medium text-gray-900">Cover Letter:</p>
                    <p className="mt-1 whitespace-pre-line">{app.coverLetter}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
