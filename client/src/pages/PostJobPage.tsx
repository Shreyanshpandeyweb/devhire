import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { JobType } from "../types";

export default function PostJobPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<JobType>("REMOTE");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [description, setDescription] = useState("");
  const [requirementsInput, setRequirementsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const min = parseInt(salaryMin, 10);
    const max = parseInt(salaryMax, 10);

    if (min > max) {
      setError("Minimum salary cannot be greater than maximum salary.");
      setLoading(false);
      return;
    }

    const requirements = requirementsInput
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    if (requirements.length === 0) {
      setError("Please provide at least one requirement.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/jobs", {
        title,
        company,
        location,
        type,
        salaryMin: min,
        salaryMax: max,
        description,
        requirements,
      });

      navigate(`/jobs/${res.data.data.id}`);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        setError(axiosErr.response?.data?.error || "Failed to post job");
      } else {
        setError("Failed to post job");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900">Post a New Job Opportunity</h1>
        <p className="mt-1 text-sm text-gray-600">
          Reach thousands of top-tier software engineers and tech talent.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="title">Job Title</label>
            <input
              id="title"
              type="text"
              className="input"
              required
              minLength={3}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Fullstack Engineer"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="company">Company Name</label>
              <input
                id="company"
                type="text"
                className="input"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="label" htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                className="input"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Remote"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="type">Workplace Type</label>
            <select
              id="type"
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value as JobType)}
            >
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">On-site</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="salaryMin">Minimum Salary ($/yr)</label>
              <input
                id="salaryMin"
                type="number"
                className="input"
                required
                min={0}
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="80000"
              />
            </div>
            <div>
              <label className="label" htmlFor="salaryMax">Maximum Salary ($/yr)</label>
              <input
                id="salaryMax"
                type="number"
                className="input"
                required
                min={0}
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="130000"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="description">Job Description</label>
            <textarea
              id="description"
              className="input min-h-[140px] resize-y"
              required
              minLength={20}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, mission, responsibilities, and team culture..."
            />
          </div>

          <div>
            <label className="label" htmlFor="requirements">Requirements (One per line)</label>
            <textarea
              id="requirements"
              className="input min-h-[100px] resize-y"
              required
              value={requirementsInput}
              onChange={(e) => setRequirementsInput(e.target.value)}
              placeholder="3+ years TypeScript & React&#10;Experience with Node.js & PostgreSQL&#10;Strong communication skills"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Publishing Job..." : "Publish Job Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
