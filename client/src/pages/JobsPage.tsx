import { useState } from "react";
import { useJobs } from "../hooks/useJobs";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";
import { JobFiltersState } from "../types";

const initialFilters: JobFiltersState = {
  search: "",
  location: "",
  type: "",
  minSalary: "",
  maxSalary: "",
};

export default function JobsPage() {
  const [filters, setFilters] = useState<JobFiltersState>(initialFilters);
  const { jobs, loading, error, pagination, fetchJobs } = useJobs(filters);

  const handleReset = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Explore Open Tech Roles</h1>
        <p className="mt-1 text-sm text-gray-600">
          Discover positions across top engineering teams and startups.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <JobFilters
            filters={filters}
            onChange={setFilters}
            onReset={handleReset}
          />
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card animate-pulse space-y-3">
                  <div className="h-5 w-1/3 rounded bg-gray-200" />
                  <div className="h-4 w-1/4 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="card py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or resetting filters.
              </p>
              <button onClick={handleReset} className="btn-secondary mt-4 text-xs">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{pagination.page}</span> of{" "}
                    <span className="font-medium">{pagination.totalPages}</span> ({pagination.total} total)
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="btn-secondary text-xs"
                      disabled={pagination.page <= 1}
                      onClick={() => fetchJobs(pagination.page - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className="btn-secondary text-xs"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => fetchJobs(pagination.page + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
