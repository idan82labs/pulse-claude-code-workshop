import type { Activity, PortfolioSummary, ProjectsResponse } from "../shared/types";

async function readJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function loadDashboard() {
  const [summary, projectResponse, activityResponse] = await Promise.all([
    readJson<PortfolioSummary>("/api/summary"),
    readJson<ProjectsResponse>("/api/projects"),
    readJson<{ activities: Activity[] }>("/api/activity")
  ]);

  return {
    summary,
    projects: projectResponse.projects,
    activities: activityResponse.activities
  };
}
