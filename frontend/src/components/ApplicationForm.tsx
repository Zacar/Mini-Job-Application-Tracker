import React, { useState } from "react";
import type { Application } from "../hooks/useApplications";

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  editingApplication?: Application | null;
}

export default function ApplicationForm({
  isOpen,
  onClose,
  onSubmitSuccess,
  editingApplication,
}: FormProps) {
  const [companyName, setCompanyName] = useState<string>(
    editingApplication?.company_name || ""
  );
  const [jobTitle, setJobTitle] = useState<string>(
    editingApplication?.job_title || ""
  );
  const [jobType, setJobType] = useState<string>(
    editingApplication?.job_type || "Full-time"
  );

  const [status, setStatus] = useState<string>(
    editingApplication?.status || "Applied"
  );
  const [notes, setNotes] = useState<string>(editingApplication?.notes || "");
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  // Form Handler Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const appId = editingApplication?.id;
    const payload = {
      company_name: companyName,
      job_title: jobTitle,
      job_type: jobType,
      status,
      notes: notes || null,
      applied_date: editingApplication
        ? editingApplication.applied_date
        : new Date().toISOString(),
      updated_at: editingApplication ? new Date().toISOString() : null,
    };

    try {
      const url = editingApplication
        ? `http://localhost:8080/applications/${appId}`
        : "http://localhost:8080/applications";

      const method = editingApplication ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSubmitSuccess();
        onClose();
      } else {
        alert("Failed to submit form data.");
      }
    } catch (error) {
      console.error("Form transmission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-fade-in">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {editingApplication
            ? "📝 Edit Application"
            : "💼 Add New Application"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Company Name
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Job Title
            </label>
            <input
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
              >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Interview details, salary options..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
