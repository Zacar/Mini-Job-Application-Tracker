import { useEffect, useState } from "react";
import { useApplications } from "./hooks/useApplications";
import type { Application } from "./hooks/useApplications";
import ApplicationForm from "./components/ApplicationForm";
import logo from "./assets/logo.jpg";

export default function App() {
  const { applications, loading, error, fetchApplications, deleteApplication } =
    useApplications();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Control variables for managing our dynamic form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeEditTarget, setActiveEditTarget] = useState<Application | null>(
    null
  );

  useEffect(() => {
    fetchApplications(statusFilter, search);
  }, [statusFilter, search, fetchApplications]);

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Interviewing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Offer":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openAddMode = () => {
    setActiveEditTarget(null); // Clear target to put the form into Add mode
    setIsFormOpen(true);
  };

  const openEditMode = (app: Application) => {
    setActiveEditTarget(app); // Save target to put the form into Edit mode
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number, company: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove your application for ${company}?`
    );
    if (confirmed) {
      const result = await deleteApplication(id);
      if (!result.success) {
        alert(`Error deleting: ${result.error}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      {/* Header Banner */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-35 h-15" />
            <p className="text-sm text-black-500">
              Track your Jobs Applications
            </p>
          </div>
          <button
            onClick={openAddMode}
            className="bg-red-500 hover:bg-red-900 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            + Add Application
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter and Search Controls */}
        <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Search Applications
            </label>
            <input
              type="text"
              placeholder="Search by company or job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            >
              <option value="">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </section>

        {/* Dynamic States */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
            <p className="text-gray-500 text-sm">
              Loading your tracker metrics...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            ⚠️ Error loading data: {error}
          </div>
        )}

        {!loading && applications.length === 0 && (
          <div className="text-center bg-white border border-dashed border-gray-300 rounded-xl py-16 px-4">
            <p className="text-gray-400 text-lg font-medium mb-1">
              No job applications found
            </p>
            <p className="text-gray-400 text-sm">
              Try adjusting your filters or add a fresh tracking application
              string.
            </p>
          </div>
        )}

        {/* Responsive Grid of Application Entries */}
        {!loading && applications.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <article
                key={app.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
                      {app.job_type}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 leading-snug mb-0.5">
                    {app.job_title}
                  </h3>
                  <p className="text-gray-600 font-medium text-sm mb-4">
                    {app.company_name}
                  </p>

                  {app.notes && (
                    <p className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg p-2.5 italic line-clamp-2 mb-4">
                      "{app.notes}"
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    Applied: {new Date(app.applied_date).toLocaleDateString()}
                  </span>
                  {app.updated_at &&
                    new Date(app.updated_at).toLocaleDateString() !==
                      new Date(app.applied_date).toLocaleDateString() && (
                      <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                        ✏️ Edited:{" "}
                        {new Date(app.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditMode(app)} // 👈 Hooks into edit function
                      className="text-xs font-medium text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 px-2.5 py-1.5 rounded-md transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(app.id, app.company_name)}
                      className="text-xs font-medium text-red-600 hover:text-white hover:bg-red-600 border border-transparent hover:border-red-700 bg-red-50 px-2.5 py-1.5 rounded-md transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Shared Application Form Modal (Add & Edit Orchestrator) */}
      <ApplicationForm
        key={activeEditTarget ? `edit-${activeEditTarget.id}` : "add-mode"} // makes the state swap instantly without ESLint warnings
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmitSuccess={() => fetchApplications(statusFilter, search)}
        editingApplication={activeEditTarget}
      />
    </div>
  );
}
