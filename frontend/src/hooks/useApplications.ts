import { useState, useCallback } from "react";

export interface Application {
  id: number;
  company_name: string;
  job_title: string;
  job_type: "Internship" | "Full-time" | "Part-time";
  status: "Applied" | "Interviewing" | "Offer" | "Rejected";
  applied_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/applications`;

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1 & 5. Fetch all applications (with optional status filtering and searching)
  const fetchApplications = useCallback(
    async (status?: string, search?: string) => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL(API_BASE_URL);
        if (status) url.searchParams.append("status", status);
        if (search) url.searchParams.append("search", search);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch applications");

        const resData = await response.json();
        setApplications(resData.data);
      } catch (err) {
        const errorInstance = err as Error;
        setError(errorInstance.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 2. Add a new application
  const addApplication = async (data: Partial<Application>) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to add application");
      }
      const resData = await response.json();

      // Update state immediately
      setApplications((prev) => [resData.data, ...prev]);
      return { success: true };
    } catch (err) {
      const errorInstance = err as Error;
      setError(errorInstance.message);
    }
  };

  // 3. Edit an existing application (PATCH)
  const updateApplication = async (id: number, data: Partial<Application>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update application");
      }
      const resData = await response.json();

      // Replace old application data with updated version
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? resData.data : app))
      );
      return { success: true };
    } catch (err) {
      const errorInstance = err as Error;
      setError(errorInstance.message);
    }
  };

  // 4. Delete an application (With Optimistic UI Update)
  const deleteApplication = async (id: number) => {
    // Keep a backup of current state in case backend fails
    const originalApplications = [...applications];

    // OPTIMISTIC UPDATE: Remove instantly from UI so it feels lightning fast
    setApplications((prev) => prev.filter((app) => app.id !== id));

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete application");
      return { success: true };
    } catch (err) {
      const errorInstance = err as Error;
      setError(errorInstance.message);
      setApplications(originalApplications);
      return { success: false, error: errorInstance.message };
    }
  };

  return {
    applications,
    loading,
    error,
    fetchApplications,
    addApplication,
    updateApplication,
    deleteApplication,
  };
};
