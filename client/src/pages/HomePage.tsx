import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/50 via-white to-gray-50 py-20 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
            <span>🚀 Tech Opportunities Await</span>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Find Your Dream Role in <span className="text-primary-600">Tech</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            DevHire connects world-class developers with forward-thinking tech companies. Search curated remote, hybrid, and on-site engineering roles.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/jobs" className="btn-primary px-6 py-3 text-base">
              Browse Open Jobs
            </Link>
            {user?.role === "EMPLOYER" ? (
              <Link to="/post-job" className="btn-secondary px-6 py-3 text-base">
                Post a Job
              </Link>
            ) : (
              <Link to="/signup" className="btn-secondary px-6 py-3 text-base">
                Join DevHire
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="border-t border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="card text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Targeted Job Search</h3>
              <p className="mt-2 text-sm text-gray-600">
                Filter by work type (Remote, Hybrid, On-site), salary range, location, and key technical skills.
              </p>
            </div>

            <div className="card text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Seamless Applications</h3>
              <p className="mt-2 text-sm text-gray-600">
                Candidates apply with customized cover letters and track status in real-time from review to offer.
              </p>
            </div>

            <div className="card text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Employer Dashboard</h3>
              <p className="mt-2 text-sm text-gray-600">
                Manage job listings, review applicant pools, and update application statuses with full audit control.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
